const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    default: 'Sem descrição disponível.'
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  imagem: {
    type: String,
    default: 'https://placehold.co/400x400/f4f6fa/6366f1?text=Produto'
  },
  categoria: {
    type: String,
    default: 'Geral'
  },
  estoque: {
    type: Number,
    default: 0,
    min: 0
  },
  avaliacao: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Produto', produtoSchema);
