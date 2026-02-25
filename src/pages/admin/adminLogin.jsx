import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import { authAPI } from "../../services/api" 
import "../../styles/admin/adminLogin.css"

function AdminLogin() {
  const [formData, setFormData] = useState({
    admin_email: "",
    admin_password: ""
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await authAPI.login(formData)

      if (res.data.success) {
        login(res.data.admin, res.data.token)
        navigate("/admin/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message)
      setError(
        err.response?.data?.message || "Invalid email or password. Try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      {/* Animated SVG Background */}
      <div className="login-bg">
        <svg className="login-svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(230,126,34,0.15)" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="rotate"
              from="0 150 150" to="360 150 150" dur="20s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(230,126,34,0.08)" strokeWidth="1" strokeDasharray="8 6">
            <animateTransform attributeName="transform" type="rotate"
              from="360 150 150" to="0 150 150" dur="30s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="450" r="100" fill="none" stroke="rgba(255,111,0,0.12)" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="rotate"
              from="0 650 450" to="360 650 450" dur="25s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="450" r="150" fill="none" stroke="rgba(255,111,0,0.06)" strokeWidth="1" strokeDasharray="10 8">
            <animateTransform attributeName="transform" type="rotate"
              from="360 650 450" to="0 650 450" dur="18s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="80" r="3" fill="rgba(230,126,34,0.4)">
            <animate attributeName="cy" values="80;60;80" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="400" r="2.5" fill="rgba(255,111,0,0.5)">
            <animate attributeName="cy" values="400;375;400" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="700" cy="150" r="2" fill="rgba(230,126,34,0.4)">
            <animate attributeName="cy" values="150;130;150" dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="500" cy="500" r="3" fill="rgba(255,111,0,0.35)">
            <animate attributeName="cy" values="500;480;500" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <line x1="0" y1="300" x2="800" y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="400" y1="0" x2="400" y2="600" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <path d="M 30 30 L 30 70 M 30 30 L 70 30" stroke="rgba(230,126,34,0.25)" strokeWidth="2" fill="none" />
          <path d="M 770 30 L 770 70 M 770 30 L 730 30" stroke="rgba(230,126,34,0.25)" strokeWidth="2" fill="none" />
          <path d="M 30 570 L 30 530 M 30 570 L 70 570" stroke="rgba(230,126,34,0.25)" strokeWidth="2" fill="none" />
          <path d="M 770 570 L 770 530 M 770 570 L 730 570" stroke="rgba(230,126,34,0.25)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">GN</div>
          <h1>Admin Portal</h1>
          <p>Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div className="login-error">
            🔒 {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="admin_email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="admin_email"
                name="admin_email"
                value={formData.admin_email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="admin_password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                type="password"
                id="admin_password"
                name="admin_password"
                value={formData.admin_password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <a href="/" className="login-back">
          ← Back to Portfolio
        </a>
      </div>
    </div>
  )
}

export default AdminLogin