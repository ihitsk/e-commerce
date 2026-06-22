# Como Continuar e Rodar o Projeto em Casa 🏠

Este guia foi criado para ajudar você a rodar o projeto MERN (PAM) no seu próprio computador ou na sua casa, sem as restrições de rede que ocorrem no laboratório da FATEC.

Na FATEC, a rede bloqueia a conexão com o MongoDB Atlas por segurança (erro `querySrv ENODATA`). Em casa, na sua rede normal ou usando o 4G/5G do seu celular (roteador Wi-Fi do celular), esse bloqueio **não existe** e o projeto funcionará perfeitamente.

---

## 🛠️ Passo 1: Configuração Essencial no MongoDB Atlas (Muito Importante!)

Quando mudamos de rede (do laboratório para casa), o MongoDB Atlas bloqueia a conexão se o seu novo IP não estiver autorizado. 

Para evitar isso, siga estes passos rápidos no painel do MongoDB Atlas:
1. Acesse o site do [MongoDB Atlas](https://cloud.mongodb.com/) e faça login.
2. No menu lateral esquerdo, em **Security**, clique em **Network Access**.
3. Clique no botão **Add IP Address** (Adicionar endereço IP) no canto superior direito.
4. Escolha uma das duas opções:
   - **Allow Access From Anywhere** (Permitir acesso de qualquer lugar - adiciona o IP `0.0.0.0/0`): *Recomendado para estudantes, pois funciona em qualquer rede que você estiver.*
   - Ou clique em **Add Current IP Address** (Adicionar IP atual) para liberar apenas a rede da sua casa.
5. Clique em **Confirm** e aguarde 1 minuto para o status ficar "Active".

---

## 🚀 Passo 2: Como Iniciar o Projeto

Você precisará abrir dois terminais (linhas de comando) no seu VS Code, um para o Backend (servidor) e outro para o Frontend (React/Vite).

### 🖥️ Terminal 1: Iniciar o Servidor (Backend)
1. Certifique-se de estar na pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências (caso mude de computador e não tenha a pasta `node_modules`):
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Se der tudo certo, você verá a mensagem:
   `✅ Conectado ao MongoDB Atlas com sucesso!`
   `🚀 Servidor rodando em http://localhost:5000`

---

### 🎨 Terminal 2: Iniciar o Site (Frontend)
1. Certifique-se de estar na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências (se necessário):
   ```bash
   npm install
   ```
3. Inicie o React/Vite:
   ```bash
   npm run dev
   ```
4. Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

---

## 🧪 Passo 3: Testando a Integração

Agora que tudo está rodando em casa:
1. Acesse `http://localhost:5173`
2. Vá em **Criar Nova Conta** (Cadastro) e preencha os dados de um novo usuário.
3. Se o cadastro for concluído com sucesso, significa que o frontend enviou os dados para o backend e ele salvou no MongoDB Atlas na nuvem!
4. Vá no painel do MongoDB Atlas, em **Database** -> **Browse Collections**, e você verá seu usuário salvo na coleção `usuarios`.
5. Vá no **Painel do Administrador** no frontend e adicione alguns produtos de teste para preencher a sua loja!
