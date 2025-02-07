import type { BaseProject, ProjectLinks } from './BaseProject'

interface PreviewProps {
  project: BaseProject
}

export function Preview({ project }: PreviewProps) {

  // Define categories and icons
  const linkCategories: {
    key: keyof ProjectLinks,
    label: string,
    icon: string
  }[] = [
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
      {/* Project Header */}
      <h1 className="project-title">{project.name}</h1>

      {/* Links Section */}
      {project.display && (
      <div className="links-section">
        {linkCategories.map(({ key, label, icon }) => {
          const links = project.display?.links[key]
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
      )}

      {/* TVS Section (Placeholder Values) */}
      {/* <div className="tvs-section">
        <h2>TVS</h2>
        <p><strong>$13.57B</strong> <span className="tvs-change">-13.9%</span></p>
        <ul>
          <li>Canonical: <strong>$4.69B</strong> (35%)</li>
          <li>External: <strong>$2.44B</strong> (18%)</li>
          <li>Native: <strong>$6.43B</strong> (47%)</li>
        </ul>
      </div> */}

      {/* Badges Section */}
      {project.badges && (
        <div id="badges-section" className="mb-8">
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

      {/* Data Visualization Section (Placeholder Values) */}
      {/* <div className="data-section">
        <div className="tokens">
          <h3>Tokens</h3>
          <p>Past day UOPS: <strong>22.56</strong> <span className="positive">+24.8%</span></p>
          <p>30D ops count: <strong>61.22M</strong></p>
        </div>
        <div className="rollup-type">
          <h3>Type</h3>
          <p>Optimistic Rollup</p>
        </div>
        <div className="purpose">
          <h3>Purpose</h3>
          <p>Universal</p>
        </div>
      </div> */}

      {/* About Section */}
      {project.display?.description && (
        <div id="about-section" className="mb-8">
          <h2 className='mb-4 text-xl font-bold'>About</h2><br/>
          <p>{project.display.description}</p>
        </div>
      )}

      {/* Contracts */}
      {project.contracts && (
        <div id="contracts-section" className="mb-8">
          <h2 className='mb-4 text-xl font-bold' >Contracts</h2>
          <ul>
            {project.contracts.map(contract => (
              <li key={contract.address} className='mb-4'>
                <b>{contract.name}</b>: {contract.address} <br/>
                {contract.description}
              </li>
            ))}
          </ul>
        </div>
      )}


    </div>
  )
}
