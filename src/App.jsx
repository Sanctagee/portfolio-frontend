import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/protectedRoute'
import PageTransition from './components/pageTransition'

import Navbar from './components/navbar'
import Footer from './components/footer'

import Home from './pages/home'
import About from './pages/about'
import Projects from './pages/projects'
import Blog from './pages/blog'
import BlogPost from './pages/blogPost'
import Contact from './pages/contact'
import AdminLogin from './pages/admin/adminLogin'
import Dashboard from './pages/admin/dashboard'
import ViewMessages from './pages/admin/viewMessages'
import ManageProjects from './pages/admin/manageProjects'
import ManageBlog from './pages/admin/manageBlog'

import './index.css'

// AnimatePresence needs access to location, so we extract the routes
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public Routes */}
        <Route path="/" element={
          <PageTransition><Home /></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition><About /></PageTransition>
        } />
        <Route path="/projects" element={
          <PageTransition><Projects /></PageTransition>
        } />
        <Route path="/blog" element={
          <PageTransition><Blog /></PageTransition>
        } />
        <Route path="/blog/:slug" element={
          <PageTransition><BlogPost /></PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition><Contact /></PageTransition>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <PageTransition><AdminLogin /></PageTransition>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <PageTransition><ViewMessages /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute>
            <PageTransition><ManageProjects /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/blog" element={
          <ProtectedRoute>
            <PageTransition><ManageBlog /></PageTransition>
          </ProtectedRoute>
        } />

      </Routes>
    </AnimatePresence>
  )
}

// AppShell hides Navbar/Footer on all admin pages
function AppShell() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="app-container">
      {!isAdminPage && <Navbar />}
      <main className="main-content">
        <AnimatedRoutes />
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  )
}

export default App