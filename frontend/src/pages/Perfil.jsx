import { useState, useEffect, useRef } from 'react'
import { Camera, Save, User, Moon, Sun } from 'lucide-react'
import { usuariosAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useTema } from '../context/ThemeContext'
import './Perfil.css'

function Perfil() {
  const { usuario, login } = useAuth()
  const { tema, alternarTema } = useTema()
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' })
  const [fotoNova, setFotoNova] = useState(null) // base64 da nova foto
  const fileRef = useRef()

  useEffect(() => {
    if (!usuario) return
    const id = usuario.id || usuario._id
    usuariosAPI.buscarPorId(id)
      .then(dados => setPerfil(dados))
      .catch(() => setPerfil(usuario))
      .finally(() => setCarregando(false))
  }, [])

  // Seleciona foto → converte em base64 → preview imediato (sem salvar ainda)
  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setMensagem({ tipo: 'erro', texto: 'Imagem muito grande. Máximo: 2MB.' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setFotoNova(ev.target.result)
    reader.readAsDataURL(file)
  }

  // Salva dados + foto no MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensagem({ tipo: '', texto: '' })
    setSalvando(true)
    try {
      const id = usuario.id || usuario._id
      const payload = {
        nome: perfil.nome,
        usuario: perfil.usuario,
        email: perfil.email,
        endereco: perfil.endereco,
        telefone: perfil.telefone,
        cep: perfil.cep,
      }
      // Inclui foto apenas se foi alterada
      if (fotoNova) payload.foto = fotoNova

      const resp = await usuariosAPI.atualizar(id, payload)

      // Atualiza contexto/localStorage com todos os dados novos incluindo foto
      const usuarioAtualizado = {
        ...usuario,
        ...resp.usuario,
        foto: fotoNova || usuario?.foto || resp.usuario?.foto || '',
      }
      login(usuarioAtualizado)
      setFotoNova(null) // limpa estado de foto nova (já salva)
      setMensagem({ tipo: 'ok', texto: 'Perfil salvo com sucesso!' })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar: ' + err.message })
    } finally {
      setSalvando(false)
    }
  }

  // Foto exibida: prioritária é a nova (preview), depois a do banco, depois nada
  const fotoExibida = fotoNova || usuario?.foto || perfil?.foto || null
  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : ''

  if (carregando) {
    return (
      <div className="perfil-loading">
        <div className="spinner" />
        <span>Carregando perfil...</span>
      </div>
    )
  }

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <h1 className="perfil-heading">Meu Perfil</h1>

        {mensagem.texto && (
          <div className={`perfil-msg ${mensagem.tipo}`}>
            {mensagem.tipo === 'ok' ? '✅' : '⚠️'} {mensagem.texto}
          </div>
        )}

        <div className="perfil-layout">
          {/* Coluna da foto */}
          <aside className="perfil-foto-col">
            <div className="foto-wrap">
              {fotoExibida
                ? <img src={fotoExibida} alt="Foto de perfil" className="foto-img" />
                : <div className="foto-placeholder"><span>{iniciais || <User size={28} />}</span></div>
              }
              <button
                type="button"
                className="foto-btn"
                onClick={() => fileRef.current?.click()}
                title="Alterar foto"
              >
                <Camera size={14} />
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFotoChange}
            />
            {fotoNova && (
              <p className="foto-pendente">📷 Nova foto selecionada<br/>Clique em "Salvar" para confirmar</p>
            )}
            {!fotoNova && (
              <p className="foto-hint">Clique na câmera para alterar<br/>Máx. 2MB · JPG, PNG, WebP</p>
            )}
            <div className="perfil-role-badge">
              {(usuario?.role === 'admin' || usuario?.role === 'adm') ? '🛡️ Administrador' : '👤 Cliente'}
            </div>

            {/* Botão modo escuro/claro */}
            <button
              type="button"
              id="btn-alternar-tema"
              className="btn-tema"
              onClick={alternarTema}
              title={tema === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {tema === 'dark'
                ? <><Sun size={15} /> Modo Claro</>
                : <><Moon size={15} /> Modo Escuro</>
              }
            </button>
          </aside>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="perfil-form">
            <div className="form-section">
              <h3 className="section-title">Dados Pessoais</h3>
              <div className="form-grid">
                <div className="field">
                  <label>Nome Completo</label>
                  <input type="text" value={perfil?.nome || ''} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
                </div>
                <div className="field">
                  <label>Nome de Usuário</label>
                  <input type="text" value={perfil?.usuario || ''} onChange={e => setPerfil({...perfil, usuario: e.target.value})} />
                </div>
                <div className="field">
                  <label>E-mail</label>
                  <input type="email" value={perfil?.email || ''} onChange={e => setPerfil({...perfil, email: e.target.value})} />
                </div>
                <div className="field">
                  <label>Telefone</label>
                  <input type="text" value={perfil?.telefone || ''} onChange={e => setPerfil({...perfil, telefone: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Endereço</h3>
              <div className="form-grid">
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>Endereço Completo</label>
                  <input type="text" value={perfil?.endereco || ''} onChange={e => setPerfil({...perfil, endereco: e.target.value})} />
                </div>
                <div className="field">
                  <label>CEP</label>
                  <input type="text" value={perfil?.cep || ''} onChange={e => setPerfil({...perfil, cep: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Segurança</h3>
              <div className="field">
                <label>Senha</label>
                <input type="password" defaultValue="••••••••" disabled style={{ cursor: 'not-allowed', opacity: 0.45 }} />
                <span className="field-hint">Alteração de senha disponível em breve</span>
              </div>
            </div>

            <button type="submit" disabled={salvando} className="btn-salvar">
              <Save size={16} />
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Perfil