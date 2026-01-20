import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// routes
import testRoute from './routes/test.route.js'

dotenv.config()

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

// /db-test
app.use('/', testRoute)

//////////////////////////////////////////////////

app.use("/auth", authRouter);
app.use("/admin", authenticateToken, authorizeAdmin, adminRouter);