import { createContext, useState, useContext, useEffect } from "react"
import { authAPI } from "../services/api"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if already logged in when app loads
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await authAPI.verify()
        if (response.data.success) {
          setAdmin(response.data.admin)
        }
      } catch (error) {
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }
    verifyLogin()
  }, [])

  const login = (adminData) => {
    setAdmin(adminData)
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setAdmin(null)
      localStorage.removeItem("adminToken")
    }
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext)
}