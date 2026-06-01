# 🃏 Marcador de Truco

Marcador de truco simples e rápido pra usar na mesa do bar, direto do celular. Sem cadastro, sem internet — abriu, contou os pontos.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)

## O que faz

- **Placar gigante** pros dois times, legível a distância na mesa
- **Valor da mão** — toque pra marcar truco (3), seis (6), nove (9) ou doze (12) e o ponto soma certo
- **Nomes editáveis** dos times
- **Mão de onze** destacada automaticamente
- **Série de partidas** — conta as vitórias de cada lado
- **Desfazer** a última jogada
- **Som e vibração** a cada ponto (desligáveis)
- **Salva sozinho** no navegador — fecha e abre que o jogo tá lá
- **Meta configurável** — 12, 15 ou 24 pontos
- 100% **responsivo** e **offline**

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide. Sem banco de dados — tudo no `localStorage` do navegador.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Deploy

Pronto pra Vercel — é só importar o repositório. Build padrão (`next build`), zero variáveis de ambiente.

---

Feito por [@joaomanfre3](https://github.com/joaomanfre3).
