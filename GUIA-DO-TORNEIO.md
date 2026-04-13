# 🏖️ Aninha do Beach — Guia Completo: Como Iniciar um Torneio

## Pré-requisito

Inicie o servidor:

```bash
npm start
```

Acesse `http://localhost:3000` no navegador. No card **"🏖️ Aninha do Beach"** na tela inicial, clique nos botões para acessar cada módulo.

---

## PASSO 1 — Configurar o Evento

**Página:** Clique em **⚙️ Gerenciamento** → abre `campeonato.html`

1. **Dados do Evento**
   - Preencha: nome do campeonato, data, hora de início, descrição
   - Defina o **status** como `Inscrições Abertas` quando estiver pronto para receber atletas

2. **Banner** (opcional)
   - Cole uma URL de imagem para o banner do evento

3. **Local e Mapa**
   - Nome do local, endereço
   - Coordenadas (latitude/longitude) para o mapa aparecer na página pública

4. **Cronograma**
   - Adicione os horários oficiais: abertura, início dos jogos, intervalos, finals
   - Cada item tem **hora** e **atividade**

5. **Quadras** ⚠️ **OBRIGATÓRIO**
   - Clique **+ Quadra** para cadastrar cada quadra disponível (ex: "Quadra 1", "Quadra 2")
   - Defina superfície e se é coberta
   - Sem quadras cadastradas, não é possível alocar partidas!

6. **FAQ** (opcional)
   - Perguntas e respostas que aparecerão na página pública

7. **Patrocinadores** (opcional)
   - Nome, nível (ouro/prata/bronze) e logo

8. **Ativações & Brindes** (opcional)
   - Sorteios, ativações de marca, etc.

9. **Contingência** (opcional)
   - Planos para chuva e vento forte

10. Clique **💾 Salvar Tudo**

---

## PASSO 2 — Criar Categorias e Regras

**Página:** No gerenciamento, clique **🏐 Categorias** → abre `categorias.html`

1. Clique **+ Nova Categoria**
2. Preencha:
   - **Nome** (ex: "Masculina A", "Feminina B", "Mista Iniciante")
   - **Tipo**: Masculina, Feminina ou Mista
   - **Máx. Duplas**: limite de duplas (ex: 16)

3. **Regras do Jogo** — configure para cada categoria:

   | Regra | Opções | Exemplo |
   |-------|--------|---------|
   | Formato | 1 set / Melhor de 3 | Melhor de 3 |
   | Pontos por set | 4, 6 ou 8 games | 6 |
   | Tiebreak | Sim / Não | Sim |
   | Super Tiebreak | Sim / Não | Sim (usado no 3º set) |
   | No-Ad (sem vantagem) | Sim / Não | Não |
   | Golden Point | Sim / Não | Não |

4. **Formato de Classificação**:
   - **Grupos + Eliminatórias** (mais comum): fase de grupos → mata-mata
   - **Eliminatória Simples**: direto no mata-mata
   - **Eliminatória Dupla**: com repescagem
   - **Todos contra Todos**: round-robin completo

5. **Critérios de Desempate** (arrastar para reordenar):
   - Vitórias → Saldo de Sets → Saldo de Games → Confronto Direto

6. Ou use um **Preset Rápido**:
   - 🏆 **Competitivo**: Melhor de 3, tiebreak, super TB
   - ⚡ **Jogo Rápido**: 1 set, no-ad, golden point
   - 🤝 **Amistoso**: 1 set, tiebreak normal
   - 🎾 **Profissional BTB**: Melhor de 3, super TB, no-ad

7. Clique **Salvar**

> 💡 Crie todas as categorias antes de inscrever atletas.

---

## PASSO 3 — Cadastrar Atletas

**Página:** No gerenciamento, clique **👥 Inscrições** → abre `inscricoes.html` → aba **Atletas**

1. Clique **+ Novo Atleta**
2. Preencha:
   - **Nome** (obrigatório)
   - Telefone, e-mail (opcionais, para contato)
   - Foto (URL)
   - Ranking (pontuação prévia, se houver)
3. Repita para todos os participantes

> 💡 Cadastre TODOS os atletas antes de montar as duplas.

---

## PASSO 4 — Montar Duplas

**Página:** `inscricoes.html` → aba **Duplas**

