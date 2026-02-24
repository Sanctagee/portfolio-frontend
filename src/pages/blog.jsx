import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { blogAPI } from "../services/api"
import { SkeletonGrid } from "../components/skeletonLoader"
import '../styles/pages/blog.css'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await blogAPI.getPublished()
        setPosts(res.data.data || [])
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError("Could not load blog posts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

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

  return (
    <div className="blog-page">

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Blog</h1>
          <p>Thoughts on web development, tech, and building things that matter.</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="blog-section">
        <div className="container">

          {error && (
            <div className="error-banner">⚠️ {error}</div>
          )}

          {loading ? (
            <SkeletonGrid count={6} type="project" />
          ) : posts.length === 0 ? (
            <div className="blog-empty">
              <span>📝</span>
              <h3>No posts yet</h3>
              <p>Check back soon — posts are coming!</p>
            </div>
          ) : (
            <>
              {/* Featured post — first one gets bigger treatment */}
              {posts.length > 0 && (
                <div className="blog-featured">
                  <Link
                    to={`/blog/${posts[0].blog_slug}`}
                    className="featured-post-card card"
                  >
                    {posts[0].blog_image && (
                      <div className="featured-image-wrapper">
                        <img
                          src={posts[0].blog_image}
                          alt={posts[0].blog_title}
                          className="featured-image"
                        />
                      </div>
                    )}
                    <div className="featured-body">
                      <span className="featured-label">✨ Latest Post</span>
                      <h2 className="featured-title">{posts[0].blog_title}</h2>
                      <p className="featured-summary">{posts[0].blog_summary}</p>
                      <div className="post-meta">
                        <span>📅 {formatDate(posts[0].blog_date)}</span>
                        <span>⏱️ {readTime(posts[0].blog_content)}</span>
                      </div>
                      <span className="read-more-btn">Read Post →</span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Remaining posts grid */}
              {posts.length > 1 && (
                <div className="blog-grid">
                  {posts.slice(1).map((post) => (
                    <Link
                      key={post.blog_id}
                      to={`/blog/${post.blog_slug}`}
                      className="blog-card card"
                    >
                      {post.blog_image && (
                        <img
                          src={post.blog_image}
                          alt={post.blog_title}
                          className="blog-card-image"
                        />
                      )}
                      {!post.blog_image && (
                        <div className="blog-card-placeholder">
                          <span>📝</span>
                        </div>
                      )}
                      <div className="blog-card-body">
                        <h3 className="blog-card-title">{post.blog_title}</h3>
                        <p className="blog-card-summary">{post.blog_summary}</p>
                        <div className="post-meta">
                          <span>📅 {formatDate(post.blog_date)}</span>
                          <span>⏱️ {readTime(post.blog_content)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>

    </div>
  )
}

export default Blog