import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/adminLayout"
import { blogAPI } from "../../services/api"
import "../../styles/admin/manageBlog.css"

const emptyForm = {
  blog_title: "",
  blog_summary: "",
  blog_content: "",
  blog_image: "",
  blog_published: false,
}

function ManageBlog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await blogAPI.getAll()
      setBlogs(res.data.data || [])
    } catch (err) {
      console.error("Error fetching blogs:", err)
    } finally {
      setLoading(false)
    }
  }

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleEdit = (blog) => {
    setFormData({
      blog_title: blog.blog_title || "",
      blog_summary: blog.blog_summary || "",
      blog_content: blog.blog_content || "",
      blog_image: blog.blog_image || "",
      blog_published: blog.blog_published || false,
    })
    setEditingId(blog.blog_id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancel = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await blogAPI.update(editingId, formData)
        showFeedback("success", "Blog post updated successfully!")
      } else {
        await blogAPI.add(formData)
        showFeedback("success", "Blog post added successfully!")
      }
      handleCancel()
      fetchBlogs()
    } catch (err) {
      console.error("Save error:", err)
      showFeedback("error", "Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogAPI.delete(id)
      setBlogs((prev) => prev.filter((b) => b.blog_id !== id))
      setDeleteConfirm(null)
      showFeedback("success", "Blog post deleted.")
    } catch (err) {
      console.error("Delete error:", err)
      showFeedback("error", "Failed to delete blog post.")
    }
  }

  const publishedCount = blogs.filter((b) => b.blog_published).length

  return (
    <AdminLayout>
      <div className="manage-blog-page">

        <div className="page-header-admin">
          <div>
            <h1>Manage Blog</h1>
            <p>
              {blogs.length} post{blogs.length !== 1 ? "s" : ""} total ·{" "}
              {publishedCount} published
            </p>
          </div>
          {!showForm && (
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => setShowForm(true)}
            >
              + New Post
            </button>
          )}
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className={`feedback-banner feedback-${feedback.type}`}>
            {feedback.type === "success" ? "✅" : "❌"} {feedback.msg}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="blog-form-card">
            <h2>{editingId ? "Edit Blog Post" : "Write New Blog Post"}</h2>
            <form onSubmit={handleSubmit} className="blog-form">

              <div className="form-row-2">
                <div className="form-group">
                  <label>Post Title *</label>
                  <input
                    type="text"
                    name="blog_title"
                    value={formData.blog_title}
                    onChange={handleChange}
                    placeholder="My Thoughts on React 19..."
                    required
                  />
                  {formData.blog_title && (
                    <small className="slug-preview">
                      Slug:{" "}
                      {formData.blog_title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    type="url"
                    name="blog_image"
                    value={formData.blog_image}
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Summary *</label>
                <textarea
                  name="blog_summary"
                  value={formData.blog_summary}
                  onChange={handleChange}
                  placeholder="A short description shown on the blog listing page..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  name="blog_content"
                  value={formData.blog_content}
                  onChange={handleChange}
                  placeholder="Write your full blog post content here..."
                  rows={12}
                  className="content-textarea"
                  required
                />
                <small>
                  {formData.blog_content.length} characters ·{" "}
                  ~{Math.ceil(formData.blog_content.split(" ").filter(Boolean).length / 200)} min read
                </small>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="blog_published"
                  name="blog_published"
                  checked={formData.blog_published}
                  onChange={handleChange}
                />
                <label htmlFor="blog_published">
                  🌐 Publish immediately (visible on the public blog)
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Post"
                    : formData.blog_published
                    ? "Publish Post"
                    : "Save Draft"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Blog Posts Table */}
        <div className="blog-table-card">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="table-skeleton-row" />
            ))
          ) : blogs.length === 0 ? (
            <div className="table-empty">
              <span>📝</span>
              <p>No blog posts yet. Write your first one!</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Summary</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.blog_id}>
                    <td>
                      <div className="table-blog-title">{blog.blog_title}</div>
                      <div className="table-blog-slug">/{blog.blog_slug}</div>
                    </td>
                    <td>
                      <div className="table-blog-summary">
                        {blog.blog_summary?.substring(0, 70)}...
                      </div>
                    </td>
                    <td>
                      {blog.blog_published ? (
                        <span className="badge-published">🟢 Published</span>
                      ) : (
                        <span className="badge-draft">⚪ Draft</span>
                      )}
                    </td>
                    <td>
                      {/* correct column: blog_date (not created_at) */}
                      <span className="table-date">
                        {blog.blog_date
                          ? new Date(blog.blog_date).toLocaleDateString()
                          : "—"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="admin-btn admin-btn-secondary btn-sm"
                          onClick={() => handleEdit(blog)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger btn-sm"
                          onClick={() => setDeleteConfirm(blog.blog_id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Blog Post?</h3>
              <p>This will permanently remove the post and cannot be undone.</p>
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

export default ManageBlog