1. Clique **+ Nova Dupla**
2. Selecione **Atleta 1** e **Atleta 2** (devem estar cadastrados)
3. Selecione a **Categoria** da dupla
4. Defina o **Seeding** (número de cabeça-de-chave, ex: 1 = favorita)
5. Clique **Salvar**

> ⚠️ Cada dupla é vinculada a UMA categoria. Se os mesmos atletas jogam em outra categoria, crie outra dupla.

---

## PASSO 5 — Realizar Inscrições

**Página:** `inscricoes.html` → aba **Inscrições**

1. Clique **+ Nova Inscrição**
2. Selecione a **Dupla** e a **Categoria**
3. O sistema verifica automaticamente:
   - ✅ Se há vagas na categoria → Status: **Confirmado**
   - ⏳ Se a categoria está lotada → Status: **Lista de Espera**
   - ⚠️ Se há conflito de horário com outra inscrição do mesmo atleta → Exibe alerta

4. **Lista de Espera** (aba dedicada):
   - Se um inscrito desistir, você pode **Promover** da lista de espera
   - Duplas promovidas passam para "Confirmado" automaticamente

---

## PASSO 6 — Check-in no Dia do Evento

**Página:** `inscricoes.html` → aba **Check-in**

1. Conforme atletas chegam, marque o **check-in** de cada um
2. Use a busca rápida para encontrar por nome
3. Confirme que as duplas estão completas (ambos os atletas presentes)

---

## PASSO 7 — Gerar a Chave / Bracket

**Página:** `campeonato.html` (Gerenciamento)

> ⚠️ Este é o passo mais importante! Ele cria automaticamente os grupos e as partidas.

1. No gerenciamento, use o recurso de **Gerar Chave** para cada categoria
2. O sistema irá:
   - Pegar todas as duplas com inscrição **Confirmada** da categoria
   - Ordenar por **seeding** (cabeças-de-chave ficam separadas)
   - Criar **Grupos** (ex: 4 grupos de 4 duplas)
   - Gerar **todas as partidas** da fase de grupos (cada dupla vs cada outra no grupo)
   - Atribuir **horários** sequenciais
3. Resultado: todas as partidas aparecem como **"Agendado"**

**Opção adicional — Sortear:**
- Use **Sortear** para embaralhar aleatoriamente as duplas dentro dos grupos
- Útil se não quiser usar o seeding como base

> 💡 Mude o status do evento para **"Em Andamento"** quando os jogos começarem.

---

## PASSO 8 — Operar o Torneio (Mesa Organizadora)

**Página:** Clique em **🏓 Mesa Organizadora** → abre `mesa.html`

### Fluxo de cada partida:

```
📣 Chamar → 🏟️ Em Quadra → 🔴 Em Jogo → ✅ Resultado → Próxima!
```

### 8.1 — Chamar Duplas para a Quadra

1. Clique **📣 Chamar Próxima Partida**
2. O sistema automaticamente:
   - Encontra a próxima partida **agendada**
   - Encontra uma quadra **disponível**
   - Muda o status para **"chamando"**
   - Envia notificação via WebSocket (aparece no telão e na página pública!)
3. As duplas devem se apresentar na quadra indicada

### 8.2 — Registrar Placar

1. Na coluna "Em Jogo", clique **✏️ Placar** na partida
2. Abre o modal de placar:
   - **Clique** no número para aumentar o score (+1)
   - **Clique direito** para diminuir (-1)
   - Clique **+ Set** para adicionar um novo set
3. Complete todos os sets necessários

### 8.3 — Confirmar Resultado

1. Clique **✅ Confirmar Resultado**
2. O sistema automaticamente:
   - Define o **vencedor** (quem ganhou mais sets)
   - Muda o status para **"encerrado"**
   - Libera a quadra (volta para "disponível")
   - Soma pontos ao ranking da dupla vencedora
   - Se houver próxima fase, **insere o vencedor na próxima partida**

### 8.4 — WO (Walkover / Desistência)

1. No modal de placar, clique **🚫 Registrar WO**
2. Selecione qual dupla não compareceu
3. A outra dupla vence automaticamente

### 8.5 — Ações Rápidas

