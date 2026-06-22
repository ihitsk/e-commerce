import { Link } from 'react-router-dom'
import './PaginaInicial.css'

function PaginaInicial() {
  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">✨ Nova coleção disponível</div>
        <h1 className="hero-title">
          A melhor experiência<br />
          de compras <span className="hero-highlight">online</span>
        </h1>
        <p className="hero-sub">
          Encontre os melhores produtos com os melhores preços.
          Entrega rápida, pagamento seguro.
        </p>
        <div className="hero-actions">
          <Link to="/home" className="btn-primary">
            Ver Produtos →
          </Link>
          <Link to="/cadastro" className="btn-ghost">
            Criar conta grátis
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">500+</span>
            <span className="stat-label">Produtos</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">10k+</span>
            <span className="stat-label">Clientes</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">4.9★</span>
            <span className="stat-label">Avaliação</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Frete Grátis</h3>
          <p>Em compras acima de R$ 150,00 para todo o Brasil.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Pagamento Seguro</h3>
          <p>Seus dados protegidos com criptografia de ponta a ponta.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">↩️</div>
          <h3>Devolução Fácil</h3>
          <p>30 dias para devolver sem perguntas, sem burocracia.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Suporte 24h</h3>
          <p>Nossa equipe está sempre pronta para te ajudar.</p>
        </div>
      </section>
    </div>
  )
}

export default PaginaInicial