import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Usa localStorage para persistência entre abas e reinícios
  useEffect(() => {
    const dados = localStorage.getItem('pam_usuario')
    if (dados) {
      try { setUsuario(JSON.parse(dados)) } catch { localStorage.removeItem('pam_usuario') }
    }
    setCarregando(false)
  }, [])

  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario)
    localStorage.setItem('pam_usuario', JSON.stringify(dadosUsuario))
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('pam_usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
