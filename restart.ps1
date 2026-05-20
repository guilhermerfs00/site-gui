Write-Host "Reiniciando..." -ForegroundColor Magenta
& "$PSScriptRoot\stop.ps1"
Start-Sleep -Seconds 1
& "$PSScriptRoot\start.ps1"
