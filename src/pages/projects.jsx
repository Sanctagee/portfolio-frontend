import { useState, useEffect } from "react"
import { projectsAPI } from "../services/api"
import { SkeletonGrid } from "../components/skeletonLoader"
import '../styles/pages/projects.css'

function Projects() {
  const [projects, setProjects] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeFilter, setActiveFilter] = useState("All")
  const [filters, setFilters] = useState(["All"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectsAPI.getAll()
        const data = res.data.data
        setProjects(data)
        setFiltered(data)

        // Build filter tags from tech stacks
        const allTechs = new Set()
        data.forEach((p) => {
          if (p.project_tech) {
            p.project_tech.split(",").forEach((t) => allTechs.add(t.trim()))
          }
        })
        setFilters(["All", ...Array.from(allTechs)])
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Could not load projects. Is the backend running?")
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleFilter = (tech) => {
    setActiveFilter(tech)
    if (tech === "All") {
      setFiltered(projects)
    } else {
      setFiltered(
        projects.filter((p) =>
          p.project_tech?.toLowerCase().includes(tech.toLowerCase())
        )
      )
    }
  }

  return (
    <div className="projects-page">

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>My Projects</h1>
          <p>A collection of things I've designed, built, and shipped.</p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="container">

          {/* Filter Tabs */}
          {!loading && !error && filters.length > 1 && (
            <div className="filter-tabs">
              {filters.map((tech) => (
                <button
                  key={tech}
                  className={`filter-btn ${activeFilter === tech ? "active" : ""}`}
                  onClick={() => handleFilter(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-banner">⚠️ {error}</div>
          )}

          {/* Loading → Skeleton */}
          {loading ? (
            <SkeletonGrid count={6} type="project" />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>No projects found{activeFilter !== "All" ? ` for "${activeFilter}"` : ""}.</p>
              {activeFilter !== "All" && (
                <button className="btn btn-secondary" onClick={() => handleFilter("All")}>
                  Show All
                </button>
              )}
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map((project) => (
                <div key={project.project_id} className="project-card card">

                  {/* Image or placeholder */}
                  {project.project_image ? (
                    <img
                      src={project.project_image}
                      alt={project.project_title}
                      className="project-image"
                    />
                  ) : (
                    <div className="project-image-placeholder">
                      <span>🖥️</span>
                    </div>
                  )}

                  {/* Featured badge */}
                  {project.is_featured && (
                    <span className="featured-badge">⭐ Featured</span>
                  )}

                  <div className="project-body">
                    <h3 className="project-title">{project.project_title}</h3>
                    <p className="project-description">{project.project_description}</p>

                    {/* Tech tags */}
                    <div className="tech-tags">
                      {project.project_tech?.split(",").map((tech) => (
                        <span key={tech.trim()} className="tech-tag">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="project-links">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {project.project_github && (
                        <a
                          href={project.project_github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          🐙 GitHub
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  )
}

export default Projects