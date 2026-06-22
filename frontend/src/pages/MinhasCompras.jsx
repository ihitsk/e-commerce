import { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { pedidosAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './MinhasCompras.css'

const STATUS_LABEL = {
  pendente: { label: 'Aguardando pagamento', color: 'yellow' },
  pago:     { label: 'Pago',                 color: 'blue'   },
  enviado:  { label: 'A caminho',            color: 'orange' },
  entregue: { label: 'Entregue',             color: 'green'  },
  cancelado:{ label: 'Cancelado',            color: 'red'    },
}

const METODO_LABEL = { pix: 'PIX', boleto: 'Boleto', cartao: 'Cartão de Crédito' }

function MinhasCompras() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [abertos, setAbertos] = useState({})

  useEffect(() => {
    const id = usuario?.id || usuario?._id
    if (!id) return
    pedidosAPI.listarDoUsuario(id)
      .then(setPedidos)
      .catch(console.error)
      .finally(() => setCarregando(false))
  }, [usuario])

  const togglePedido = (id) =>
    setAbertos(prev => ({ ...prev, [id]: !prev[id] }))

  const fmtData = (d) => new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  const fmtMoney = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

  if (carregando) {
    return (
      <div className="mc-loading">
        <div className="spinner" />
        <span>Carregando seus pedidos...</span>
      </div>
    )
  }

  return (
    <div className="mc-page">
      <div className="mc-inner">
        <div className="mc-header">
          <div>
            <h1 className="mc-title">Minhas Compras</h1>
            <p className="mc-sub">{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} realizado{pedidos.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/home" className="mc-btn-loja">
            <ShoppingBag size={15} /> Continuar comprando
          </Link>
        </div>

        {pedidos.length === 0 ? (
          <div className="mc-empty">
            <Package size={48} strokeWidth={1.2} />
            <p>Você ainda não fez nenhum pedido</p>
            <span>Explore a loja e faça seu primeiro pedido!</span>
            <Link to="/home" className="mc-btn-ir">Ver produtos</Link>
          </div>
        ) : (
          <div className="mc-list">
            {pedidos.map(pedido => {
              const st = STATUS_LABEL[pedido.status] || STATUS_LABEL.pendente
              const aberto = abertos[pedido._id]

              return (
                <article key={pedido._id} className="mc-card">
                  {/* Cabeçalho do pedido */}
                  <button
                    className="mc-card-header"
                    onClick={() => togglePedido(pedido._id)}
                    aria-expanded={aberto}
                  >
                    <div className="mc-card-left">
                      <div className="mc-order-icon">
                        <Package size={18} />
                      </div>
                      <div>
                        <p className="mc-order-id">Pedido #{pedido._id.slice(-8).toUpperCase()}</p>
                        <p className="mc-order-date">{fmtData(pedido.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mc-card-right">
                      <span className={`mc-status ${st.color}`}>{st.label}</span>
                      <span className="mc-total">{fmtMoney(pedido.total)}</span>
                      {aberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {/* Detalhes expandidos */}
                  {aberto && (
                    <div className="mc-card-body">
                      {/* Itens */}
                      <div className="mc-section">
                        <h3 className="mc-section-title">Itens do pedido</h3>
                        <ul className="mc-items">
                          {pedido.itens.map((item, i) => (
                            <li key={i} className="mc-item">
                              <img src={item.imagem} alt={item.nome} className="mc-item-img" />
                              <div className="mc-item-info">
                                <p className="mc-item-nome">{item.nome}</p>
                                <p className="mc-item-qty">Qtd: {item.quantidade}</p>
                              </div>
                              <p className="mc-item-preco">
                                {fmtMoney(item.preco * item.quantidade)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Informações */}
                      <div className="mc-info-grid">
                        <div className="mc-info-block">
                          <p className="mc-info-label">Pagamento</p>
                          <p className="mc-info-value">{METODO_LABEL[pedido.metodoPagamento] || pedido.metodoPagamento}</p>
                        </div>
                        <div className="mc-info-block">
                          <p className="mc-info-label">Endereço de entrega</p>
                          <p className="mc-info-value">{pedido.enderecoEntrega || '—'}</p>
                        </div>
                        <div className="mc-info-block">
                          <p className="mc-info-label">Data prevista de entrega</p>
                          <p className="mc-info-value mc-delivery">
                            📦 {fmtData(pedido.dataEntregaPrevista)}
                          </p>
                        </div>
                        <div className="mc-info-block">
                          <p className="mc-info-label">Total pago</p>
                          <p className="mc-info-value mc-total-info">{fmtMoney(pedido.total)}</p>
                        </div>
                      </div>

                      {/* Tracker de status */}
                      <div className="mc-tracker">
                        {['pendente','pago','enviado','entregue'].map((s, i) => {
                          const statuses = ['pendente','pago','enviado','entregue']
                          const currentIdx = statuses.indexOf(pedido.status)
                          const done = i <= currentIdx && pedido.status !== 'cancelado'
                          return (
                            <div key={s} className={`tracker-step ${done ? 'done' : ''}`}>
                              <div className="tracker-dot" />
                              {i < 3 && <div className={`tracker-line ${done && i < currentIdx ? 'done' : ''}`} />}
                              <span>{STATUS_LABEL[s].label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MinhasCompras
