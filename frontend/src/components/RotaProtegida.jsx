import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RotaProtegida({ children, adminOnly = false }) {
  const { usuario, carregando } = useAuth()

  if (carregando) return null

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && usuario.role !== 'admin' && usuario.role !== 'adm') {
    return <Navigate to="/home" replace />
  }

  return children
}

export default RotaProtegida
