// routes/investment.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Middleware de log
router.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('pt-BR');
  console.log(`[INVESTMENT API] ${timestamp} - ${req.method} ${req.originalUrl}`);
  next();
});

// GET - Buscar todos os cálculos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM investiment ORDER BY created_at DESC');
    console.log(`✅ ${result.rows.length} cálculos encontrados`);
    res.json({ message: 'success', data: result.rows });
  } catch (err) {
    console.error('❌ Erro ao buscar cálculos:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET - Buscar cálculo por ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM investiment WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      console.log(`⚠️ Cálculo ${id} não encontrado`);
      return res.status(404).json({ message: 'Cálculo não encontrado' });
    }
    console.log(`✅ Cálculo ${id} encontrado`);
    res.json({ message: 'success', data: result.rows[0] });
  } catch (err) {
    console.error(`❌ Erro ao buscar cálculo ${id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST - Criar novo cálculo
router.post('/', async (req, res) => {
  const { fundo, preco, dividendo, renda_desejada, numero_magico, investimento, data, cotas_necessarias, valor_necessario } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO investiment 
        (fundo, preco, dividendo, renda_desejada, numero_magico, investimento, data, cotas_necessarias, valor_necessario)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [fundo, preco, dividendo, renda_desejada, numero_magico, investimento, data, cotas_necessarias, valor_necessario]
    );
    console.log(`✅ Cálculo criado com ID: ${result.rows[0].id}`);
    res.status(201).json({ message: 'Cálculo salvo com sucesso!', data: { id: result.rows[0].id, ...req.body } });
  } catch (err) {
    console.error('❌ Erro ao criar cálculo:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Remover cálculo
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM investiment WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      console.log(`⚠️ Cálculo ${id} não encontrado para deletar`);
      return res.status(404).json({ message: 'Cálculo não encontrado' });
    }
    console.log(`✅ Cálculo ${id} deletado com sucesso`);
    res.json({ message: 'Cálculo deletado com sucesso' });
  } catch (err) {
    console.error(`❌ Erro ao deletar cálculo ${id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
