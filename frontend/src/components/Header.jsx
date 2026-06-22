import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, LogIn, User, LogOut, ChevronDown, Shield, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Header.css'

function Header() {
  const { usuario, logout } = useAuth()
  const { totalItens, setDrawerAberto } = useCart()
  const navigate = useNavigate()
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [menuMobile, setMenuMobile] = useState(false)
  const dropdownRef = useRef(null)

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownAberto(false)
    setMenuMobile(false)
    navigate('/home')
  }

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : ''

  const fotoUrl = usuario?.foto || null

  return (
    <>
      <header className="header">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/home" className="logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>L!VE</span>
          </Link>

          {/* Nav desktop */}
          <nav className="nav-desktop">
            <Link to="/home" className="nav-link">Loja</Link>

            {/* Carrinho */}
            {usuario && (
              <button className="cart-btn" onClick={() => setDrawerAberto(true)} aria-label="Carrinho">
                <ShoppingCart size={20} />
                {totalItens > 0 && <span className="cart-badge">{totalItens > 99 ? '99+' : totalItens}</span>}
              </button>
            )}

            {/* Autenticação */}
            {usuario ? (
              <div className="user-menu" ref={dropdownRef}>
                {/* Botão — abre/fecha apenas ao clicar */}
                <button
                  className="user-trigger"
                  onClick={() => setDropdownAberto(v => !v)}
                  aria-expanded={dropdownAberto}
                >
                  {fotoUrl
                    ? <img src={fotoUrl} alt="foto" className="avatar-img" />
                    : <div className="avatar-initials">{iniciais}</div>
                  }
                  <span className="user-label">{usuario.nome?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={dropdownAberto ? 'chevron open' : 'chevron'} />
                </button>

                {dropdownAberto && (
                  <div className="dropdown">
                    <div className="dropdown-info">
                      <p className="dropdown-name">{usuario.nome}</p>
                      <p className="dropdown-email">{usuario.email}</p>
                    </div>
                    <div className="dropdown-sep" />
                    <Link to="/perfil" className="dropdown-item" onClick={() => setDropdownAberto(false)}>
                      <User size={15} /> Meu Perfil
                    </Link>
                    <Link to="/minhas-compras" className="dropdown-item" onClick={() => setDropdownAberto(false)}>
                      <ShoppingCart size={15} /> Minhas Compras
                    </Link>
                    {(usuario.role === 'admin' || usuario.role === 'adm') && (
                      <Link to="/adm" className="dropdown-item" onClick={() => setDropdownAberto(false)}>
                        <Shield size={15} /> Painel Admin
                      </Link>
                    )}
                    <div className="dropdown-sep" />
                    <button className="dropdown-item item-danger" onClick={handleLogout}>
                      <LogOut size={15} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-login">
                <LogIn size={16} /> Entrar
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button className="mobile-toggle" onClick={() => setMenuMobile(v => !v)} aria-label="Menu">
            {menuMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Nav mobile */}
        {menuMobile && (
          <nav className="nav-mobile">
            <Link to="/home" className="mobile-link" onClick={() => setMenuMobile(false)}>Loja</Link>
            {usuario && (
              <button className="mobile-link mobile-cart" onClick={() => { setDrawerAberto(true); setMenuMobile(false) }}>
                <ShoppingCart size={18} /> Carrinho {totalItens > 0 && `(${totalItens})`}
              </button>
            )}
            {usuario ? (
              <>
                <Link to="/perfil" className="mobile-link" onClick={() => setMenuMobile(false)}>Perfil</Link>
                <Link to="/minhas-compras" className="mobile-link" onClick={() => setMenuMobile(false)}>Minhas Compras</Link>
                {(usuario.role === 'admin' || usuario.role === 'adm') && (
                  <Link to="/adm" className="mobile-link" onClick={() => setMenuMobile(false)}>Admin</Link>
                )}
                <button className="mobile-link mobile-logout" onClick={handleLogout}>Sair</button>
              </>
            ) : (
              <Link to="/login" className="mobile-link" onClick={() => setMenuMobile(false)}>Entrar</Link>
            )}
          </nav>
        )}
      </header>
    </>
  )
}

export default Header