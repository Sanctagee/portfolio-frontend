import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/adminLayout"
import { projectsAPI } from "../../services/api"
import "../../styles/admin/manageProjects.css"

const emptyForm = {
  project_title: "",
  project_description: "",
  project_tech: "",
  project_url: "",
  project_github: "",
  project_image: "",
  is_featured: false,
}

function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', msg }

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll()
      setProjects(res.data.data || [])
    } catch (err) {
      console.error("Error fetching projects:", err)
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

  const handleEdit = (project) => {
    setFormData({
      project_title: project.project_title || "",
      project_description: project.project_description || "",
      project_tech: project.project_tech || "",
      project_url: project.project_url || "",
      project_github: project.project_github || "",
      project_image: project.project_image || "",
      is_featured: project.is_featured || false,
    })
    setEditingId(project.project_id)
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
        await projectsAPI.update(editingId, formData)
        showFeedback("success", "Project updated successfully!")
      } else {
        await projectsAPI.add(formData)
        showFeedback("success", "Project added successfully!")
      }
      handleCancel()
      fetchProjects()
    } catch (err) {
      console.error("Save error:", err)
      showFeedback("error", "Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await projectsAPI.delete(id)
      setProjects((prev) => prev.filter((p) => p.project_id !== id))
      setDeleteConfirm(null)
      showFeedback("success", "Project deleted.")
    } catch (err) {
      console.error("Delete error:", err)
      showFeedback("error", "Failed to delete project.")
    }
  }

  return (
    <AdminLayout>
      <div className="manage-projects-page">

        <div className="page-header-admin">
          <div>
            <h1>Manage Projects</h1>
            <p>{projects.length} project{projects.length !== 1 ? "s" : ""} in total</p>
          </div>
          {!showForm && (
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add Project
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
          <div className="project-form-card">
            <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
            <form onSubmit={handleSubmit} className="project-form">

              <div className="form-row-2">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    name="project_title"
                    value={formData.project_title}
                    onChange={handleChange}
                    placeholder="My Awesome Project"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tech Stack</label>
                  <input
                    type="text"
                    name="project_tech"
                    value={formData.project_tech}
                    onChange={handleChange}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                  <small>Comma-separated list</small>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleChange}
                  placeholder="What does this project do? What problem does it solve?"
                  rows={4}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Live Demo URL</label>
                  <input
                    type="url"
                    name="project_url"
                    value={formData.project_url}
                    onChange={handleChange}
                    placeholder="https://myproject.vercel.app"
                  />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    name="project_github"
                    value={formData.project_github}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="project_image"
                  value={formData.project_image}
                  onChange={handleChange}
                  placeholder="https://example.com/project-screenshot.jpg"
                />
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />
                <label htmlFor="is_featured">⭐ Mark as Featured Project</label>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingId ? "Update Project" : "Add Project"}
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

        {/* Projects Table */}
        <div className="projects-table-card">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="table-skeleton-row" />
            ))
          ) : projects.length === 0 ? (
            <div className="table-empty">
              <span>🖥️</span>
              <p>No projects yet. Add your first one!</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Tech Stack</th>
                  <th>Featured</th>
                  <th>Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.project_id}>
                    <td>
                      <div className="table-project-name">
                        {project.project_title}
                      </div>
                      <div className="table-project-desc">
                        {project.project_description?.substring(0, 60)}...
                      </div>
                    </td>
                    <td>
                      <div className="tech-chips">
                        {project.project_tech?.split(",").slice(0, 3).map((t) => (
                          <span key={t.trim()} className="tech-chip">{t.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {project.is_featured ? (
                        <span className="badge-featured">⭐ Featured</span>
                      ) : (
                        <span className="badge-regular">—</span>
                      )}
                    </td>
                    <td>
                      <div className="table-links">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-link"
                          >
                            🔗
                          </a>
                        )}
                        {project.project_github && (
                          <a
                            href={project.project_github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-link"
                          >
                            🐙
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="admin-btn admin-btn-secondary btn-sm"
                          onClick={() => handleEdit(project)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger btn-sm"
                          onClick={() => setDeleteConfirm(project.project_id)}
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
              <h3>Delete Project?</h3>
              <p>This will permanently remove the project. This cannot be undone.</p>
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

export default ManageProjects