import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from 'react-icons/fa'
import '../styles/components/footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Social Links */}
          <div className="social-links">
            <a href="https://github.com/sanctagee" target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com/in/gabbytech101" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
            <a href="https://twitter.com/gabby_tech001" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </a>
            <a href="mailto:tonygabito@gmail.com">
              <FaEnvelope size={24} />
            </a>
          </div>

          {/* Copyright */}
          <p className="copyright">
            &copy; {currentYear} Gabriel Nwofoke. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer