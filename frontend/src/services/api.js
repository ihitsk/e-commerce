const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || 'Erro na requisição');
  return data;
}

// ===== USUÁRIOS =====
export const usuariosAPI = {
  cadastrar: (dados) => request('/usuarios/cadastro', { method: 'POST', body: JSON.stringify(dados) }),
  login:     (dados) => request('/usuarios/login',    { method: 'POST', body: JSON.stringify(dados) }),
  listar:    ()      => request('/usuarios'),
  buscarPorId: (id)  => request(`/usuarios/${id}`),
  atualizar: (id, dados) => request(`/usuarios/${id}`, { method: 'PUT',    body: JSON.stringify(dados) }),
  deletar:   (id)    => request(`/usuarios/${id}`,    { method: 'DELETE' })
};

// ===== PRODUTOS =====
export const produtosAPI = {
  listar:      ()         => request('/produtos'),
  buscarPorId: (id)       => request(`/produtos/${id}`),
  criar:       (dados)    => request('/produtos',    { method: 'POST',  body: JSON.stringify(dados) }),
  atualizar:   (id, dados)=> request(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  deletar:     (id)       => request(`/produtos/${id}`, { method: 'DELETE' })
};

// ===== PEDIDOS =====
export const pedidosAPI = {
  criar:          (dados) => request('/pedidos',             { method: 'POST', body: JSON.stringify(dados) }),
  listarDoUsuario:(id)    => request(`/pedidos/usuario/${id}`),
  listarTodos:    ()      => request('/pedidos'),
  buscarPorId:    (id)    => request(`/pedidos/${id}`),
  atualizarStatus:(id, status) => request(`/pedidos/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};
