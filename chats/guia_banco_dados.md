# 🗄️ Banco de Dados & Administração — PAMShop

## Qual banco está sendo usado?

**MongoDB Community** rodando **localmente** na sua máquina.

| Detalhe | Valor |
|---|---|
| **Banco** | MongoDB 8.x (Community Edition) |
| **Host** | `localhost` |
| **Porta** | `27017` (padrão) |
| **Nome do banco** | `pam-ecommerce` |
| **String de conexão** | `mongodb://localhost:27017/pam-ecommerce` |
| **Coleções** | `usuarios`, `produtos` |

---

## 🖥️ Como visualizar e gerenciar os dados

### Opção 1 — MongoDB Compass (Interface Gráfica) ⭐ Recomendado

É o gerenciador visual oficial do MongoDB, gratuito.

**Baixar:** [mongodb.com/products/compass](https://www.mongodb.com/products/compass)

**Como usar:**
1. Abra o MongoDB Compass
2. Na tela inicial, cole a string de conexão:
   ```
   mongodb://localhost:27017
   ```
3. Clique em **Connect**
4. Navegue até o banco **`pam-ecommerce`**
5. Clique em **`usuarios`** ou **`produtos`** para ver, editar ou deletar registros

**O que você pode fazer no Compass:**
- ✅ Ver todos os usuários e produtos
- ✅ Editar qualquer campo (clique duplo no valor)
- ✅ Adicionar ou remover registros manualmente
- ✅ Executar queries MongoDB
- ✅ Exportar dados para JSON/CSV
- ✅ Ver índices e performance

---

### Opção 2 — Via Painel Administrativo do Site (mais simples)

Acesse: **[http://localhost:5175/adm](http://localhost:5175/adm)**

> ⚠️ É necessário estar logado primeiro em `/login`

**O que você pode fazer:**
- ✅ Ver, criar, editar e deletar produtos
- ✅ Ver e deletar usuários
- ✅ Visualizar estoque e status dos produtos

---

### Opção 3 — mongosh (Terminal)

Se quiser usar a linha de comando:

```bash
# Abrir o shell do MongoDB
mongosh

# Selecionar o banco
use pam-ecommerce

# Ver todos os produtos
db.produtos.find().pretty()

# Ver todos os usuários (sem senha)
db.usuarios.find({}, { senha: 0 }).pretty()

# Contar documentos
db.produtos.countDocuments()
db.usuarios.countDocuments()

# Buscar produto por nome
db.produtos.findOne({ nome: /tênis/i })

# Deletar um produto pelo ID
db.produtos.deleteOne({ _id: ObjectId("SEU_ID_AQUI") })

# Alterar o role de um usuário para admin
db.usuarios.updateOne(
  { email: "seu@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🔑 Como criar um usuário administrador

Por padrão, todos os usuários criados pelo site têm o role `user`.
Para promover alguém a admin, use o **mongosh**:

```javascript
// Abra o mongosh e execute:
use pam-ecommerce

db.usuarios.updateOne(
  { email: "email_do_usuario@exemplo.com" },
  { $set: { role: "admin" } }
)
```

Após isso, o usuário terá acesso ao **Painel Admin** via o dropdown do header (opção "Painel Admin" aparece só para admins).

---

## 🔧 Comandos de manutenção

```bash
# Popular banco com produtos de exemplo (rode apenas uma vez)
cd backend
node seed.js

# Verificar se MongoDB está rodando (PowerShell)
Get-Service -Name MongoDB

# Iniciar MongoDB se estiver parado
Start-Service -Name MongoDB

# Ver logs do MongoDB
Get-EventLog -LogName Application -Source "MongoDB" -Newest 10
```

---

## 📁 Onde os dados ficam salvos fisicamente?

O MongoDB armazena os dados em:
```
C:\Program Files\MongoDB\Server\8.0\data\
```

> ⚠️ **Nunca delete essa pasta!** São os arquivos do banco de dados.

---

## 🚀 URLs do projeto rodando

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5175 |
| Backend API | http://localhost:5000 |
| API Produtos | http://localhost:5000/api/produtos |
| API Usuários | http://localhost:5000/api/usuarios |
| Painel Admin | http://localhost:5175/adm |
