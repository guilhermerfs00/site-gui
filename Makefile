SHELL = cmd.exe
CLOUDFLARED = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

.PHONY: start stop restart

## Inicia o servidor Node e o tunel Cloudflare
start:
	@echo [1/2] Iniciando servidor Node.js em background...
	@start "Servidor Node" /B node server.js
	@echo [2/2] Iniciando tunel Cloudflare...
	@$(CLOUDFLARED) tunnel --url http://localhost:3000

## Encerra o servidor e o tunel
stop:
	@echo Encerrando servidor Node.js...
	@-taskkill /F /IM node.exe 2>nul
	@echo Encerrando tunel Cloudflare...
	@-taskkill /F /IM cloudflared.exe 2>nul
	@echo Tudo encerrado.

## Reinicia tudo
restart: stop start
