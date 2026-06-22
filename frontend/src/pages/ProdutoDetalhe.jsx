import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, Plus, Minus } from 'lucide-react'
import { produtosAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './ProdutoDetalhe.css'

function ProdutoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { adicionar } = useCart()
  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  useEffect(() => {
    if (!usuario) { navigate('/login'); return }
    produtosAPI.buscarPorId(id)
      .then(dados => setProduto(dados))
      .catch(() => setErro('Produto não encontrado.'))
      .finally(() => setCarregando(false))
  }, [id, usuario, navigate])

  const handleAdicionar = () => {
    for (let i = 0; i < quantidade; i++) adicionar(produto)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  if (carregando) {
    return (
      <div className="detalhe-loading">
        <div className="spinner" />
      </div>
    )
  }

  if (erro || !produto) {
    return (
      <div className="detalhe-err">
        <p>⚠️ {erro}</p>
        <Link to="/home">← Voltar à loja</Link>
      </div>
    )
  }

  return (
    <div className="detalhe-page">
      <div className="detalhe-inner">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Voltar
        </button>

        <div className="detalhe-grid">
          {/* Imagem */}
          <div className="detalhe-img-box">
            <img src={produto.imagem} alt={produto.nome} />
            {produto.estoque === 0 && <div className="detalhe-tag-out">Esgotado</div>}
          </div>

          {/* Info */}
          <div className="detalhe-info">
            <p className="detalhe-categoria">Produto</p>
            <h1 className="detalhe-nome">{produto.nome}</h1>

            <div className="detalhe-stars">
              {[1,2,3,4,5].map(i => <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />)}
              <span>4.8 · 128 avaliações</span>
            </div>

            <div className="detalhe-preco-box">
              <span className="detalhe-preco">R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
              <span className="detalhe-parcel">
                ou 10x de R$ {(produto.preco / 10).toFixed(2).replace('.', ',')} sem juros
              </span>
            </div>

            <p className="detalhe-desc">{produto.descricao}</p>

            {/* Estoque */}
            <div className="detalhe-stock">
              {produto.estoque > 0
                ? <span className="stock-ok">✓ Em estoque — {produto.estoque} unidades disponíveis</span>
                : <span className="stock-out">✗ Fora de estoque</span>
              }
            </div>

            {/* Quantidade + Botão */}
            {produto.estoque > 0 && (
              <div className="detalhe-actions">
                <div className="qty-control">
                  <button onClick={() => setQuantidade(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                  <span>{quantidade}</span>
                  <button onClick={() => setQuantidade(q => Math.min(produto.estoque, q + 1))}><Plus size={14} /></button>
                </div>
                <button className={`btn-add-cart ${adicionado ? 'added' : ''}`} onClick={handleAdicionar}>
                  <ShoppingCart size={17} />
                  {adicionado ? '✓ Adicionado!' : 'Adicionar ao carrinho'}
                </button>
              </div>
            )}

            {/* Garantias */}
            <div className="detalhe-garantias">
              <div className="garantia">
                <Truck size={16} />
                <span>Frete grátis em compras acima de R$ 150</span>
              </div>
              <div className="garantia">
                <Shield size={16} />
                <span>Compra 100% segura e protegida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProdutoDetalhe