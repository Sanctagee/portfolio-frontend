import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { blogAPI } from "../services/api"
import '../styles/pages/blogPost.css'

function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await blogAPI.getBySlug(slug)
        if (res.data.success) {
          setPost(res.data.data)
        } else {
          setError("Post not found.")
        }
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("Post not found or unavailable.")
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const readTime = (content) => {
    if (!content) return "1 min read"
    const words = content.trim().split(/\s+/).length
    const mins = Math.ceil(words / 200)
    return `${mins} min read`
  }

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <div className="post-skeleton">
            <div className="skeleton-title" />
            <div className="skeleton-meta" />
            <div className="skeleton-body">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-line" style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <div className="post-error">
            <span>😕</span>
            <h2>Post Not Found</h2>
            <p>{error}</p>
            <Link to="/blog" className="btn btn-primary">← Back to Blog</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-post-page">

      {/* Cover Image */}
      {post.blog_image && (
        <div className="post-cover">
          <img src={post.blog_image} alt={post.blog_title} />
          <div className="post-cover-overlay" />
        </div>
      )}

      <div className="container">
        <article className="post-article">

          {/* Back Link */}
          <Link to="/blog" className="post-back-link">
            ← Back to Blog
          </Link>

          {/* Post Header */}
          <header className="post-header">
            <h1 className="post-title">{post.blog_title}</h1>
            {post.blog_summary && (
              <p className="post-subtitle">{post.blog_summary}</p>
            )}
            <div className="post-meta-bar">
              <span>📅 {formatDate(post.blog_date)}</span>
              <span className="meta-divider">·</span>
              <span>⏱️ {readTime(post.blog_content)}</span>
              <span className="meta-divider">·</span>
              <span>✍️ Gabriel Nwofoke</span>
            </div>
          </header>

          {/* Divider */}
          <div className="post-divider" />

          {/* Post Content */}
          <div className="post-content">
            {post.blog_content?.split("\n").map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i}>{paragraph}</p>
              ) : (
                <br key={i} />
              )
            )}
          </div>

          {/* Post Footer */}
          <div className="post-footer">
            <div className="post-footer-author">
              <div className="author-avatar">GN</div>
              <div>
                <p className="author-name">Gabriel Chikwendu Nwofoke</p>
                <p className="author-role">Full-Stack Developer · Tech Instructor</p>
              </div>
            </div>
            <Link to="/blog" className="btn btn-secondary">
              ← More Posts
            </Link>
          </div>

        </article>
      </div>

    </div>
  )
}

export default BlogPost