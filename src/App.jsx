import { useEffect, useState } from 'react'
import './App.css'
import { loadPortfolioData } from './portfolioData.js'
import { Mail, Link as LinkIcon } from 'lucide-react'

function getImageUrl(value) {
  if (typeof value !== 'string') return ''

  const imageUrl = value.trim()
  const driveFileId = imageUrl.match(
    /drive\.google\.com\/file\/d\/([^/?]+)/
  )?.[1]

  if (driveFileId) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveFileId)}&sz=w1200`
  }

  return imageUrl
}

function formatAchievementDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Manila'
  }).format(date)
}

function GitHubIcon({ className, size = 20 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [portfolio, setPortfolio] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [profileImageFailed, setProfileImageFailed] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [showAllAchievements, setShowAllAchievements] = useState(false)

  useEffect(() => {
    let isCurrent = true

    loadPortfolioData()
      .then((data) => {
        if (isCurrent) setPortfolio(data)
      })
      .catch((error) => {
        if (isCurrent) {
          setLoadError(error.message)
          setPortfolio(null)
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [reloadKey])

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        document.querySelector('.mobile-menu-toggle')?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting)
        if (visibleSection) {
          setActiveSection(visibleSection.target.id)
        }
      },
      { rootMargin: '-25% 0px -65% 0px' }
    )

    document.querySelectorAll('main section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedAchievement && !showAllAchievements) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedAchievement(null)
        setShowAllAchievements(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedAchievement, showAllAchievements])

  const about = portfolio?.about ?? {}
  const skills = (portfolio?.skills ?? [])
    .filter((skill) => skill?.visible !== false && skill?.name)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
  const projects = (portfolio?.projects ?? [])
    .filter((project) => project?.visible !== false && project?.title)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
  const achievements = (portfolio?.achievements ?? [])
    .filter((achievement) => achievement?.visible !== false && achievement?.title)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
  const previewAchievements = achievements.slice(0, 3)
  const contactItems = (portfolio?.contact ?? []).filter(
    (item) => item?.visible !== false && (item?.label || item?.value)
  )
  const skillCategories = [...new Set(skills.map((skill) => skill.category || 'Other'))]
  const profileImage =
    typeof about.profileImage === 'string' ? about.profileImage.trim() : ''
  const retryLoading = () => {
    setIsLoading(true)
    setLoadError('')
    setReloadKey((key) => key + 1)
  }

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <a
          href="#home"
          className="logo"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ASC.
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul
          className={`nav-links${isMobileMenuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
        >
          <li>
            <a
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className={activeSection === 'about' ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#projects"
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#achievements"
              className={activeSection === 'achievements' ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Achievements
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <main aria-busy={isLoading}>
        {isLoading && (
          <p className="data-message" role="status">
            Loading portfolio content…
          </p>
        )}
        {loadError && (
          <div className="data-message data-error" role="alert">
            <p>{loadError}</p>
            <button type="button" onClick={retryLoading}>
              Try again
            </button>
          </div>
        )}

        <section id="home" className="hero section">
          <div className="hero-content">
            <p className="eyebrow">WELCOME TO MY PORTFOLIO</p>

            {about.name && <h1>{about.name}</h1>}
            {about.careerInterests && <h2>{about.careerInterests}</h2>}
            {about.introduction && <p className="hero-description">{about.introduction}</p>}

            <a href="#projects" className="primary-button">
              Explore My Projects
            </a>
          </div>

          {profileImage && (
            <div className="profile-container">
              <img
                src={profileImageFailed ? '/profile.jpg' : profileImage}
                alt={about.name ? `Portrait of ${about.name}` : 'Profile portrait'}
                className="profile-picture"
                onError={() => setProfileImageFailed(true)}
              />
            </div>
          )}
        </section>

        <section id="about" className="section">
          <p className="eyebrow">GET TO KNOW ME</p>
          <h2 className="section-title">About Me.</h2>

          
          {about.aboutDescription || about.introduction ? (
            <p className="section-description">
              {about.aboutDescription || about.introduction}
            </p>
          ) : !isLoading && !loadError ? (
            <p className="empty-state">
              About information has not been added yet.
            </p>
          ) : null}


          {(about.education || about.school) && (
            <div className="education">
              <p className="small-label">EDUCATION</p>
              {about.education && <h3>{about.education}</h3>}
              {about.school && <p>{about.school}</p>}
            </div>
          )}
          {about.careerInterests && (
            <div className="career-interests">
              <p className="small-label">CAREER INTERESTS</p>
              <p>{about.careerInterests}</p>
            </div>
          )}
        </section>

        <section id="skills" className="section">
          <p className="eyebrow">WHAT I WORK WITH</p>
          <h2 className="section-title">My Skills.</h2>

          {skillCategories.map((category) => (
            <div className="skill-category" key={category}>
              <h3>{category}</h3>
              <div className="skills-grid">
                {skills
                  .filter((skill) => (skill.category || 'Other') === category)
                  .map((skill, index) => (
                    <div className="skill-item" key={`${skill.name}-${index}`}>
                      {skill.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
          {!isLoading && !loadError && skills.length === 0 && (
            <p className="empty-state">No skills have been added yet.</p>
          )}
        </section>

        <section id="projects" className="section">
          <p className="eyebrow">MY RECENT WORK</p>
          <h2 className="section-title">Selected Projects.</h2>

          {projects.length > 0 && (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <article className="project-card" key={`${project.title}-${index}`}>
                  {getImageUrl(project.imageUrl) && (
                    <img
                      className="project-image"
                      src={getImageUrl(project.imageUrl)}
                      alt={project.title}
                    />
                  )}
                  {project.order && <p className="project-number">{project.order}</p>}
                  <h3>{project.title}</h3>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="project-tech">
                      {Array.isArray(project.technologies)
                        ? project.technologies.join(' · ')
                        : project.technologies}
                    </p>
                  )}
                  {project.status && (
                    <span className="project-status">{project.status}</span>
                  )}
                </article>
              ))}
            </div>
          )}
          {!isLoading && !loadError && projects.length === 0 && (
            <p className="empty-state">No projects have been added yet.</p>
          )}
        </section>

        <section id="achievements" className="section">
          <p className="eyebrow">MILESTONES</p>
          <h2 className="section-title">Achievements.</h2>

          {previewAchievements.length > 0 && (
            <ul className="achievement-list">
              {previewAchievements.map((achievement, index) => {
                const imageUrl = getImageUrl(achievement.imageUrl)

                return (
                  <li
                    className="achievement-list-item"
                    key={`${achievement.title}-${index}`}
                  >
                    {imageUrl && (
                      <button
                        className="achievement-thumb-button"
                        type="button"
                        onClick={() => setSelectedAchievement({ ...achievement, imageUrl })}
                        aria-label={`Preview ${achievement.title}`}
                      >
                        <img
                          className="achievement-thumbnail"
                          src={imageUrl}
                          alt=""
                        />
                      </button>
                    )}
                    <div className="achievement-list-info">
                      <h3>{achievement.title}</h3>
                      {(achievement.type || achievement.issuer || achievement.date) && (
                        <p>
                          {[
                            achievement.type,
                            achievement.issuer,
                            formatAchievementDate(achievement.date)
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                    </div>
                    {imageUrl && (
                      <button
                        className="achievement-list-action"
                        type="button"
                        onClick={() => setSelectedAchievement({ ...achievement, imageUrl })}
                      >
                        Preview
                      </button>
                    )}
                    {achievement.url && (
                      <a
                        className="achievement-link"
                        href={achievement.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Verify
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          {achievements.length > 3 && (
            <button
              className="view-all-achievements"
              type="button"
              onClick={() => setShowAllAchievements(true)}
            >
              View all certificates ({achievements.length})
            </button>
          )}
          {!isLoading && !loadError && achievements.length === 0 && (
            <p className="empty-state">No achievements have been added yet.</p>
          )}
        </section>

        <section id="contact" className="section contact-section">
          <p className="eyebrow">LET'S CONNECT</p>
          <h2 className="section-title">Contact Me.</h2>

          {contactItems.length > 0 ? (
            <ul className="contact-links">
              {contactItems.map((item, index) => {
                const label = item.label?.trim().toLowerCase()
                const Icon = label === 'email'
                  ? Mail
                  : label === 'github'
                    ? GitHubIcon
                    : LinkIcon

                return (
                  <li key={`${item.label || item.value}-${index}`}>
                    {item.url ? (
                      <a
                        href={item.url}
                        className="contact-link"
                        aria-label={item.label || 'Contact link'}
                        title={item.label || 'Contact link'}
                      >
                        <Icon className="contact-icon" size={24} />
                      </a>
                    ) : (
                      <span
                        className="contact-link"
                        role="img"
                        aria-label={item.label || item.value}
                        title={item.label || item.value}
                      >
                        <Icon className="contact-icon" size={24} />
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : !isLoading && !loadError ? (
            <p className="empty-state">No contact links have been added yet.</p>
          ) : null}
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()}{about.name ? ` ${about.name}.` : ''}</p>
        <a href="#home">Back to top ↑</a>
      </footer>

      {(selectedAchievement || showAllAchievements) && (
        <div
          className="certificate-modal"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAchievement(null)
              setShowAllAchievements(false)
            }
          }}
        >
          <div
            className="certificate-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={
              selectedAchievement?.title || 'All certificates'
            }
          >
            <button
              className="certificate-modal-close"
              type="button"
              onClick={() => {
                setSelectedAchievement(null)
                setShowAllAchievements(false)
              }}
              autoFocus
            >
              Close
            </button>
            {selectedAchievement ? (
              <>
                {showAllAchievements && (
                  <button
                    className="certificate-back-button"
                    type="button"
                    onClick={() => setSelectedAchievement(null)}
                  >
                    Back to all certificates
                  </button>
                )}
                <h2>{selectedAchievement.title}</h2>
                <img
                  className="certificate-full-image"
                  src={selectedAchievement.imageUrl}
                  alt={`${selectedAchievement.title} certificate`}
                />
              </>
            ) : (
              <>
                <h2>All Certificates</h2>
                <ul className="achievement-list modal-achievement-list">
                  {achievements.map((achievement, index) => {
                    const imageUrl = getImageUrl(achievement.imageUrl)

                    return (
                      <li
                        className="achievement-list-item"
                        key={`${achievement.title}-${index}`}
                      >
                        {imageUrl && (
                          <button
                            className="achievement-thumb-button"
                            type="button"
                            onClick={() =>
                              setSelectedAchievement({ ...achievement, imageUrl })
                            }
                            aria-label={`Preview ${achievement.title}`}
                          >
                            <img className="achievement-thumbnail" src={imageUrl} alt="" />
                          </button>
                        )}
                        <div className="achievement-list-info">
                          <h3>{achievement.title}</h3>
                          {(achievement.type || achievement.issuer || achievement.date) && (
                            <p>
                              {[
                                achievement.type,
                                achievement.issuer,
                                formatAchievementDate(achievement.date)
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                        </div>
                        {imageUrl && (
                          <button
                            className="achievement-list-action"
                            type="button"
                            onClick={() =>
                              setSelectedAchievement({ ...achievement, imageUrl })
                            }
                          >
                            Preview
                          </button>
                        )}
                        {achievement.url && (
                          <a
                            className="achievement-link"
                            href={achievement.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Verify
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App
