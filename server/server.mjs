import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authenticateToken from "./middleware/authVerify.mjs"

// routes
import testRoute from "./routes/test.routes.mjs"
import authRouter from "./routes/auth.routes.mjs"
import productRoute from "./routes/prod.routes.mjs"
import inventoryRoute from "./routes/inventory.roustes.mjs"
//////////////////////////////////////////////////

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running 🚀')
})

app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}:${PORT}`)
})

// /dbtest
app.use('/test', authenticateToken, testRoute)

////////////////////////////////////////////////// 

// /register /login
app.use('/auth', authRouter)

// /createprod
app.use("/asset", express.static("asset"));
app.use('/Product', authenticateToken, productRoute)
app.use('/inventory', authenticateToken, inventoryRoute)