import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authenticateToken from "./middleware/authVerify.mjs"

import testRoute from "./routes/test.routes.mjs"
import authRouter from "./routes/auth.routes.mjs"
import productRoute from "./routes/prod.routes.mjs"
import inventoryRoute from "./routes/inventory.roustes.mjs"
import profileRoute from "./routes/profile.routes.mjs"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running 🚀')
})

// routes
app.use('/test', authenticateToken, testRoute)
app.use('/auth', authRouter)
app.use('/Product', authenticateToken, productRoute)
app.use('/inventory', authenticateToken, inventoryRoute)
app.use('/user', authenticateToken, profileRoute)

app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}:${PORT}`)
})
