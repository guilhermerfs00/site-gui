$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$cf = 'C:\Program Files (x86)\cloudflared\cloudflared.exe'
$logDir = Join-Path $env:TEMP 'site-gui'
New-Item -ItemType Directory -Force $logDir | Out-Null
$nodeLog = Join-Path $logDir 'node.log'
$cfLog = Join-Path $logDir 'cloudflared.log'
Remove-Item $nodeLog, $cfLog, "$nodeLog.err", "$cfLog.err" -ErrorAction SilentlyContinue

Write-Host '[1/3] Encerrando servidor e tunel anteriores...'
Get-Process node, cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

Write-Host '[2/3] Iniciando servidor Node.js...'
Start-Process node -ArgumentList 'server.js' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden `
    -RedirectStandardOutput $nodeLog -RedirectStandardError "$nodeLog.err"
$ok = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Milliseconds 500
    try { Invoke-WebRequest http://127.0.0.1:3000/api/futebol -UseBasicParsing -TimeoutSec 3 | Out-Null; $ok = $true; break } catch {}
}
if (-not $ok) { Write-Host "ERRO: servidor nao respondeu. Veja $nodeLog.err"; exit 1 }

Write-Host '[3/3] Iniciando tunel Cloudflare...'
Start-Process $cf -ArgumentList 'tunnel', '--url', 'http://localhost:3000' -WindowStyle Hidden `
    -RedirectStandardOutput $cfLog -RedirectStandardError "$cfLog.err"
$url = $null
for ($i = 0; $i -lt 60 -and -not $url; $i++) {
    Start-Sleep -Milliseconds 500
    $txt = (Get-Content "$cfLog.err", $cfLog -Raw -ErrorAction SilentlyContinue) -join "`n"
    if ($txt -match 'https://[a-z0-9-]+\.trycloudflare\.com') { $url = $Matches[0] }
}
if (-not $url) { Write-Host "ERRO: URL do tunel nao foi gerada. Veja $cfLog.err"; exit 1 }

# A URL aparece no log antes do tunel conectar e do DNS propagar: espera ficar acessivel
Write-Host '      Aguardando o tunel ficar acessivel (pode levar ate 1 min)...'
$host_ = ([uri]$url).Host
$pronto = $false
for ($i = 0; $i -lt 90 -and -not $pronto; $i++) {
    $txt = (Get-Content "$cfLog.err", $cfLog -Raw -ErrorAction SilentlyContinue) -join "`n"
    if ($txt -match 'Registered tunnel connection') {
        try {
            [System.Net.Dns]::GetHostAddresses($host_) | Out-Null
            $r = Invoke-WebRequest "$url/api/futebol" -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -eq 200) { $pronto = $true; break }
        } catch {}
    }
    Start-Sleep -Seconds 1
}
if (-not $pronto) { Write-Host 'AVISO: o tunel ainda nao responde neste computador; aguarde alguns segundos e tente abrir o link.' }

Write-Host ''
Write-Host '=============================================='
Write-Host ' Local:   http://localhost:3000'
Write-Host " Publico: $url"
Write-Host " Pagina:  $url/futebol-publico.html"
Write-Host '=============================================='
Write-Host 'Use "make stop" para encerrar.'
