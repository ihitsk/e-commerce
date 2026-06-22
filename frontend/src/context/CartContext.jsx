import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { usuario } = useAuth()
  const [itens, setItens] = useState([])
  const [drawerAberto, setDrawerAberto] = useState(false)

  // Load cart when user changes
  useEffect(() => {
    if (!usuario) {
      setItens([])
      return
    }
    const cartKey = `carrinho_${usuario.id || usuario._id}`
    try {
      const salvo = localStorage.getItem(cartKey)
      if (salvo) {
        setItens(JSON.parse(salvo))
      } else {
        setItens([])
      }
    } catch {
      setItens([])
    }
  }, [usuario])

  // Save cart when items change
  useEffect(() => {
    if (!usuario) return
    const cartKey = `carrinho_${usuario.id || usuario._id}`
    localStorage.setItem(cartKey, JSON.stringify(itens))
  }, [itens, usuario])

  const totalItens = itens.reduce((s, i) => s + i.quantidade, 0)
  const totalPreco = itens.reduce((s, i) => s + i.preco * i.quantidade, 0)

  const adicionar = (produto) => {
    setItens(prev => {
      const existe = prev.find(i => i._id === produto._id)
      if (existe) {
        return prev.map(i => i._id === produto._id
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
    setDrawerAberto(true)
  }

  const remover = (id) => setItens(prev => prev.filter(i => i._id !== id))

  const alterar = (id, quantidade) => {
    if (quantidade < 1) { remover(id); return }
    setItens(prev => prev.map(i => i._id === id ? { ...i, quantidade } : i))
  }

  const limpar = () => setItens([])

  return (
    <CartContext.Provider value={{
      itens, totalItens, totalPreco,
      adicionar, remover, alterar, limpar,
      drawerAberto, setDrawerAberto
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
