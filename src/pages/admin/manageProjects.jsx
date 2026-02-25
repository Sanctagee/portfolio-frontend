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
  project_image: "", // Will store the URL after upload
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
  
  // New state for image upload
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(false)

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

  // New function to handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showFeedback("error", "Image must be less than 5MB")
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        showFeedback("error", "Please select an image file")
        return
      }
      
      setImageFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      // Clear any existing image URL in formData since we're uploading a file
      setFormData(prev => ({ ...prev, project_image: "" }))
    }
  }

  // Clear selected image
  const handleClearImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview) // Clean up preview URL
      setImagePreview(null)
    }
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
    
    // Clear any existing file selection
    setImageFile(null)
    setImagePreview(null)
    
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancel = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
    handleClearImage() // Clear image preview
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setUploadProgress(true)
    
    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData()
      
      // Append all form fields
      formDataToSend.append('project_title', formData.project_title)
      formDataToSend.append('project_description', formData.project_description)
      formDataToSend.append('project_tech', formData.project_tech)
      formDataToSend.append('project_url', formData.project_url || '')
      formDataToSend.append('project_github', formData.project_github || '')
      formDataToSend.append('is_featured', formData.is_featured)
      
      // If there's an image file, append it
      if (imageFile) {
        formDataToSend.append('project_image', imageFile)
      } else if (formData.project_image) {
        // If no new file but there's an existing image URL, send that too
        formDataToSend.append('project_image_url', formData.project_image)
      }
      
      let response
      if (editingId) {
        // For update, we need to use a custom fetch or modify your API
        // Since your projectsAPI.update might not support FormData yet
        response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${editingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            // Don't set Content-Type here - browser will set it with boundary
          },
          body: formDataToSend
        })
        
        if (!response.ok) throw new Error('Update failed')
        showFeedback("success", "Project updated successfully!")
      } else {
        // For add
        response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataToSend
        })
        
        if (!response.ok) throw new Error('Add failed')
        showFeedback("success", "Project added successfully!")
      }
      
      handleCancel()
      fetchProjects()
    } catch (err) {
      console.error("Save error:", err)
      showFeedback("error", "Something went wrong. Please try again.")
    } finally {
      setSaving(false)
      setUploadProgress(false)
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
            <form onSubmit={handleSubmit} className="project-form" encType="multipart/form-data">

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

              {/* Image Upload Section - NEW */}
              <div className="form-group image-upload-group">
                <label>Project Image</label>
                
                {/* Image Preview */}
                {(imagePreview || formData.project_image) && (
                  <div className="image-preview-container">
                    <img 
                      src={imagePreview || formData.project_image} 
                      alt="Preview" 
                      className="image-preview"
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={handleClearImage}
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
                
                {/* Upload Options */}
                <div className="upload-options">
                  <div className="upload-option">
                    <label className="upload-label">
                      <span>📁 Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                      />
                    </label>
                    <span className="or-divider">or</span>
                  </div>
                  
                  <div className="url-option">
                    <input
                      type="url"
                      name="project_image"
                      value={formData.project_image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={imageFile !== null} // Disable if file is selected
                    />
                    <small>Paste image URL (if no file upload)</small>
                  </div>
                </div>
                
                {uploadProgress && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <span>Uploading...</span>
                  </div>
                )}
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
                  <th>Image</th> 
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
                      <div className="table-project-image">
                        {project.project_image ? (
                          <img 
                            src={project.project_image} 
                            alt={project.project_title}
                            className="project-thumbnail"
                          />
                        ) : (
                          <div className="no-image">📷</div>
                        )}
                      </div>
                    </td>
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
                        {project.project_tech?.split(",").slice(0, 3).map((t, i) => (
                          <span key={i} className="tech-chip">{t.trim()}</span>
                        ))}
                        {project.project_tech?.split(",").length > 3 && (
                          <span className="tech-chip more">+{project.project_tech.split(",").length - 3}</span>
                        )}
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
                            title="Live Demo"
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
                            title="GitHub Repository"
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