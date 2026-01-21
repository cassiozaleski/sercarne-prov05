# SerCarne PRO V5 (Vercel + Google Sheets)

Este projeto é um **app Vite + React** com **Vercel Functions** em `/api` para ler/gravar no Google Sheets.

## 1) Pré-requisitos

- Conta no **GitHub**
- Conta na **Vercel**
- A planilha do Google (Catálogo) já existente
- Um **Service Account** do Google com acesso à planilha

## 2) Variáveis de ambiente (Vercel)

Configure em **Vercel → Project → Settings → Environment Variables** (Production + Preview):

- `GOOGLE_SHEET_ID` = ID da planilha
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = e-mail do service account
- `GOOGLE_PRIVATE_KEY` = chave privada (PEM). Pode colar com `\n` ou quebras de linha.

Opcional (se suas abas tiverem nomes diferentes):

- `SHEET_USUARIOS` (padrão `USUARIOS`)
- `SHEET_PEDIDOS` (padrão `PEDIDOS`)
- `SHEET_RESERVAS` (padrão `RESERVAS`)

> **IMPORTANTE:** compartilhe a planilha com o e-mail do service account como **Editor**.

## 3) Estrutura

- `src/` → app React
- `api/` → Vercel Functions (Node)
  - `/api/auth` → login interno (aba `USUARIOS`)
  - `/api/orders` → salva pedidos
  - `/api/reservas` → grava reservas

## 4) Login (aba USUARIOS)

O `/api/auth` aceita login por:
- Coluna **A** (nome/usuário) **OU**
- Coluna **B** (login)

E valida senha na coluna **C**.

Campos esperados (sem cabeçalho):

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Usuário/Nome | Login | Senha | Tipo/Perfil | Ativo | HomePath |

- `Ativo` aceita: `TRUE`, `SIM`, `1`, `✅`, `X`, etc.
- `Tipo/Perfil` vira `role` (ex.: `admin`, `vendor`, `gestorcomercial`, `cliente_b2b`, `cliente_b2c`)

## 5) Rodar local (opcional)

Recomendado usar **Vercel CLI** para emular as funções:

```bash
npm install
npm run build
npm i -g vercel
vercel login
vercel dev
```

## 6) Deploy

1. Suba para o GitHub
2. Importe na Vercel (New Project)
3. Sete as env vars
4. Deploy