- **💬 Enviar Mensagem**: broadcast para todas as telas (ex: "Intervalo de 15 min")
- **🌧️ Contingência**: ativar plano de chuva/vento
- **📋 Log de Atividades**: veja tudo que aconteceu

### 8.6 — Progressão do Torneio

O fluxo natural é:

```
Fase de Grupos → Oitavas → Quartas → Semifinal → FINAL 🏆
```

Conforme os resultados dos grupos são registrados, o sistema gera as partidas da fase eliminatória com os classificados de cada grupo.

---

## PASSO 9 — Acompanhamento em Tempo Real

### Para o Público — Página Pública
**Acesse:** `campeonato-publico.html` (ou clique **👁️ Visualização Pública**)

- **Ao Vivo**: jogos em andamento, próximos, últimos resultados
- **Chave**: grupos com classificação + bracket eliminatória
- **Atletas**: buscar, ver perfil, favoritar, ver estatísticas
- **Programação**: partidas organizadas por quadra com horários
- **Resultados**: pódio (🥇🥈🥉) + todos os resultados
- **Info**: cronograma, local/mapa, FAQ, patrocinadores

### Para o Telão / TV
**Acesse:** `telao.html` (ou clique **📺 Telão / TV**)

- Abra em uma TV/projetor em tela cheia (F11)
- Mostra jogos ao vivo com placar grande
- Próximas partidas e últimos resultados
- **Chamada animada**: quando uma dupla é chamada, aparece um banner destacado
- Relógio em tempo real
- Ticker com mensagens na parte inferior
- Atualiza automaticamente via WebSocket

---

## PASSO 10 — Finalizar o Torneio

1. Quando a **final** for encerrada, o pódio aparece automaticamente na página de Resultados
2. Mude o status do evento para **"Finalizado"** no gerenciamento
3. O ranking final fica disponível na página pública
4. Use **📤 Exportar Dados** no card inicial para salvar um backup JSON de tudo

---

## Resumo Visual do Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│  1. CONFIGURAR EVENTO          (campeonato.html)            │
│     Nome, data, local, quadras, cronograma                  │
├─────────────────────────────────────────────────────────────┤
│  2. CRIAR CATEGORIAS           (categorias.html)            │
│     Masculina A, Feminina B, regras de cada uma             │
├─────────────────────────────────────────────────────────────┤
│  3. CADASTRAR ATLETAS          (inscricoes.html → Atletas)  │
│     Nome, contato, ranking                                  │
├─────────────────────────────────────────────────────────────┤
│  4. MONTAR DUPLAS              (inscricoes.html → Duplas)   │
│     Atleta 1 + Atleta 2 + Categoria + Seeding              │
├─────────────────────────────────────────────────────────────┤
│  5. INSCREVER DUPLAS           (inscricoes.html → Inscrições│
│     Dupla → Categoria → Confirmado/Lista de Espera         │
├─────────────────────────────────────────────────────────────┤
│  6. CHECK-IN                   (inscricoes.html → Check-in) │
│     Marcar presença no dia do evento                        │
├─────────────────────────────────────────────────────────────┤
│  7. GERAR CHAVE                (campeonato.html)            │
│     Cria grupos + partidas automaticamente                  │
├─────────────────────────────────────────────────────────────┤
│  8. OPERAR TORNEIO             (mesa.html)                  │
│     Chamar → Placar → Resultado → Repetir                  │
├─────────────────────────────────────────────────────────────┤
│  9. ACOMPANHAR                 (publico + telão)            │
│     Público vê ao vivo, TV mostra placar grande             │
├─────────────────────────────────────────────────────────────┤
│ 10. FINALIZAR                  (campeonato.html)            │
│     Pódio, ranking final, exportar backup                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Dicas Importantes

- **Ordem importa**: Evento → Categorias → Atletas → Duplas → Inscrições → Gerar Chave
- **Quadras são obrigatórias**: sem elas não é possível alocar jogos
- **Seeding**: numere as duplas mais fortes (1, 2, 3...) para separá-las nos grupos
- **Tudo em tempo real**: qualquer alteração na mesa aparece instantaneamente no telão e na página pública via WebSocket
- **Backup**: exporte o JSON periodicamente durante o evento
- **Telão**: abra em TV/projetor no modo tela cheia (F11) para melhor experiência
