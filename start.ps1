Write-Host "[1/2] Iniciando servidor Node.js em background..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $PSScriptRoot -WindowStyle Minimized

Write-Host "[2/2] Iniciando tunel Cloudflare..." -ForegroundColor Cyan
Write-Host "Aguarde o link publico aparecer abaixo:" -ForegroundColor Yellow
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000 2>&1 | ForEach-Object {
    if ($_ -match 'https://[a-z0-9\-]+\.trycloudflare\.com') {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  URL PUBLICA: $($Matches[0])" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
    }
    $_
}
