# Frontend Evereste

Configure `NEXT_PUBLIC_API_URL=http://localhost:8080` em `.env.local` e rode `bun install` e `bun run dev`. A tela de cadastro usa os endpoints `/api/people` do backend.

O CPF é mascarado e validado no navegador, sem consultar serviço externo; o backend repete as validações antes de salvar.
