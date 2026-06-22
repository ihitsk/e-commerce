const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');

// POST /api/pedidos - Criar novo pedido (e baixar estoque)
router.post('/', async (req, res) => {
  try {
    const { usuarioId, itens, total, metodoPagamento, enderecoEntrega } = req.body;

    if (!usuarioId || !itens?.length || !total || !metodoPagamento) {
      return res.status(400).json({ erro: 'Dados incompletos para criação do pedido.' });
    }

    // ── 1. Valida se todos os produtos têm estoque suficiente ──
    for (const item of itens) {
      const produto = await Produto.findById(item.produtoId);
      if (!produto) {
        return res.status(404).json({ erro: `Produto "${item.nome}" não encontrado.` });
      }
      if (produto.estoque < item.quantidade) {
        return res.status(400).json({
          erro: `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}.`
        });
      }
    }

    // ── 2. Cria o pedido ──
    const pedido = new Pedido({ usuarioId, itens, total, metodoPagamento, enderecoEntrega });
    await pedido.save();

    // ── 3. Decrementa o estoque de cada produto (operação atômica) ──
    for (const item of itens) {
      await Produto.findByIdAndUpdate(
        item.produtoId,
        { $inc: { estoque: -item.quantidade } }
      );
    }

    res.status(201).json({
      mensagem: 'Pedido criado com sucesso!',
      pedido
    });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ erro: 'Erro interno ao criar pedido.' });
  }
});

// GET /api/pedidos/usuario/:id - Pedidos de um usuário específico
router.get('/usuario/:id', async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuarioId: req.params.id }).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pedidos.' });
  }
});

// GET /api/pedidos - Listar todos (admin)
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuarioId', 'nome email usuario').sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar pedidos.' });
  }
});

// GET /api/pedidos/:id - Buscar pedido por ID
router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('usuarioId', 'nome email');
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pedido.' });
  }
});

// PUT /api/pedidos/:id/status - Atualizar status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    res.json({ mensagem: 'Status atualizado!', pedido });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar status.' });
  }
});

module.exports = router;

