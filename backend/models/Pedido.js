const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  produtoId: { type: String, required: true },
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, required: true },
  imagem: { type: String, default: '' }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  itens: [itemPedidoSchema],
  total: { type: Number, required: true },
  metodoPagamento: {
    type: String,
    enum: ['pix', 'boleto', 'cartao'],
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  enderecoEntrega: { type: String, default: '' },
  dataEntregaPrevista: { type: Date }
}, { timestamps: true });

// Calcula data de entrega prevista (5-8 dias úteis)
pedidoSchema.pre('save', function() {
  if (!this.dataEntregaPrevista) {
    const base = new Date();
    base.setDate(base.getDate() + 7);
    this.dataEntregaPrevista = base;
  }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
