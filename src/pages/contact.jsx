import { useState } from "react"
import { contactAPI } from "../services/api"
import '../styles/pages/contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    contact_name: "",
    contact_email: "",
    contact_subject: "",
    contact_message: ""
  })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")
    try {
      await contactAPI.send(formData)
      setStatus("success")
      setFormData({
        contact_name: "",
        contact_email: "",
        contact_subject: "",
        contact_message: ""
      })
    } catch (err) {
      console.error("Contact error:", err)
      setStatus("error")
    }
  }

  return (
    <div className="contact-page">

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>Have a project in mind or just want to say hello? I'd love to hear from you.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container contact-container">

          {/* Left: Info */}
          <div className="contact-info">
            <h2>Let's Talk</h2>
            <p>
              I'm currently open to new opportunities — whether it's a full-time role,
              freelance project, or just a conversation about tech. My inbox is always open.
            </p>

            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h4>Location</h4>
                  <p>Nigeria</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>gabbytech101@gmail.com</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">💼</div>
                <div>
                  <h4>LinkedIn</h4>
                  <p>linkedin.com/in/gabriel-c-nwofoke</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🐙</div>
                <div>
                  <h4>GitHub</h4>
                  <p>github.com/Sanctagee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact_name">Your Name</label>
                  <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="Gabriel Nwofoke"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact_email">Email Address</label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact_subject">Subject</label>
                <input
                  type="text"
                  id="contact_subject"
                  name="contact_subject"
                  value={formData.contact_subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry / Job Opportunity / Hello"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact_message">Message</label>
                <textarea
                  id="contact_message"
                  name="contact_message"
                  value={formData.contact_message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or what you'd like to discuss..."
                  rows={6}
                  required
                />
              </div>

              {/* Status messages */}
              {status === "success" && (
                <div className="form-status success">
                  ✅ Message sent! I'll get back to you soon.
                </div>
              )}
              {status === "error" && (
                <div className="form-status error">
                  ❌ Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  )
}

export default Contact