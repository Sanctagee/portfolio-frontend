import '../styles/pages/home.css'

function Home() {
  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Hi, I'm Gabriel Nwofoke</h1>
            <h2>Full Stack Developer</h2>
            <p>
              I build modern web applications using React, Node.js, and PostgreSQL.
              Passionate about creating beautiful, functional, and user-friendly experiences.
            </p>
            <div className="hero-buttons">
              <a href="/projects" className="btn btn-primary">View My Work</a>
              <a href="/contact" className="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home