import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/adminLayout"
import { contactAPI } from "../../services/api"
import "../../styles/admin/viewMessages.css"

function ViewMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [filter, setFilter] = useState("all")
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await contactAPI.getAll()
      setMessages(res.data.data || [])
    } catch (err) {
      console.error("Error fetching messages:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await contactAPI.markRead(id)
      // correct column: contact_read
      setMessages((prev) =>
        prev.map((m) => (m.contact_id === id ? { ...m, contact_read: true } : m))
      )
      if (selectedMsg?.contact_id === id) {
        setSelectedMsg((prev) => ({ ...prev, contact_read: true }))
      }
    } catch (err) {
      console.error("Error marking read:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await contactAPI.delete(id)
      setMessages((prev) => prev.filter((m) => m.contact_id !== id))
      if (selectedMsg?.contact_id === id) setSelectedMsg(null)
      setDeleteConfirm(null)
    } catch (err) {
      console.error("Error deleting message:", err)
    }
  }

  const handleSelectMsg = (msg) => {
    setSelectedMsg(msg)
    if (!msg.contact_read) {
      handleMarkRead(msg.contact_id)
    }
  }

  // correct column: contact_read (not is_read)
  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.contact_read
    if (filter === "read") return m.contact_read
    return true
  })

  const unreadCount = messages.filter((m) => !m.contact_read).length

  return (
    <AdminLayout>
      <div className="messages-page">

        <div className="page-header-admin">
          <div>
            <h1>Messages</h1>
            <p>
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
                : "All messages read"}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="msg-filter-tabs">
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              className={`msg-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "unread" && unreadCount > 0 && (
                <span className="filter-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="messages-layout">

          {/* Messages List */}
          <div className="messages-list">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="msg-skeleton" />
              ))
            ) : filtered.length === 0 ? (
              <div className="messages-empty">
                <span>📭</span>
                <p>No {filter !== "all" ? filter : ""} messages found.</p>
              </div>
            ) : (
              filtered.map((msg) => (
                <div
                  key={msg.contact_id}
                  className={`msg-row ${!msg.contact_read ? "unread" : ""} ${
                    selectedMsg?.contact_id === msg.contact_id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectMsg(msg)}
                >
                  <div className="msg-row-dot" />
                  <div className="msg-row-content">
                    <div className="msg-row-top">
                      <span className="msg-row-name">{msg.contact_name}</span>
                      <span className="msg-row-date">
                        {new Date(msg.contact_date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="msg-row-subject">{msg.contact_subject}</span>
                    <p className="msg-row-preview">
                      {msg.contact_message?.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="message-detail">
            {selectedMsg ? (
              <>
                <div className="detail-header">
                  <div>
                    <h2>{selectedMsg.contact_subject}</h2>
                    <p className="detail-meta">
                      From <strong>{selectedMsg.contact_name}</strong> ·{" "}
                      <a href={`mailto:${selectedMsg.contact_email}`}>
                        {selectedMsg.contact_email}
                      </a>
                    </p>
                    <p className="detail-date">
                      {new Date(selectedMsg.contact_date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="detail-body">
                  <p>{selectedMsg.contact_message}</p>
                </div>

                <div className="detail-actions">
                  <a
                    href={`mailto:${selectedMsg.contact_email}?subject=Re: ${selectedMsg.contact_subject}`}
                    className="admin-btn admin-btn-primary"
                  >
                    📧 Reply
                  </a>
                  {!selectedMsg.contact_read && (
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => handleMarkRead(selectedMsg.contact_id)}
                    >
                      ✅ Mark Read
                    </button>
                  )}
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => setDeleteConfirm(selectedMsg.contact_id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            ) : (
              <div className="detail-empty">
                <span>✉️</span>
                <p>Select a message to read it</p>
              </div>
            )}
          </div>

        </div>

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Message?</h3>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Yes, Delete
                </button>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}

export default ViewMessages