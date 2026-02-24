import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  )

  const login = (adminData, token) => {
    localStorage.setItem("admin", JSON.stringify(adminData))
    localStorage.setItem("token", token)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem("admin")
    localStorage.removeItem("token")
    setAdmin(null)
  }

  const isAuthenticated = !!admin

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}