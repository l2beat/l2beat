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
  return (
    <div className="preview-container">
      {/* Project Header */}
      <h1 className="project-title">{project.name}</h1>

      {/* Basic Info Section – assumed always present if added */}
      {project.sections && project.sections.includes("BASIC_INFO") && (
        <div className="basic-info-section mb-8">
          <h2>Basic Info</h2>
          <p>
            <strong>Name:</strong> {project.name}
          </p>
          <p>
            <strong>Slug:</strong> {project.slug}
          </p>
        </div>
      )}

      {/* Badges Section */}
      {project.sections && project.sections.includes("BADGES") && (
        <div id="badges-section" className="mb-8">
          <h2>Badges</h2>
          {project.badges && project.badges.length > 0 ? (
            <ul>
              {project.badges.map((badge) => (
                <li key={badge}>
                  <img src={`https://l2beat.com/images/badges/${badge}.png`} alt={badge} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No badges added.</p>
          )}
        </div>
      )}

      {/* Links Section */}
      {project.sections && project.sections.includes("LINKS") && project.display && project.display.links && (
        <div className="links-section mb-8">
          <h2>Links</h2>
          {(
            [
              "websites",
              "apps",
              "documentation",
              "explorers",
              "repositories",
              "socialMedia",
              "rollupCodes",
            ] as (keyof ProjectLinks)[]
          ).map((key) => {
            const links = project.display.links[key];
            if (!links) return null;
            if (Array.isArray(links)) {
              const validLinks = links.filter((link) => link.trim() !== "");
              if (validLinks.length === 0) return null;
              return (
                <div key={key} className="link-category mb-4">
                  <h3>{key}</h3>
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
              if (links.trim() === "") return null;
              return (
                <div key={key} className="link-category mb-4">
                  <h3>{key}</h3>
                  <a href={links} target="_blank" rel="noopener noreferrer">
                    {getHostname(links)}
                  </a>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Milestones & Incidents Section */}
      {project.sections && project.sections.includes("MILESTONES") && (
        <div id="milestones-section" className="mb-8">
          <h2>Milestones & Incidents</h2>
          {project.milestones && project.milestones.length > 0 ? (
            <ul>
              {project.milestones.map((milestone) => (
                <li key={milestone.title} className="mb-4">
                  <b>{milestone.title}</b>
                  <br />
                  {milestone.date}
                  <br />
                  {milestone.description}
                  <br />
                  <a href={milestone.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No milestones added.</p>
          )}
        </div>
      )}

      {/* Discovery / Contracts Section */}
      {project.sections && project.sections.includes("DISCOVERY") && project.contracts && (
        <div id="contracts-section" className="mb-8">
          <h2>Contracts</h2>
          <ul>
            {project.contracts.map((contract) => (
              <li key={contract.address} className="mb-4">
                <b>{contract.name}</b>: {contract.address}
                <br />
                {contract.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* About Section */}
      {project.display && project.display.description && (
        <div id="about-section" className="mb-8">
          <h2>About</h2>
          <p>{project.display.description}</p>
        </div>
      )}
    </div>
  );
}
