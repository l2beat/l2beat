import type { BaseProject } from './BaseProject'

interface PreviewProps {
  project: BaseProject
}

export function Preview({project}: PreviewProps) {
  const { display } = project

  // Define categories and icons (Replace with actual icons or component-based icons if available)
  const linkCategories = [
    { key: 'websites', label: 'Website', icon: '🌍' },
    { key: 'apps', label: 'App', icon: '📱' },
    { key: 'documentation', label: 'Docs', icon: '📖' },
    { key: 'explorers', label: 'Explorer', icon: '🔍' },
    { key: 'repositories', label: 'Repository', icon: '💻' },
    { key: 'socialMedia', label: 'Social', icon: '📢' },
    { key: 'rollupCodes', label: 'rollup.codes', icon: '🧑‍💻' }
  ]

  return (
    <div className="preview-container">
      <h1>{project.name}</h1>

      {project.badges && (
        <div className="badges-section">
          <h2>Badges</h2>
          <ul>
            {project.badges.map(badge => (
              <li key={badge}>
                <img src={`https://l2beat.com/images/badges/${badge}.png`} alt={badge} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="links-section">
        {linkCategories.map(({ key, label, icon }) => {
          const links = display.links[key as keyof typeof display.links]
          if (!links) return null

          return (
            <div key={key} className="link-category">
              <span className="icon">{icon}</span>
              <span className="label">{label}</span>
              {Array.isArray(links) ? (
                <ul>
                  {links.map(link => (
                    <li key={link}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {new URL(link).hostname}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <a href={links} target="_blank" rel="noopener noreferrer">
                  {new URL(links).hostname}
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

}
