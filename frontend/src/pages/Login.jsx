import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usuariosAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const resposta = await usuariosAPI.login({ email, senha })
      login(resposta.usuario)
      navigate('/home')
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 10a4 4 0 01-8 0" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        <span>L!VE</span>
        </div>

        <h2 className="auth-title">Bem-vindo de volta</h2>
        <p className="auth-sub">Entre na sua conta para continuar</p>

        {erro && <div className="auth-erro">⚠️ {erro}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="field">
            <label>E-mail</label>
            <input
              required type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              required type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>
          <button type="submit" disabled={carregando} className="btn-primary" style={{marginTop:'0.4rem'}}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to="/cadastro">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  )
}

export default Login