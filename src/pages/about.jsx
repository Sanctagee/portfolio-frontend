import '../styles/pages/about.css'

function About() {
  const experiences = [
    {
      id: 1,
      role: "Frontend Developer & Tech Instructor",
      company: "Edenites Technologies",
      location: "Abakaliki, Nigeria",
      period: "Sep 2024 – Present",
      points: [
        "Led frontend development for Edenites Academy e-learning platform using React & Django, boosting user engagement by 30% for 5,000+ learners.",
        "Achieved 40% load-time improvement through code splitting and bundle optimization techniques.",
        "Scored 95%+ on Lighthouse accessibility audits using semantic HTML and ARIA roles.",
        "Integrated secure JWT authentication with Django REST Framework for 2,000+ active accounts.",
        "Mentored junior developers in React best practices, improving team productivity and code quality.",
        "Taught HTML, CSS & JavaScript curriculum to 30+ students, improving coding assessment scores by 40%.",
        "Created 15+ YouTube tutorials on web development, attracting 2,000+ views and growing a learner community.",
        "Delivered Data Analysis & Visualization training using Excel and Power BI to 20+ students.",
      ],
    },
    {
      id: 2,
      role: "Academic Dean",
      company: "St. Augustine's Seminary",
      location: "Nigeria",
      period: "Sep 2019 – Oct 2020",
      points: [
        "Managed academic programs for 200+ students, improving exam pass rates by 15%.",
        "Mentored over 200 students and revamped curriculum, improving course engagement by 30%.",
      ],
    },
    {
      id: 3,
      role: "Procurator",
      company: "Bigard Memorial Seminary",
      location: "Enugu, Nigeria",
      period: "Oct 2020 – Oct 2023",
      points: [
        "Led procurement initiatives and managed budgets exceeding $2,000, achieving a 15% cost reduction.",
        "Negotiated supplier contracts that reduced operational costs by 15%.",
      ],
    },
  ]

  const education = [
    {
      id: 1,
      degree: "B.Sc Software Development (In Progress)",
      school: "Brigham Young University – Idaho (Online)",
      period: "2024 – Present",
      detail: "GPA: 3.8/4.0 · Completed Block 1 (2026) · Currently in Block 2: Web Services",
      icon: "🎓",
    },
    {
      id: 2,
      degree: "Bachelor of Theology",
      school: "Bigard Memorial Seminary, Enugu",
      period: "Completed June 2024",
      detail: null,
      icon: "📖",
    },
    {
      id: 3,
      degree: "Bachelor of Philosophy",
      school: "Pope John Paul II Major Seminary, Awka",
      period: "Completed June 2019",
      detail: "Critical thinking, logic, and structured problem-solving.",
      icon: "🧠",
    },
  ]

  const certifications = [
    { name: "Basic Python Programming", issuer: "ShieldedBit", period: "Oct 2023 – Jun 2024" },
    { name: "PathwayConnect Certificate", issuer: "BYU-Pathway Worldwide", period: "Sep 2024 – Jun 2025" },
  ]

  const values = [
    { icon: "🎯", title: "Detail-Oriented", desc: "Clean code, pixel-perfect UI, and meaningful user experiences — the small things matter." },
    { icon: "📚", title: "Always Learning", desc: "Currently pursuing a B.Sc in Software Development while working. Growth is non-negotiable." },
    { icon: "🤝", title: "People-First", desc: "From mentoring junior devs to teaching 30+ students, I believe technology is about people." },
    { icon: "🚀", title: "Delivery-Focused", desc: "40% performance gains. 95% Lighthouse scores. Results I can point to, not just promises." },
  ]

  const skills = [
    { category: "Frontend", items: ["React", "JavaScript (ES6+)", "HTML5", "CSS3"] },
    { category: "Backend", items: ["Node.js", "Express", "Django", "REST APIs"] },
    { category: "Database", items: ["PostgreSQL", "SQL"] },
    { category: "Other", items: ["Git", "Vercel", "Render", "C#", "Python", "OOP"] },
  ]

  return (
    <div className="about-page">

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>About Me</h1>
          <p>Developer. Instructor. Lifelong Learner.</p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="bio-section">
        <div className="container bio-container">

          <div className="bio-photo-wrapper">
            <div className="bio-photo-frame">
              <img
                src="/images/gabby.jpg"
                alt="Gabriel Chikwendu Nwofoke"
                className="bio-photo"
              />
            </div>
          </div>

          <div className="bio-content">
            <h2>Gabriel Chikwendu Nwofoke</h2>
            <p className="bio-tag">Full-Stack Developer · Tech Instructor · Ebonyi, Nigeria</p>

            <p>
              I started as a frontend developer, fascinated by the intersection of design and code. 
              Over time, curiosity drove me deeper — into backend systems, databases, and 
              full-stack architecture. Today I build complete web applications from the database 
              all the way to the user interface.
            </p>
            <p>
              At <strong>Edenites Technologies</strong>, I led frontend development for an 
              e-learning platform serving thousands of users, achieving a 40% performance 
              improvement and 95%+ Lighthouse accessibility scores. I also mentor junior 
              developers and teach web development to students — because I believe the best 
              way to master something is to teach it.
            </p>
            <p>
              I'm currently pursuing a B.Sc in Software Development at <strong>BYU–Idaho</strong> 
              (GPA: 3.8) while working and building projects. My background in philosophy and 
              theology gives me a unique perspective — I approach engineering with clarity, 
              structured thinking, and a deep sense of responsibility to the people I build for.
            </p>

            <div className="bio-highlights">
              <div className="highlight">
                <span className="highlight-icon">📍</span>
                <span>Ebonyi, Nigeria</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">💼</span>
                <span>Open to Remote Roles</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">⏱️</span>
                <span>Available in 2 Weeks</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">🎓</span>
                <span>3 Degrees + Ongoing B.Sc</span>
              </div>
            </div>

            <div className="bio-actions">
              <a href="/contact" className="btn btn-primary">Hire Me</a>
              <a
                href="/gabriel-nwofoke-cv.pdf"
                className="btn btn-secondary"
                download
              >
                Download CV
              </a>
              <a
                href="https://github.com/sanctagee"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark"
              >
                🐙 GitHub
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Skills Quick View */}
      <section className="skills-quick-section">
        <div className="container">
          <h2 className="section-title">Tech Stack</h2>
          <p className="section-subtitle">Tools and technologies I work with</p>
          <div className="skills-quick-grid">
            {skills.map((group) => (
              <div key={group.category} className="skills-quick-card card">
                <h4 className="skills-quick-category">{group.category}</h4>
                <div className="skills-quick-tags">
                  {group.items.map((item) => (
                    <span key={item} className="skill-chip">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">What I Stand For</h2>
          <p className="section-subtitle">The principles that guide my work</p>
          <div className="values-grid">
            {values.map((v) => (
              <div key={v.title} className="value-card card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">Roles I've held and impact I've made</p>
          <div className="timeline">
            {experiences.map((exp) => (
              <div key={exp.id} className="timeline-item-full card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <p className="timeline-company">{exp.company} · {exp.location}</p>
                  </div>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <ul className="timeline-points">
                  {exp.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="education-section">
        <div className="container">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">Academic foundations that shape my thinking</p>
          <div className="education-grid">
            {education.map((edu) => (
              <div key={edu.id} className="education-card card">
                <div className="edu-icon">{edu.icon}</div>
                <div className="edu-info">
                  <h3>{edu.degree}</h3>
                  <p className="edu-school">{edu.school}</p>
                  <p className="edu-period">{edu.period}</p>
                  {edu.detail && <p className="edu-detail">{edu.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="certs-section">
        <div className="container">
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">Credentials earned along the way</p>
          <div className="certs-grid">
            {certifications.map((cert) => (
              <div key={cert.name} className="cert-card card">
                <span className="cert-icon">🏅</span>
                <div>
                  <h4>{cert.name}</h4>
                  <p>{cert.issuer}</p>
                  <p className="cert-period">{cert.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default About