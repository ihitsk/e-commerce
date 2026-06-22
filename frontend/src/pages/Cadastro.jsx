import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usuariosAPI } from '../services/api'

function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '', usuario: '', endereco: '', telefone: '',
    email: '', cep: '', senha: '', confirmacao: ''
  })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const set = (campo) => (e) => setFormData(prev => ({ ...prev, [campo]: e.target.value }))

  const handleTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`
    if (v.length > 10) v = `${v.slice(0,10)}-${v.slice(10)}`
    setFormData(prev => ({ ...prev, telefone: v }))
  }

  const handleCEP = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8)
    if (v.length > 5) v = `${v.slice(0,5)}-${v.slice(5)}`
    setFormData(prev => ({ ...prev, cep: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.senha !== formData.confirmacao) { setErro('As senhas não coincidem!'); return }
    setErro('')
    setCarregando(true)
    try {
      await usuariosAPI.cadastrar(formData)
      setSucesso(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  if (sucesso) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 className="auth-title">Conta criada!</h2>
          <p className="auth-sub">Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 10a4 4 0 01-8 0" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          PAM<span>Shop</span>
        </div>

        <h2 className="auth-title">Criar conta</h2>
        <p className="auth-sub">Preencha os dados abaixo para começar</p>

        {erro && <div className="auth-erro">⚠️ {erro}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Nome Completo</label>
            <input required type="text" placeholder="João da Silva" value={formData.nome} onChange={set('nome')} />
          </div>

          <div className="auth-row">
            <div className="field">
              <label>Nome de Usuário</label>
              <input required type="text" placeholder="joaosilva" value={formData.usuario} onChange={set('usuario')} />
            </div>
            <div className="field">
              <label>Telefone</label>
              <input required type="text" placeholder="(11) 99999-9999" value={formData.telefone} onChange={handleTelefone} />
            </div>
          </div>

          <div className="field">
            <label>Endereço</label>
            <input required type="text" placeholder="Rua Exemplo, 123 - Cidade/UF" value={formData.endereco} onChange={set('endereco')} />
          </div>

          <div className="auth-row">
            <div className="field">
              <label>CEP</label>
              <input required type="text" placeholder="00000-000" value={formData.cep} onChange={handleCEP} />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input required type="email" placeholder="seu@email.com" value={formData.email} onChange={set('email')} />
            </div>
          </div>

          <div className="auth-row">
            <div className="field">
              <label>Senha</label>
              <input required type="password" placeholder="••••••••" value={formData.senha} onChange={set('senha')} />
            </div>
            <div className="field">
              <label>Confirmar Senha</label>
              <input required type="password" placeholder="••••••••" value={formData.confirmacao} onChange={set('confirmacao')} />
            </div>
          </div>

          <button type="submit" disabled={carregando} className="btn-primary" style={{ marginTop: '0.4rem' }}>
            {carregando ? 'Criando conta...' : 'Criar conta grátis'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}

export default Cadastro