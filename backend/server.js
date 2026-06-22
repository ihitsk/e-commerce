require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usuariosRouter = require('./routes/usuarios');
const produtosRouter = require('./routes/produtos');
const pedidosRouter = require('./routes/pedidos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares — limite aumentado para suportar foto em base64
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    /\.vercel\.app$/,              // qualquer preview do Vercel
    process.env.FRONTEND_URL       // URL customizada (opcional)
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rotas da API
app.use('/api/usuarios', usuariosRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/pedidos', pedidosRouter);

// Rota de saúde
app.get('/', (req, res) => {
  res.json({ status: 'PAM API online 🚀', versao: '2.0.0' });
});

// Conexão com MongoDB Local e inicialização do servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });