import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import '../styles/components/navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <h2>Gabriel Nwofoke</h2>
          </Link>

          {/* Desktop Menu */}
          <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
            <li><Link to="/projects" onClick={() => setIsOpen(false)}>Projects</Link></li>
            <li><Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
            <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={toggleMenu}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar