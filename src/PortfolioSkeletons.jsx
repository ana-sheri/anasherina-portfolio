function SkeletonBlock({ className = '' }) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />
}

export function HeroSkeleton() {
  return (
    <>
      <div className="hero-content hero-skeleton">
        <p className="eyebrow">WELCOME TO MY PORTFOLIO</p>
        <SkeletonBlock className="skeleton-name" />
        <SkeletonBlock className="skeleton-status" />
        <SkeletonBlock className="skeleton-heading" />
        <div className="skeleton-copy">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock className="skeleton-line-short" />
        </div>
        <SkeletonBlock className="skeleton-button" />
      </div>
      <div className="profile-container">
        <SkeletonBlock className="skeleton-profile" />
      </div>
    </>
  )
}

export function AboutSkeleton() {
  return (
    <div className="about-skeleton">
      <div className="skeleton-copy">
        <SkeletonBlock />
        <SkeletonBlock />
        <SkeletonBlock />
        <SkeletonBlock className="skeleton-line-short" />
      </div>
      <div className="skeleton-education">
        <SkeletonBlock className="skeleton-label" />
        <SkeletonBlock className="skeleton-text-medium" />
        <SkeletonBlock className="skeleton-text-short" />
      </div>
      <div className="skeleton-interests">
        <SkeletonBlock className="skeleton-label" />
        <SkeletonBlock className="skeleton-text-medium" />
      </div>
    </div>
  )
}

export function SkillsSkeleton() {
  return (
    <div className="skills-grid skills-skeleton">
      {Array.from({ length: 8 }, (_, index) => (
        <SkeletonBlock className="skeleton-skill" key={index} />
      ))}
    </div>
  )
}

export function ProjectsSkeleton() {
  return (
    <div className="projects-grid projects-skeleton">
      {Array.from({ length: 2 }, (_, index) => (
        <article className="project-card skeleton-project" key={index} aria-hidden="true">
          <SkeletonBlock className="skeleton-project-image" />
          <SkeletonBlock className="skeleton-label" />
          <SkeletonBlock className="skeleton-text-medium" />
          <div className="skeleton-copy">
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock className="skeleton-line-short" />
          </div>
          <SkeletonBlock className="skeleton-text-short" />
          <SkeletonBlock className="skeleton-project-status" />
        </article>
      ))}
    </div>
  )
}

export function AchievementsSkeleton() {
  return (
    <ul className="achievement-list achievements-skeleton" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <li className="achievement-list-item" key={index}>
          <SkeletonBlock className="skeleton-certificate" />
          <SkeletonBlock className="skeleton-text-medium" />
          <SkeletonBlock className="skeleton-text-short" />
          <SkeletonBlock className="skeleton-action" />
        </li>
      ))}
    </ul>
  )
}

export function ContactSkeleton() {
  return (
    <div className="contact-skeleton" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <SkeletonBlock className="skeleton-contact-icon" key={index} />
      ))}
    </div>
  )
}
