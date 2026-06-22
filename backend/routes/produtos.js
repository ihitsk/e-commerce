const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');

// GET /api/produtos - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ createdAt: -1 });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produtos.' });
  }
});

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produto.' });
  }
});

// POST /api/produtos - Criar novo produto (admin)
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, preco, imagem, estoque } = req.body;

    const novoProduto = new Produto({ nome, descricao, preco, imagem, estoque });
    await novoProduto.save();

    res.status(201).json({ mensagem: 'Produto criado com sucesso!', produto: novoProduto });
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ erro: 'Erro ao criar produto.' });
  }
});

// PUT /api/produtos/:id - Editar produto (admin)
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao, preco, imagem, estoque } = req.body;

    const atualizado = await Produto.findByIdAndUpdate(
      req.params.id,
      { nome, descricao, preco, imagem, estoque },
      { new: true, runValidators: true }
    );

    if (!atualizado) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ mensagem: 'Produto atualizado com sucesso!', produto: atualizado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto.' });
  }
});

// DELETE /api/produtos/:id - Deletar produto (admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletado = await Produto.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ mensagem: 'Produto deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar produto.' });
  }
});

module.exports = router;
