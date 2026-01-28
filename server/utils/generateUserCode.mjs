const generateUserCode = async (con) => {
  const today = new Date()
  const ymd =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0")

  const prefix = `USR${ymd}`

  const [rows] = await con.query(
    "select count(*) as total from tbl_mas_users where UserCode like ?",
    [`${prefix}%`]
  )

  const running = String(rows[0].total + 1).padStart(4, "0")

  return `${prefix}${running}`
}

export default generateUserCode