const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// POST /api/usuarios/cadastro - Criar novo usuário
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, usuario, email, senha, confirmacao, endereco, telefone, cep } = req.body;

    if (senha !== confirmacao) {
      return res.status(400).json({ erro: 'As senhas não coincidem.' });
    }

    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const usuarioExistente = await Usuario.findOne({ usuario });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este nome de usuário já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({
      nome,
      usuario,
      email,
      senha: senhaHash,
      endereco,
      telefone,
      cep
    });

    await novoUsuario.save();

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        usuario: novoUsuario.usuario,
        email: novoUsuario.email,
        role: novoUsuario.role
      }
    });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// POST /api/usuarios/login - Autenticar usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        usuario: usuario.usuario,
        email: usuario.email,
        role: usuario.role,
        foto: usuario.foto || ''
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// GET /api/usuarios - Listar todos os usuários (admin)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha').sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});

// GET /api/usuarios/:id - Buscar um usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário.' });
  }
});

// PUT /api/usuarios/:id - Atualizar perfil
router.put('/:id', async (req, res) => {
  try {
    const { nome, usuario, email, endereco, telefone, cep, foto } = req.body;
    const campos = { nome, usuario, email, endereco, telefone, cep };
    // Só atualiza foto se foi enviada
    if (foto !== undefined) campos.foto = foto;

    const atualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      campos,
      { new: true, runValidators: true }
    ).select('-senha');

    if (!atualizado) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json({ mensagem: 'Perfil atualizado com sucesso!', usuario: atualizado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
  }
});


// DELETE /api/usuarios/:id - Deletar usuário (admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json({ mensagem: 'Usuário deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar usuário.' });
  }
});

module.exports = router;
