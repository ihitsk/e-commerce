# Plano: Estruturar e Conectar o Projeto MERN PAM ao MongoDB Atlas

## Contexto
O projeto é um e-commerce (PAM) com estrutura MERN:
- **Frontend**: React + Vite + React Router (porta 5173)
- **Backend**: Node.js + Express + Mongoose (porta 5000)

Atualmente faltam: conexão real com o Atlas, rotas de API, modelos Mongoose, script de start do backend, e as páginas do frontend ainda usam dados fictícios/alertas em vez de chamadas reais à API.

---

## Open Questions

> [!IMPORTANT]
> **Você precisa fornecer sua MongoDB Atlas Connection String!**
> 
> A string tem este formato: `mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco`
> 
> Você pode obtê-la no painel do Atlas em: **Database → Connect → Drivers → Node.js**
> 
> Por segurança, ela será armazenada em um arquivo `.env` (nunca commitado no Git).

---

## Mudanças Propostas

### Backend (`c:\Users\240372\Desktop\PAM\backend`)

#### [NEW] `.env`
Arquivo com variáveis de ambiente (MONGO_URI, PORT). Você preenche com sua string do Atlas.

#### [MODIFY] [server.js](file:///c:/Users/240372/Desktop/PAM/backend/server.js)
- Reorganizar: carregar `dotenv` primeiro
- Usar `process.env.MONGO_URI` para conexão
- Adicionar middleware `cors`
- Importar e usar as rotas de usuários e produtos

#### [NEW] `models/Usuario.js`
Schema Mongoose para usuários:
- `nome`, `usuario`, `email`, `senha` (hash), `endereco`, `telefone`, `cep`, `role` (admin/comum)

#### [NEW] `models/Produto.js`
Schema Mongoose para produtos:
- `nome`, `descricao`, `preco`, `imagem`, `estoque`

#### [NEW] `routes/usuarios.js`
Rotas REST:
- `POST /api/usuarios/cadastro` - Criar novo usuário
- `POST /api/usuarios/login` - Autenticar usuário
- `GET /api/usuarios` - Listar usuários (admin)
- `PUT /api/usuarios/:id` - Atualizar perfil
- `DELETE /api/usuarios/:id` - Deletar usuário (admin)

#### [NEW] `routes/produtos.js`
Rotas REST:
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Detalhe de um produto
- `POST /api/produtos` - Criar produto (admin)
- `PUT /api/produtos/:id` - Editar produto (admin)
- `DELETE /api/produtos/:id` - Deletar produto (admin)

#### [MODIFY] `package.json`
Adicionar script `"start": "node server.js"` e instalar `bcryptjs` para hash de senha.

---

### Frontend (`c:\Users\240372\Desktop\PAM\frontend`)

#### [NEW] `src/services/api.js`
Arquivo central para chamadas à API usando `fetch`, apontando para `http://localhost:5000`.

#### [MODIFY] [Login.jsx](file:///c:/Users/240372/Desktop/PAM/frontend/src/pages/Login.jsx)
- Remover campo de "Confirmar Senha" (isso é cadastro, não login)
- Conectar ao endpoint `POST /api/usuarios/login`

#### [MODIFY] [Cadastro.jsx](file:///c:/Users/240372/Desktop/PAM/frontend/src/pages/Cadastro.jsx)
- Conectar ao endpoint `POST /api/usuarios/cadastro`

#### [MODIFY] [Home.jsx](file:///c:/Users/240372/Desktop\PAM\frontend\src\pages\Home.jsx)
- Buscar produtos reais via `GET /api/produtos`

#### [MODIFY] [ProdutoDetalhe.jsx](file:///c:/Users/240372/Desktop/PAM/frontend/src/pages/ProdutoDetalhe.jsx)
- Buscar produto pelo ID via `GET /api/produtos/:id`

#### [MODIFY] [PainelAdm.jsx](file:///c:/Users/240372/Desktop/PAM/frontend/src/pages/PainelAdm.jsx)
- Buscar e gerenciar produtos/usuários reais via API

#### [MODIFY] [Perfil.jsx](file:///c:/Users/240372/Desktop/PAM/frontend/src/pages/Perfil.jsx)
- Conectar ao endpoint `PUT /api/usuarios/:id`

---

## Plano de Execução
1. Criar arquivo `.env` no backend (com placeholder para você preencher)
2. Instalar `bcryptjs` no backend
3. Criar modelos Mongoose (`Usuario.js`, `Produto.js`)
4. Criar rotas da API (`routes/usuarios.js`, `routes/produtos.js`)
5. Atualizar `server.js` com estrutura correta
6. Adicionar script `start` no `package.json` do backend
7. Criar `src/services/api.js` no frontend
8. Conectar as páginas do frontend às rotas reais
9. Iniciar backend (`npm start`) e frontend (`npm run dev`)

## Plano de Verificação
- Testar `GET http://localhost:5000/api/produtos` no navegador
- Cadastrar um usuário pelo frontend e ver no Atlas
- Verificar listagem de produtos no painel admin
