import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import './CartDrawer.css'

function CartDrawer() {
  const { itens, totalItens, totalPreco, remover, alterar, limpar, drawerAberto, setDrawerAberto } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const handleFinalizar = () => {
    if (!usuario) {
      setDrawerAberto(false)
      navigate('/login')
      return
    }
    setDrawerAberto(false)
    navigate('/checkout')
  }

  return (
    <>
      {/* Overlay */}
      {drawerAberto && (
        <div className="cart-overlay" onClick={() => setDrawerAberto(false)} />
      )}

      {/* Drawer */}
      <aside className={`cart-drawer ${drawerAberto ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={18} />
            <span>Carrinho</span>
            {totalItens > 0 && <span className="drawer-count">{totalItens}</span>}
          </div>
          <button className="drawer-close" onClick={() => setDrawerAberto(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {itens.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingBag size={48} strokeWidth={1.2} />
              <p>Seu carrinho está vazio</p>
              <span>Adicione produtos para continuar</span>
              <button className="btn-ir-loja" onClick={() => setDrawerAberto(false)}>
                Ver produtos
              </button>
            </div>
          ) : (
            <ul className="drawer-list">
              {itens.map(item => (
                <li key={item._id} className="drawer-item">
                  <img src={item.imagem} alt={item.nome} className="item-img" />
                  <div className="item-info">
                    <p className="item-nome">{item.nome}</p>
                    <p className="item-preco">R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
                    <div className="item-qty">
                      <button onClick={() => alterar(item._id, item.quantidade - 1)}><Minus size={12} /></button>
                      <span>{item.quantidade}</span>
                      <button onClick={() => alterar(item._id, item.quantidade + 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                  <button className="item-remove" onClick={() => remover(item._id)}>
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div className="drawer-footer">
            <div className="footer-subtotal">
              <span>Subtotal</span>
              <span className="footer-total">R$ {totalPreco.toFixed(2).replace('.', ',')}</span>
            </div>
            <p className="footer-frete">🚚 Frete calculado no checkout</p>
            <button className="btn-checkout" onClick={handleFinalizar}>
              Finalizar compra <ArrowRight size={16} />
            </button>
            <button className="btn-limpar" onClick={limpar}>
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
