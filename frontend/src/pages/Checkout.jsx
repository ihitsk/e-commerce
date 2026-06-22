import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, QrCode, FileText, CheckCircle, ArrowLeft, ShoppingBag, Lock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { pedidosAPI } from '../services/api'
import './Checkout.css'

const METODOS = [
  { id: 'pix', label: 'PIX', icon: QrCode, desc: 'Aprovação imediata · 5% de desconto' },
  { id: 'boleto', label: 'Boleto', icon: FileText, desc: 'Vence em 3 dias úteis' },
  { id: 'cartao', label: 'Cartão de Crédito', icon: CreditCard, desc: 'Até 12x sem juros' },
]

function Checkout() {
  const { itens, totalPreco, limpar } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [metodo, setMetodo] = useState('pix')
  const [cep, setCep] = useState(usuario?.cep || '')
  const [logradouro, setLogradouro] = useState(usuario?.endereco || '')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' })
  const [processando, setProcessando] = useState(false)

  useEffect(() => {
    if (usuario?.cep) {
      const rawCep = usuario.cep.replace(/\D/g, '')
      if (rawCep.length === 8) {
        fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
          .then(res => res.json())
          .then(data => {
            if (!data.erro) {
              setLogradouro(data.logradouro)
              setBairro(data.bairro)
              setCidade(data.localidade)
              setUf(data.uf)
            }
          })
          .catch(() => {})
      }
    }
  }, [usuario])

  const desconto = metodo === 'pix' ? totalPreco * 0.05 : 0
  const totalFinal = totalPreco - desconto

  const fmtMoney = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`

  const handleConfirmar = async (e) => {
    e.preventDefault()
    if (!itens.length) return
    if (!logradouro.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !uf.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço.')
      return
    }
    const enderecoFinal = `${logradouro}, ${numero}${complemento ? ' - ' + complemento : ''}, ${bairro}, ${cidade} - ${uf}`

    setProcessando(true)
    try {
      await pedidosAPI.criar({
        usuarioId: usuario.id || usuario._id,
        itens: itens.map(i => ({
          produtoId: i._id,
          nome: i.nome,
          preco: i.preco,
          quantidade: i.quantidade,
          imagem: i.imagem
        })),
        total: totalFinal,
        metodoPagamento: metodo,
        enderecoEntrega: enderecoFinal
      })
      limpar()
      navigate('/minhas-compras')
    } catch (err) {
      alert('Erro ao finalizar: ' + err.message)
    } finally {
      setProcessando(false)
    }
  }

  const handleCepChange = async (e) => {
    let rawCep = e.target.value.replace(/\D/g, '')
    let formattedCep = rawCep
    if (rawCep.length > 5) {
      formattedCep = rawCep.slice(0, 5) + '-' + rawCep.slice(5, 8)
    }
    setCep(formattedCep)
    if (rawCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setLogradouro(data.logradouro)
          setBairro(data.bairro)
          setCidade(data.localidade)
          setUf(data.uf)
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
      }
    }
  }

  if (!itens.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <ShoppingBag size={40} strokeWidth={1.2} />
          <p>Seu carrinho está vazio</p>
          <button onClick={() => navigate('/home')}>Ir para a loja</button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Voltar
        </button>

        <h1 className="checkout-title">Finalizar Compra</h1>

        <form onSubmit={handleConfirmar} className="checkout-layout">
          {/* Coluna esquerda */}
          <div className="checkout-main">

            {/* Endereço */}
            <section className="checkout-card">
              <h2 className="card-title">📍 Endereço de Entrega</h2>
              <div className="endereco-grid">
                <div className="field">
                  <label>CEP *</label>
                  <input type="text" placeholder="00000-000" maxLength={9} value={cep} onChange={handleCepChange} required />
                </div>
                <div className="field logradouro">
                  <label>Logradouro *</label>
                  <input type="text" placeholder="Rua, Avenida..." value={logradouro} onChange={e => setLogradouro(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Número *</label>
                  <input type="text" placeholder="123" value={numero} onChange={e => setNumero(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Complemento</label>
                  <input type="text" placeholder="Apto, Bloco..." value={complemento} onChange={e => setComplemento(e.target.value)} />
                </div>
                <div className="field bairro">
                  <label>Bairro *</label>
                  <input type="text" placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} required />
                </div>
                <div className="field cidade">
                  <label>Cidade *</label>
                  <input type="text" placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} required />
                </div>
                <div className="field uf">
                  <label>UF *</label>
                  <input type="text" placeholder="SP" maxLength={2} value={uf} onChange={e => setUf(e.target.value.toUpperCase())} required />
                </div>
              </div>
            </section>

            {/* Método de pagamento */}
            <section className="checkout-card">
              <h2 className="card-title">💳 Forma de Pagamento</h2>
              <div className="metodos-grid">
                {METODOS.map(m => {
                  const Icon = m.icon
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={`metodo-btn ${metodo === m.id ? 'active' : ''}`}
                      onClick={() => setMetodo(m.id)}
                    >
                      <Icon size={20} />
                      <span className="metodo-label">{m.label}</span>
                      <span className="metodo-desc">{m.desc}</span>
                    </button>
                  )
                })}
              </div>

              {/* Campos PIX */}
              {metodo === 'pix' && (
                <div className="pix-info">
                  <div className="pix-qr">
                    <div className="pix-qr-box">
                      <QrCode size={72} strokeWidth={1} />
                    </div>
                    <div className="pix-details">
                      <p className="pix-chave-label">Chave PIX</p>
                      <p className="pix-chave">00020126580014br.gov.bcb.pix...</p>
                      <span className="pix-tag">Simulated · Demo</span>
                      <p className="pix-discount">✅ 5% de desconto aplicado!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Campos Boleto */}
              {metodo === 'boleto' && (
                <div className="boleto-info">
                  <FileText size={24} />
                  <div>
                    <p>O boleto será gerado após a confirmação.</p>
                    <p className="boleto-sub">Prazo de compensação: até 3 dias úteis após o pagamento.</p>
                  </div>
                </div>
              )}

              {/* Campos Cartão */}
              {metodo === 'cartao' && (
                <div className="cartao-form">
                  <div className="field">
                    <label>Número do Cartão</label>
                    <input
                      required={metodo === 'cartao'}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={cartao.numero}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g,'').slice(0,16)
                        v = v.replace(/(.{4})/g,'$1 ').trim()
                        setCartao({...cartao, numero: v})
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Nome no Cartão</label>
                    <input required={metodo === 'cartao'} placeholder="JOAO DA SILVA" value={cartao.nome} onChange={e => setCartao({...cartao, nome: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="cartao-row">
                    <div className="field">
                      <label>Validade</label>
                      <input required={metodo === 'cartao'} placeholder="MM/AA" maxLength={5}
                        value={cartao.validade}
                        onChange={e => {
                          let v = e.target.value.replace(/\D/g,'').slice(0,4)
                          if(v.length > 2) v = v.slice(0,2)+'/'+v.slice(2)
                          setCartao({...cartao, validade: v})
                        }}
                      />
                    </div>
                    <div className="field">
                      <label>CVV</label>
                      <input required={metodo === 'cartao'} placeholder="123" maxLength={4} type="password"
                        value={cartao.cvv} onChange={e => setCartao({...cartao, cvv: e.target.value.replace(/\D/g,'').slice(0,4)})} />
                    </div>
                    <div className="field">
                      <label>Parcelas</label>
                      <select>
                        {[1,2,3,6,10,12].map(n => (
                          <option key={n} value={n}>
                            {n}x de {fmtMoney(totalFinal/n)}{n === 1 ? ' (à vista)' : ' sem juros'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Coluna direita — Resumo */}
          <aside className="checkout-aside">
            <section className="checkout-card">
              <h2 className="card-title">🧾 Resumo do Pedido</h2>
              <ul className="checkout-items">
                {itens.map(item => (
                  <li key={item._id} className="checkout-item">
                    <img src={item.imagem} alt={item.nome} />
                    <div>
                      <p className="ci-nome">{item.nome}</p>
                      <p className="ci-qty">Qtd: {item.quantidade}</p>
                    </div>
                    <p className="ci-preco">{fmtMoney(item.preco * item.quantidade)}</p>
                  </li>
                ))}
              </ul>

              <div className="checkout-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{fmtMoney(totalPreco)}</span>
                </div>
                <div className="total-row">
                  <span>Frete</span>
                  <span className="frete-gratis">Grátis</span>
                </div>
                {desconto > 0 && (
                  <div className="total-row desconto-row">
                    <span>Desconto PIX (5%)</span>
                    <span>- {fmtMoney(desconto)}</span>
                  </div>
                )}
                <div className="total-row total-final">
                  <span>Total</span>
                  <span>{fmtMoney(totalFinal)}</span>
                </div>
              </div>

              <button type="submit" disabled={processando} className="btn-confirmar">
                <Lock size={15} />
                {processando ? 'Processando...' : 'Confirmar Pedido'}
              </button>
              <p className="checkout-security">🔒 Compra protegida e criptografada</p>
            </section>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default Checkout
