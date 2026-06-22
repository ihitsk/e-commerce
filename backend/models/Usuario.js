const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  usuario: {
    type: String,
    required: [true, 'Nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6
  },
  endereco: {
    type: String,
    default: ''
  },
  telefone: {
    type: String,
    default: ''
  },
  cep: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['comum', 'admin', 'user'],
    default: 'comum'
  },
  foto: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
