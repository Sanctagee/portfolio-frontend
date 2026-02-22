import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

// Automatically attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken")
    }
    return Promise.reject(error)
  }
)

// ===========================
// Skills API
// ===========================
export const skillsAPI = {
  getAll: () => api.get("/skills"),
  add: (data) => api.post("/skills", data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`)
}

// ===========================
// Projects API
// ===========================
export const projectsAPI = {
  getAll: () => api.get("/projects"),
  getFeatured: () => api.get("/projects/featured"),
  getById: (id) => api.get(`/projects/${id}`),
  add: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
}

// ===========================
// Blog API
// ===========================
export const blogAPI = {
  getPublished: () => api.get("/blog/published"),
  getBySlug: (slug) => api.get(`/blog/post/${slug}`),
  getAll: () => api.get("/blog"),
  add: (data) => api.post("/blog", data),
  update: (id, data) => api.put(`/blog/${id}`, data),
  delete: (id) => api.delete(`/blog/${id}`)
}

// ===========================
// Contact API
// ===========================
export const contactAPI = {
  send: (data) => api.post("/contact", data),
  getAll: () => api.get("/contact"),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`)
}

// ===========================
// Auth API
// ===========================
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  verify: () => api.get("/auth/verify")
}

export default api
