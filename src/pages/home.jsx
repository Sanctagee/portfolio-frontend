import { useState, useEffect } from "react"
import { skillsAPI, projectsAPI } from "../services/api"
import { SkeletonGrid } from "../components/skeletonLoader"
import '../styles/pages/home.css'

function Home() {
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [typedText, setTypedText] = useState("")

  const roles = ["Full-Stack Developer", "React Developer", "Node.js Developer", "PostgreSQL Developer"]

  useEffect(() => {
    let roleIndex = 0
    let charIndex = 0
    let isDeleting = false
    let timer

    const type = () => {
      const currentRole = roles[roleIndex]
      if (!isDeleting) {
        setTypedText(currentRole.slice(0, charIndex + 1))
        charIndex++
        if (charIndex === currentRole.length) {
          isDeleting = true
          timer = setTimeout(type, 1800)
          return
        }
      } else {
        setTypedText(currentRole.slice(0, charIndex - 1))
        charIndex--
        if (charIndex === 0) {
          isDeleting = false
          roleIndex = (roleIndex + 1) % roles.length
        }
      }
      timer = setTimeout(type, isDeleting ? 60 : 100)
    }

    timer = setTimeout(type, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, projectsRes] = await Promise.all([
          skillsAPI.getAll(),
          projectsAPI.getFeatured()
        ])
        setSkills(skillsRes.data.data)
        setProjects(projectsRes.data.data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Could not load data. Is the backend running?")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.skill_category]) acc[skill.skill_category] = []
    acc[skill.skill_category].push(skill)
    return acc
  }, {})

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <div className="container hero-container">

          {/* LEFT: Text */}
          <div className="hero-content">
            <p className="hero-greeting">Hello, I'm</p>
            <h1 className="hero-name">Gabriel Nwofoke</h1>
            <h2 className="hero-role">
              <span className="typed-text">{typedText}</span>
              <span className="cursor">|</span>
            </h2>
            <p className="hero-description">
              I build modern, scalable web applications using React, Node.js,
              and PostgreSQL. Passionate about clean code, great user experiences,
              and continuous learning.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">2+</span>
                <span className="stat-label">Years Learning</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Course Grade</span>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="/projects" className="btn btn-primary">View My Work</a>
              <a href="/contact" className="btn btn-secondary">Get In Touch</a>
              <a href="/gabriel-nwofoke-cv.pdf" className="btn btn-outline" download>
                Download CV
              </a>
            </div>
          </div>

          {/* RIGHT: Photo */}
          <div className="hero-photo-wrapper">
            <div className="hero-photo-frame">
              <img
                src="/images/profile.png"
                alt="Gabriel Nwofoke"
                className="hero-photo"
              />
            </div>
            <div className="hero-photo-decoration"></div>
          </div>

        </div>
      </section>

      {/* SKILLS */}
      <section className="skills-section">
        <div className="container">
          <h2 className="section-title">My Skills</h2>
          <p className="section-subtitle">Technologies I work with</p>

          {error && (
            <div className="error-banner">⚠️ {error}</div>
          )}

          {loading ? (
            <SkeletonGrid count={4} type="skill" />
          ) : skills.length === 0 ? (
            <p className="text-center" style={{ color: "#999" }}>
              No skills found. Check your backend and database.
            </p>
          ) : (
            <div className="skills-grid">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="skill-category card">
                  <h3 className="category-title">{category}</h3>
                  {categorySkills.map((skill) => (
                    <div key={skill.skill_id} className="skill-item">
                      <div className="flex-between">
                        <span className="skill-name">{skill.skill_name}</span>
                        <span className="skill-percent">{skill.skill_level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-fill"
                          style={{ width: `${skill.skill_level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="featured-projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Some of my recent work</p>

          {loading ? (
            <SkeletonGrid count={3} type="project" />
          ) : projects.length === 0 ? (
            <p className="text-center" style={{ color: "#999" }}>
              No featured projects yet. Add some from your admin panel.
            </p>
          ) : (
            <div className="grid grid-3">
              {projects.map((project) => (
              <div key={project.project_id} className="card project-card">
                {project.project_image && (
                  <img
                    src={project.project_image}
                    alt={project.project_title}
                    className="project-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                )}
                <h3>{project.project_title}</h3>
                <p>{project.project_description}</p>
                <p className="project-tech-tag">{project.project_tech}</p>
                <div className="hero-buttons mt-1">
                  {project.project_url && (
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Live Demo
                    </a>
                  )}
                  {project.project_github && (
                    <a href={project.project_github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
            </div>
          )}

          <div className="text-center mt-3">
            <a href="/projects" className="btn btn-primary">View All Projects</a>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home