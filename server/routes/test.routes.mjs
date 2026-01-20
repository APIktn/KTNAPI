import express from 'express'
import pool from '../db.js'

const router = express.Router()

// test db
router.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result')
    res.json({ status: 'ok', rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
