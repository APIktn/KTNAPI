import express from "express"
import con from "../db.mjs"

const testRoute = express.Router()

// const One = mysql.escape("1")
testRoute.get("/dbtest", async (req, res) => {
  try {
    const [rows] = await con.query("select 1")

    res.status(200).json({
      status: "success",
      message: "db connected",
      data: rows
    })
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "db connection failed",
      error: err.message
    })
  }
})

export default testRoute
