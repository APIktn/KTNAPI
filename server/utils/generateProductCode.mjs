export default async function generateProductCode(con) {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const datePart = `${yyyy}${mm}${dd}`; // 20261031
  const prefix = `PRD${datePart}`;

  const [rows] = await con.query(
    `
    SELECT ProductCode
    FROM tbl_trs_product_header
    WHERE ProductCode LIKE ?
    ORDER BY ProductCode DESC
    LIMIT 1
    `,
    [`${prefix}%`]
  );

  let running = 1;

  if (rows.length > 0) {
    const lastCode = rows[0].ProductCode;
    running = parseInt(lastCode.slice(-6), 10) + 1;
  }

  const runningStr = String(running).padStart(6, "0");

  return `${prefix}${runningStr}`;
}
