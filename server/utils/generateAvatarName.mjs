import path from "path";

export default function generateAvatarName(
  originalName,
  prefix = "avatar",
) {
  const ext = path.extname(originalName);

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const datePart = `${yyyy}${mm}${dd}`;
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1e6);

  return `${prefix}_${datePart}_${timestamp}_${random}${ext}`;
}
