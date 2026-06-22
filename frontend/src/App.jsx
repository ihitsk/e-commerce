import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import RotaProtegida from './components/RotaProtegida'
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import ProdutoDetalhe from './pages/ProdutoDetalhe'
import PainelAdm from './pages/PainelAdm'
import Perfil from './pages/Perfil'
import Checkout from './pages/Checkout'
import MinhasCompras from './pages/MinhasCompras'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Header />
            <CartDrawer />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/produto/:id" element={<ProdutoDetalhe />} />
                {/* Protegidas */}
                <Route path="/perfil"         element={<RotaProtegida><Perfil /></RotaProtegida>} />
                <Route path="/minhas-compras" element={<RotaProtegida><MinhasCompras /></RotaProtegida>} />
                <Route path="/checkout"       element={<RotaProtegida><Checkout /></RotaProtegida>} />
                <Route path="/adm"            element={<RotaProtegida adminOnly><PainelAdm /></RotaProtegida>} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App