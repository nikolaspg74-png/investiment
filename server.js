const express = require('express');
const cors = require('cors');
const db = require('./database/db');
const investmentRoutes = require('./routes/investiment');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS (liberado geral por enquanto)
const allowedOrigins = [
  'https://my-investiment-app.vercel.app/',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sem origin (ex: Postman) ou das origins definidas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware de log
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('pt-BR');
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use('/investment', investmentRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API de Cálculos de Investimento',
    status: 'Online'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
