
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "1.2rem",
        color: "var(--primary-color)"
      }}>
        Checking authentication...
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute