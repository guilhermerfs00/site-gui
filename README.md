# Site GUI

## Como rodar o site localmente e expor online via túnel

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) instalado em `C:\Program Files (x86)\cloudflared\cloudflared.exe`

---

### Comandos rápidos (recomendado)

#### Com `make` (se instalado)

```powershell
make start    # inicia servidor + túnel
make stop     # encerra tudo
make restart  # reinicia tudo
```

#### Com npm (sem precisar de make)

```powershell
# Terminal 1 — servidor
npm start

# Terminal 2 — túnel
npm run tunnel

# Encerrar tudo
npm run stop
```

---

### Passo a passo manual

**1. Abra um terminal na pasta do projeto:**

```powershell
cd D:\site
```

**2. Inicie o servidor Node.js:**

```powershell
node server.js
```

O servidor ficará disponível localmente em `http://localhost:3000`.

**3. Em outro terminal, inicie o túnel Cloudflare:**

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000
```

Aguarde até aparecer a mensagem com o link público, por exemplo:

```
Your quick Tunnel has been created! Visit it at:
https://exemplo-aleatorio.trycloudflare.com
```

Esse link pode ser acessado de qualquer dispositivo enquanto o túnel estiver ativo.

---

### Encerrar o site

**Opção rápida:**

```powershell
npm run stop
```

**Manual:** pressione `Ctrl + C` nos terminais do servidor e do túnel.

---

### Observações

- O link público muda a cada vez que o túnel é iniciado.
- O túnel é temporário e gratuito, sem necessidade de conta.
- Para uso permanente, considere hospedagem em Vercel, Netlify ou VPS.
