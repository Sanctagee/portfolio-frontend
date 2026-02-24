import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../components/admin/adminLayout"
import { projectsAPI, blogAPI, contactAPI, skillsAPI } from "../../services/api"
import "../../styles/admin/dashboard.css"

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    skills: 0,
    unreadMessages: 0,
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, blogsRes, messagesRes, skillsRes] = await Promise.all([
          projectsAPI.getAll(),
          blogAPI.getAll(),
          contactAPI.getAll(),
          skillsAPI.getAll(),
        ])

        const projects = projectsRes.data.data || []
        const blogs = blogsRes.data.data || []
        const messages = messagesRes.data.data || []
        const skills = skillsRes.data.data || []

        const unread = messages.filter((m) => !m.is_read).length

        setStats({
          projects: projects.length,
          blogs: blogs.length,
          messages: messages.length,
          skills: skills.length,
          unreadMessages: unread,
        })

        // Show 5 most recent messages
        setRecentMessages(messages.slice(0, 5))
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: "🖥️",
      link: "/admin/projects",
      color: "orange",
    },
    {
      label: "Blog Posts",
      value: stats.blogs,
      icon: "📝",
      link: "/admin/blog",
      color: "navy",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: "✉️",
      link: "/admin/messages",
      color: "orange",
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : null,
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: "⚡",
      link: null,
      color: "navy",
    },
  ]

  return (
    <AdminLayout>
      <div className="dashboard-page">

        <div className="dash-header">
          <h1>Dashboard</h1>
          <p>Here's what's happening with your portfolio.</p>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards">
          {statCards.map((card) => (
            <div key={card.label} className={`stat-card stat-card--${card.color}`}>
              <div className="stat-card-top">
                <span className="stat-icon">{card.icon}</span>
                {card.badge && (
                  <span className="stat-badge">{card.badge}</span>
                )}
              </div>
              <div className="stat-value">
                {loading ? <span className="stat-skeleton" /> : card.value}
              </div>
              <div className="stat-label">{card.label}</div>
              {card.link && (
                <Link to={card.link} className="stat-link">
                  Manage →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="dash-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/admin/projects" className="quick-action-card">
              <span>🖥️</span>
              <span>Add Project</span>
            </Link>
            <Link to="/admin/blog" className="quick-action-card">
              <span>📝</span>
              <span>New Blog Post</span>
            </Link>
            <Link to="/admin/messages" className="quick-action-card">
              <span>✉️</span>
              <span>View Messages</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="quick-action-card"
            >
              <span>🌐</span>
              <span>View Portfolio</span>
            </a>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="dash-section">
          <div className="section-header-row">
            <h2>Recent Messages</h2>
            <Link to="/admin/messages" className="view-all-link">View all →</Link>
          </div>

          {loading ? (
            <div className="recent-messages-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="message-skeleton-row" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="empty-dash">No messages yet.</div>
          ) : (
            <div className="recent-messages">
              {recentMessages.map((msg) => (
                <div
                  key={msg.contact_id}
                  className={`recent-message-row ${!msg.is_read ? "unread" : ""}`}
                >
                  <div className="msg-dot" />
                  <div className="msg-info">
                    <span className="msg-name">{msg.contact_name}</span>
                    <span className="msg-subject">{msg.contact_subject}</span>
                  </div>
                  <span className="msg-date">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}

export default Dashboard