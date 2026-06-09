# ColorJorge

Releitura do jogo Cores com dicas, com salas em tempo real via WebSocket.

## Como rodar

Na pasta `colorjorge/`:

```bash
npm install
npm run dev
```

Isso sobe o servidor WebSocket na porta `8080` e o app React em [http://localhost:3000](http://localhost:3000).

Para rodar separadamente:

```bash
ngrok http 3000
npm run server   # WebSocket em ws://localhost:8080
npm start        # React app
```

## Como jogar

1. Abra [http://localhost:3000](http://localhost:3000) em cada dispositivo ou aba.
2. **Mestre:** escolha "Mestre" → "Criar sala" → compartilhe o codigo de 4 letras.
3. **Jogadores:** escolha "Jogador" → informe o codigo → "Entrar".
4. O mestre envia a pista de cor em `/mestre`; jogadores recebem em `/tabuleiro` e respondem com texto.
5. Respostas aparecem ao vivo no mestre e em `/placar`.

## Variaveis de ambiente

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `REACT_APP_WS_URL` | `ws://localhost:8080` | URL do servidor WebSocket |
| `PORT` | `8080` | Porta do servidor Node |

## Estrutura

- `server/` — servidor WebSocket com salas em memoria
- `src/features/lobby/` — entrada (criar/entrar na sala)
- `src/features/game/RoomProvider.jsx` — estado sincronizado da partida
