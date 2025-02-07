import type { BaseProject, ProjectLinks } from './BaseProject';

interface PreviewProps {
  project: BaseProject;
}

// Helper function that safely returns the hostname from a URL.
// If constructing a URL fails (or the link is empty), it returns the original string.
function getHostname(link: string): string {
  if (!link || link.trim() === "") return "";
  try {
    return new URL(link).hostname;
  } catch {
    return link;
  }
}

export function Preview({ project }: PreviewProps) {
  // Define the link categories and corresponding icons.
  const linkCategories: {
    key: keyof ProjectLinks;
    label: string;
    icon: string;
  }[] = [
    { key: 'websites', label: 'Website', icon: '🌍' },
    { key: 'apps', label: 'App', icon: '📱' },
    { key: 'documentation', label: 'Docs', icon: '📖' },
    { key: 'explorers', label: 'Explorer', icon: '🔍' },
    { key: 'repositories', label: 'Repository', icon: '💻' },
    { key: 'socialMedia', label: 'Social', icon: '📢' },
    { key: 'rollupCodes', label: 'rollup.codes', icon: '🧑‍💻' },
  ];

  return (
    <div className="preview-container">
      {/* Project Header */}
      <h1 className="project-title">{project.name}</h1>

      {/* Links Section */}
      {project.display && (
        <div className="links-section">
          {linkCategories.map(({ key, label, icon }) => {
            const links = project.display?.links[key];
            if (!links) return null;

            // Handle array-based link fields.
            if (Array.isArray(links)) {
              const validLinks = links.filter(link => link.trim() !== "");
              if (validLinks.length === 0) return null;
              return (
                <div key={key} className="link-category">
                  <span className="icon">{icon}</span>
                  <span className="label">{label}</span>
                  <ul>
                    {validLinks.map((link, index) => (
                      <li key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {getHostname(link)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            } else {
              // Handle single-string link fields.
              if (links.trim() === "") return null;
              return (
                <div key={key} className="link-category">
                  <span className="icon">{icon}</span>
                  <span className="label">{label}</span>
                  <a href={links} target="_blank" rel="noopener noreferrer">
                    {getHostname(links)}
                  </a>
                </div>
              );
            }
          })}
        </div>
      )}

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

      {/* About Section */}
      {project.display?.description && (
        <div id="about-section" className="mb-8">
          <h2 className="mb-4 text-xl font-bold">About</h2>
          <p>{project.display.description}</p>
        </div>
      )}

      {/* Milestones Section */}
      {project.milestones && (
        <div id="milestones-section" className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Milestones & Incidents</h2>
          <ul>
            {project.milestones.map(milestone => (
              <li key={milestone.title}>
                <b>{milestone.title}</b>
                <br />
                {milestone.date}
                <br />
                {milestone.description}
                <br />
                <a href={milestone.url}>Read more</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contracts Section */}
      {project.contracts && (
        <div id="contracts-section" className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Contracts</h2>
          <ul>
            {project.contracts.map(contract => (
              <li key={contract.address} className="mb-4">
                <b>{contract.name}</b>: {contract.address} <br />
                {contract.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
