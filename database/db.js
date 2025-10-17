// database/db.js
const { Pool } = require('pg');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log("🐘 Conectando ao PostgreSQL...");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Render exige SSL
  }
});

// Testa conexão inicial e cria tabela se necessário
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado ao PostgreSQL Database.");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS investiment (
        id SERIAL PRIMARY KEY,
        fundo TEXT NOT NULL,
        preco REAL NOT NULL,
        dividendo REAL NOT NULL,
        renda_desejada REAL NOT NULL,
        numero_magico REAL NOT NULL,
        investimento REAL NOT NULL,
        data TEXT NOT NULL,
        cotas_necessarias INTEGER NOT NULL,
        valor_necessario REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log('🗄️ Tabela "investiment" pronta para uso.');

    client.release();
  } catch (err) {
    console.error("❌ Erro ao conectar com o PostgreSQL:", err.message);
  console.error("🔍 Detalhes completos:", err);
  }
})();

module.exports = pool;
