import '../styles/skeleton.css'

// Skeleton for project cards
export function ProjectSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-body">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton-dots">
          <div className="skeleton skeleton-dot"></div>
          <div className="skeleton skeleton-dot"></div>
          <div className="skeleton skeleton-dot"></div>
          <div className="skeleton skeleton-dot"></div>
        </div>
      </div>
    </div>
  )
}

// Skeleton for skill cards
export function SkillSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-body">
        <div className="skeleton skeleton-title"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skill-skeleton-item">
            <div className="skeleton-skill-header">
              <div className="skeleton skeleton-text short"></div>
              <div className="skeleton skeleton-text xshort"></div>
            </div>
            <div className="skeleton skeleton-bar"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Grid wrapper — renders N skeleton cards in a grid
export function SkeletonGrid({ count = 4, type = "project" }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) =>
        type === "skill"
          ? <SkillSkeleton key={i} />
          : <ProjectSkeleton key={i} />
      )}
    </div>
  )
}