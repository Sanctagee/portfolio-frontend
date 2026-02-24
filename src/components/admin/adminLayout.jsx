import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import { authAPI } from "../../services/api"
import "../../styles/admin/adminLayout.css"

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      logout()
      navigate("/admin/login")
    }
  }

  const navItems = [
    { to: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/admin/messages", icon: "✉️", label: "Messages" },
    { to: "/admin/projects", icon: "🖥️", label: "Projects" },
    { to: "/admin/blog", icon: "📝", label: "Blog" },
  ]

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">GN</div>
          {sidebarOpen && <span className="sidebar-title">Admin Panel</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a
            href="/"
            className="sidebar-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sidebar-icon">🌐</span>
            {sidebarOpen && <span className="sidebar-label">View Site</span>}
          </a>
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-icon">🚪</span>
            {sidebarOpen && <span className="sidebar-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">

        {/* Top Bar */}
        <header className="admin-topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>

          <div className="topbar-right">
            <span className="admin-greeting">
              👋 Welcome, {admin?.admin_firstname || "Admin"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>

      </div>
    </div>
  )
}

export default AdminLayout