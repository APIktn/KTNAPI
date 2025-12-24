import { Navigate } from "react-router-dom"
import { isAuth } from "../utils/Auth"

export default function ProtectedRoute({ children }) {
  if (!isAuth()) {
    return <Navigate to="/login" replace />
  }
  return children
}
