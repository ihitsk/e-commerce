require('dotenv').config();
const mongoose = require('mongoose');
const Produto = require('./models/Produto');

const produtos = [
  {
    nome: 'Tênis Urban Runner Pro',
    descricao: 'Tênis esportivo com amortecimento avançado, ideal para corridas urbanas e treinos intensos. Solado antiderrapante e cabedal respirável.',
    preco: 349.90,
    imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    categoria: 'Moda',
    estoque: 15,
    avaliacao: 4.8
  },
  {
    nome: 'Mochila Notebook 15"',
    descricao: 'Mochila impermeável com compartimento acolchoado para notebook até 15 polegadas. Múltiplos bolsos organizadores e alças ergonômicas.',
    preco: 189.90,
    imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    categoria: 'Acessórios',
    estoque: 30,
    avaliacao: 4.8
  },
  {
    nome: 'Fone de Ouvido Bluetooth ANC',
    descricao: 'Cancelamento ativo de ruído, autonomia de 30 horas, conexão multipoint com 2 dispositivos simultâneos. Som Hi-Fi com drivers de 40mm.',
    preco: 459.99,
    imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    categoria: 'Eletrônicos',
    estoque: 12,
    avaliacao: 4.8
  },
  {
    nome: 'Relógio Smartwatch Series X',
    descricao: 'Monitor cardíaco, GPS integrado, resistente à água até 50m, tela AMOLED de 1.8 polegadas. Mais de 100 modos esportivos.',
    preco: 799.00,
    imagem: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    categoria: 'Eletrônicos',
    estoque: 8,
    avaliacao: 4.8
  },
  {
    nome: 'Camiseta Slim Fit Premium',
    descricao: 'Confeccionada em algodão 100% pima com acabamento premium. Modelagem slim que valoriza o corpo sem apertar.',
    preco: 79.90,
    imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    categoria: 'Moda',
    estoque: 50,
    avaliacao: 4.8
  },
  {
    nome: 'Óculos de Sol Polarizado',
    descricao: 'Lentes polarizadas com proteção UV400, armação em acetato italiano. Design moderno e durável para o dia a dia.',
    preco: 229.90,
    imagem: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    categoria: 'Acessórios',
    estoque: 20,
    avaliacao: 4.8
  },
  {
    nome: 'Garrafa Térmica 1L Inox',
    descricao: 'Mantém bebidas quentes por 12h e frias por 24h. Aço inoxidável 304 food grade, sem BPA. Boca larga para facilitar a higienização.',
    preco: 119.90,
    imagem: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    categoria: 'Casa',
    estoque: 40,
    avaliacao: 4.7
  },
  {
    nome: 'Mouse Gamer RGB 16000 DPI',
    descricao: 'Sensor óptico de 16000 DPI, 7 botões programáveis, iluminação RGB com 16 milhões de cores. Cabo trançado ultra flexível.',
    preco: 159.90,
    imagem: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
    categoria: 'Eletrônicos',
    estoque: 25,
    avaliacao: 4.5
  },
  {
    nome: 'Carteira Slim Couro Legítimo',
    descricao: 'Carteira ultra slim em couro legítimo com porta-cartões, compartimento para cédulas e proteção RFID. Cabe no bolso da frente.',
    preco: 89.90,
    imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    categoria: 'Acessórios',
    estoque: 3,
    avaliacao: 4.8
  },
  {
    nome: 'Teclado Mecânico Compacto',
    descricao: 'Layout TKL (sem teclado numérico), switches Red lineares, retroiluminação RGB por tecla. Construção em alumínio anodizado.',
    preco: 389.90,
    imagem: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80',
    categoria: 'Eletrônicos',
    estoque: 0,
    avaliacao: 4.8
  }
];

async function semear() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao MongoDB Atlas');

    // Limpa e re-insere sempre (força atualizar no Atlas)
    await Produto.deleteMany({});
    console.log('🗑️  Produtos antigos removidos');

    await Produto.insertMany(produtos);
    console.log(`✅ ${produtos.length} produtos inseridos no Atlas!`);

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado. Tudo pronto!');
  }
}

semear();
