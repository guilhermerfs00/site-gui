Write-Host "Encerrando servidor Node.js..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Write-Host "Encerrando tunel Cloudflare..." -ForegroundColor Yellow
Stop-Process -Name "cloudflared" -Force -ErrorAction SilentlyContinue
Write-Host "Tudo encerrado." -ForegroundColor Green
