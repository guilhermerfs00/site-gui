SHELL = cmd.exe
CLOUDFLARED = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

.PHONY: start stop restart
.DEFAULT_GOAL := start

## Derruba tudo e sobe de novo, exibindo a URL publica do Cloudflare
start:
	@powershell -NoProfile -ExecutionPolicy Bypass -File up.ps1

## Encerra o servidor e o tunel
stop:
	@echo Encerrando servidor Node.js...
	@-taskkill /F /IM node.exe 2>nul
	@echo Encerrando tunel Cloudflare...
	@-taskkill /F /IM cloudflared.exe 2>nul
	@echo Tudo encerrado.

## Reinicia tudo
restart: stop start
