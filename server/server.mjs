import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authenticateToken from "./middleware/authVerify.mjs"

// routes
import testRoute from "./routes/test.routes.mjs"
import authRouter from "./routes/auth.routes.mjs"
//////////////////////////////////////////////////

dotenv.config()
// console.log("db host:", process.env.DB_HOST)

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running 🚀')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// /dbtest
app.use('/test', authenticateToken, testRoute)

////////////////////////////////////////////////// 

// /Register /Login
app.use('/', authRouter)