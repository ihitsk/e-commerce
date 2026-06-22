import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, Search } from 'lucide-react'
import { produtosAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const CATEGORIAS = ['Todos', 'Eletrônicos', 'Moda', 'Acessórios', 'Casa']

function Home() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const { adicionar } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    produtosAPI.listar()
      .then(dados => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))
  }, [])

  const handleAdicionar = (e, produto) => {
    e.preventDefault()
    e.stopPropagation()
    if (!usuario) { navigate('/login'); return }
    adicionar(produto)
  }

  const produtosFiltrados = produtos.filter(p => {
    const matchNome = p.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCat  = categoria === 'Todos' || p.categoria === categoria
    return matchNome && matchCat
  })

  if (carregando) {
    return (
      <div className="home-loader">
        <div className="spinner" />
        <span>Carregando produtos...</span>
      </div>
    )
  }

  return (
    <div className="home">
      {/* Toolbar */}
      <div className="home-toolbar">
        <div className="cats">
          {CATEGORIAS.map(c => (
            <button
              key={c}
              className={`cat-btn ${categoria === c ? 'active' : ''}`}
              onClick={() => setCategoria(c)}
            >{c}</button>
          ))}
        </div>
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Alerta login */}
      {!usuario && (
        <div className="home-notice">
          <span>🔒 <Link to="/login">Faça login</Link> para adicionar produtos ao carrinho</span>
        </div>
      )}

      {/* Erro */}
      {erro && <div className="home-err">⚠️ {erro}</div>}

      {/* Grid */}
      {produtosFiltrados.length === 0 && !erro ? (
        <div className="home-empty">
          <Search size={40} strokeWidth={1.2} />
          <p>Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="produtos-grid">
          {produtosFiltrados.map(produto => (
            <article key={produto._id} className="product-card">
              <Link to={`/produto/${produto._id}`} className="card-image-link">
                <div className="card-img-wrap">
                  <img src={produto.imagem} alt={produto.nome} loading="lazy" />
                  {produto.estoque === 0 && <div className="tag tag-out">Esgotado</div>}
                  {produto.estoque > 0 && produto.estoque <= 5 && (
                    <div className="tag tag-low">Últimas!</div>
                  )}
                </div>
              </Link>
              <div className="card-body">
                <Link to={`/produto/${produto._id}`} className="card-name">{produto.nome}</Link>
                <div className="card-stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />)}
                  <span>{produto.avaliacao ?? 4.8}</span>
                </div>
                <div className="card-pricing">
                  <span className="card-price">R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
                  <span className="card-installment">10x R$ {(produto.preco/10).toFixed(2).replace('.', ',')}</span>
                </div>
                <button
                  className="card-add-btn"
                  disabled={produto.estoque === 0}
                  onClick={e => handleAdicionar(e, produto)}
                >
                  <ShoppingCart size={14} />
                  {produto.estoque > 0 ? 'Adicionar' : 'Indisponível'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home