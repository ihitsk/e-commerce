import { useState, useEffect } from 'react'
import {
  Package, Users, RefreshCw, Plus, Pencil, Trash2,
  X, Save, ShoppingBag, Eye
} from 'lucide-react'
import { produtosAPI, usuariosAPI, pedidosAPI } from '../services/api'
import './PainelAdm.css'

const STATUS_LABEL = {
  pendente: { label: 'Aguardando', color: 'yellow' },
  pago:     { label: 'Pago',       color: 'blue'   },
  enviado:  { label: 'A caminho',  color: 'orange' },
  entregue: { label: 'Entregue',   color: 'green'  },
  cancelado:{ label: 'Cancelado',  color: 'red'    },
}

const METODO_LABEL = { pix: 'PIX', boleto: 'Boleto', cartao: 'Cartão' }

const PRODUTO_VAZIO = { nome: '', preco: '', categoria: '', estoque: '', descricao: '', imagem: '', avaliacao: '' }

function PainelAdm() {
  const [aba, setAba] = useState('produtos')
  const [produtos, setProdutos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal produto
  const [modalProd, setModalProd] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(PRODUTO_VAZIO)

  // Modal pedidos de usuário
  const [modalPedidos, setModalPedidos] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [pedidosUsuario, setPedidosUsuario] = useState([])
  const [loadingPedidos, setLoadingPedidos] = useState(false)

  const carregar = async () => {
    setLoading(true)
    try {
      const [p, u] = await Promise.all([produtosAPI.listar(), usuariosAPI.listar()])
      setProdutos(p)
      setUsuarios(u)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  // ── PRODUTOS ──
  const abrirNovo  = () => { setEditando(null); setForm(PRODUTO_VAZIO); setModalProd(true) }
  const abrirEditar = (p) => { setEditando(p._id); setForm({ ...p, preco: String(p.preco), estoque: String(p.estoque), avaliacao: String(p.avaliacao || '') }); setModalProd(true) }

  const salvarProduto = async (e) => {
    e.preventDefault()
    try {
      const dados = { ...form, preco: Number(form.preco), estoque: Number(form.estoque), avaliacao: Number(form.avaliacao) || 0 }
      if (editando) await produtosAPI.atualizar(editando, dados)
      else          await produtosAPI.criar(dados)
      await carregar()
      setModalProd(false)
    } catch (err) { alert('Erro: ' + err.message) }
  }

  const deletarProduto = async (id) => {
    if (!confirm('Deletar este produto?')) return
    try { await produtosAPI.deletar(id); await carregar() }
    catch (err) { alert('Erro: ' + err.message) }
  }

  // ── USUÁRIOS → PEDIDOS ──
  const verPedidosUsuario = async (u) => {
    setUsuarioSelecionado(u)
    setModalPedidos(true)
    setLoadingPedidos(true)
    try {
      const dados = await pedidosAPI.listarDoUsuario(u._id)
      setPedidosUsuario(dados)
    } catch { setPedidosUsuario([]) }
    finally { setLoadingPedidos(false) }
  }

  const deletarUsuario = async (id) => {
    if (!confirm('Deletar este usuário permanentemente?')) return
    try { await usuariosAPI.deletar(id); await carregar() }
    catch (err) { alert('Erro: ' + err.message) }
  }

  // ── HELPERS ──
  const fmtMoney = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`
  const fmtData  = (d) => new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })

  return (
    <div className="adm-page">
      <div className="adm-inner">

        {/* TOP */}
        <div className="adm-top">
          <div>
            <h1 className="adm-title">Painel Admin</h1>
            <p className="adm-sub">Gerencie produtos e usuários da loja</p>
          </div>
          <div className="adm-stats">
            <span className="stat-chip"><Package size={14} /> {produtos.length} produtos</span>
            <span className="stat-chip"><Users size={14} /> {usuarios.length} usuários</span>
            <button className="btn-refresh" onClick={carregar} disabled={loading} title="Atualizar">
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* ABAS */}
        <div className="adm-tabs">
          <button className={`adm-tab ${aba === 'produtos' ? 'active' : ''}`} onClick={() => setAba('produtos')}>
            <Package size={15} /> Produtos
          </button>
          <button className={`adm-tab ${aba === 'usuarios' ? 'active' : ''}`} onClick={() => setAba('usuarios')}>
            <Users size={15} /> Usuários
          </button>
        </div>

        {/* ── TAB PRODUTOS ── */}
        {aba === 'produtos' && (
          <div className="adm-section">
            <div className="section-header">
              <h2>Produtos ({produtos.length})</h2>
              <button className="btn-add" onClick={abrirNovo}><Plus size={15} /> Novo produto</button>
            </div>
            {loading ? (
              <div className="adm-loading"><div className="spinner" /></div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Categoria</th>
                      <th>Preço</th>
                      <th>Estoque</th>
                      <th>Avaliação</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 && (
                      <tr><td colSpan={7} className="empty-row">Nenhum produto cadastrado</td></tr>
                    )}
                    {produtos.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="td-produto">
                            <img src={p.imagem} alt={p.nome} className="td-img" />
                            {p.nome}
                          </div>
                        </td>
                        <td className="td-muted">{p.categoria}</td>
                        <td>{fmtMoney(p.preco)}</td>
                        <td className="td-muted">{p.estoque}</td>
                        <td className="td-muted">{p.avaliacao ?? '—'}★</td>
                        <td>
                          <span className={`status-badge ${p.estoque > 0 ? 'ok' : 'out'}`}>
                            {p.estoque > 0 ? 'Disponível' : 'Esgotado'}
                          </span>
                        </td>
                        <td>
                          <div className="td-actions">
                            <button className="act-edit" onClick={() => abrirEditar(p)} title="Editar"><Pencil size={14} /></button>
                            <button className="act-del" onClick={() => deletarProduto(p._id)} title="Deletar"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB USUÁRIOS ── */}
        {aba === 'usuarios' && (
          <div className="adm-section">
            <div className="section-header">
              <h2>Usuários ({usuarios.length})</h2>
            </div>
            {loading ? (
              <div className="adm-loading"><div className="spinner" /></div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Usuário</th>
                      <th>E-mail</th>
                      <th>Permissão</th>
                      <th>Membro desde</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 && (
                      <tr><td colSpan={6} className="empty-row">Nenhum usuário cadastrado</td></tr>
                    )}
                    {usuarios.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.nome}</td>
                        <td className="td-muted">@{u.usuario}</td>
                        <td className="td-muted">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role === 'admin' || u.role === 'adm' ? 'admin' : 'user'}`}>
                            {u.role === 'admin' || u.role === 'adm' ? '🛡️ Admin' : '👤 Cliente'}
                          </span>
                        </td>
                        <td className="td-muted">{fmtData(u.createdAt)}</td>
                        <td>
                          <div className="td-actions">
                            <button
                              className="act-view"
                              onClick={() => verPedidosUsuario(u)}
                              title="Ver compras"
                            >
                              <Eye size={14} />
                            </button>
                            <button className="act-del" onClick={() => deletarUsuario(u._id)} title="Deletar"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ MODAL PRODUTO ══ */}
      {modalProd && (
        <div className="adm-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalProd(false) }}>
          <div className="adm-modal">
            <div className="modal-header">
              <h3>{editando ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button className="modal-close" onClick={() => setModalProd(false)}><X size={16} /></button>
            </div>
            <form onSubmit={salvarProduto} className="modal-form">
              <div className="field">
                <label>Nome do Produto</label>
                <input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Tênis Urban Runner" />
              </div>
              <div className="modal-row">
                <div className="field">
                  <label>Preço (R$)</label>
                  <input required type="number" step="0.01" min="0" value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} placeholder="0,00" />
                </div>
                <div className="field">
                  <label>Estoque</label>
                  <input required type="number" min="0" value={form.estoque} onChange={e => setForm({...form, estoque: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div className="modal-row">
                <div className="field">
                  <label>Categoria</label>
                  <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                    <option value="">Selecionar...</option>
                    {['Eletrônicos','Moda','Acessórios','Casa'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Avaliação (0–5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.avaliacao} onChange={e => setForm({...form, avaliacao: e.target.value})} placeholder="4.5" />
                </div>
              </div>
              <div className="field">
                <label>URL da Imagem</label>
                <input value={form.imagem} onChange={e => setForm({...form, imagem: e.target.value})} placeholder="https://..." />
                {form.imagem && <img src={form.imagem} alt="preview" className="img-preview" onError={e => e.target.style.display='none'} />}
              </div>
              <div className="field">
                <label>Descrição</label>
                <textarea rows={3} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Descrição detalhada do produto..." style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-salvar-modal">
                <Save size={15} /> {editando ? 'Salvar alterações' : 'Criar produto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL PEDIDOS DO USUÁRIO ══ */}
      {modalPedidos && usuarioSelecionado && (
        <div className="adm-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalPedidos(false) }}>
          <div className="adm-modal adm-modal-lg">
            <div className="modal-header">
              <div>
                <h3>Compras de {usuarioSelecionado.nome}</h3>
                <p className="modal-sub">{usuarioSelecionado.email}</p>
              </div>
              <button className="modal-close" onClick={() => setModalPedidos(false)}><X size={16} /></button>
            </div>

            <div className="modal-pedidos-body">
              {loadingPedidos ? (
                <div className="adm-loading"><div className="spinner" /></div>
              ) : pedidosUsuario.length === 0 ? (
                <div className="pedidos-empty">
                  <ShoppingBag size={36} strokeWidth={1.2} />
                  <p>Este usuário ainda não fez pedidos</p>
                </div>
              ) : (
                <div className="pedidos-list">
                  {pedidosUsuario.map(ped => {
                    const st = STATUS_LABEL[ped.status] || STATUS_LABEL.pendente
                    return (
                      <div key={ped._id} className="pedido-card-adm">
                        {/* Cabeçalho */}
                        <div className="pca-header">
                          <div>
                            <p className="pca-id">#{ped._id.slice(-8).toUpperCase()}</p>
                            <p className="pca-date">{fmtData(ped.createdAt)}</p>
                          </div>
                          <div className="pca-right">
                            <span className={`mc-status ${st.color}`}>{st.label}</span>
                            <span className="pca-total">{fmtMoney(ped.total)}</span>
                          </div>
                        </div>

                        {/* Itens */}
                        <ul className="pca-itens">
                          {ped.itens.map((item, i) => (
                            <li key={i} className="pca-item">
                              <img src={item.imagem} alt={item.nome} />
                              <span className="pca-item-nome">{item.nome}</span>
                              <span className="pca-item-qty">×{item.quantidade}</span>
                              <span className="pca-item-preco">{fmtMoney(item.preco * item.quantidade)}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Info */}
                        <div className="pca-info">
                          <span>💳 {METODO_LABEL[ped.metodoPagamento] || ped.metodoPagamento}</span>
                          <span>📍 {ped.enderecoEntrega || 'Endereço não informado'}</span>
                          <span>📦 Entrega prevista: <strong>{fmtData(ped.dataEntregaPrevista)}</strong></span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PainelAdm