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
    <div className="p-6 space-y-6 bg-gray-900 text-gray-300 rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* Project Header */}
      <h1 className="text-3xl font-bold text-purple-400 uppercase text-center">
        {project.name}
      </h1>

      {/* Basic Info Section */}
      {project.name && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-purple-400 mb-2">Basic Info</h2>
          <p className="mb-1">
            <strong>Name:</strong> {project.name}
          </p>
          <p className="mb-1">
            <strong>Slug:</strong> {project.slug}
          </p>
        </div>
      )}

      {/* Badges Section */}
      {project.badges && project.badges.length > 0 && (
        <div id="badges-section" className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-purple-400 mb-2">Badges</h2>
            <div className="flex flex-wrap gap-2">
              {project.badges.map((badge) => (
                <img
                  key={badge}
                  src={`https://l2beat.com/images/badges/${badge}.png`}
                  alt={badge}
                  className="h-10"
                />
              ))}
            </div>
        </div>
      )}

      {/* Links Section */}
      {project.display && project.display.links && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md" id="links-section">
          <h2 className="text-xl font-bold text-purple-400 mb-2">Links</h2>
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
            const links = project.display?.links[key];
            if (!links) return null;
            const validLinks = links.filter(link => link.trim() !== "");
            if (validLinks.length === 0) return null;
            return (
              <div key={key} className="mb-4">
                <h3 className="font-bold text-purple-300 capitalize mb-1">{key}</h3>
                <div className="flex flex-wrap gap-2">
                  {validLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-400 hover:text-blue-300"
                    >
                      {getHostname(link)}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Milestones & Incidents Section */}
      {project.milestones && (
        <div id="milestones-section" className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-purple-400 mb-2">Milestones & Incidents</h2>
          {project.milestones && project.milestones.length > 0 ? (
            <ul className="space-y-4">
              {project.milestones.map((milestone) => {
                // Set classes based on milestone type:
                const milestoneCardClass =
                  milestone.type === "general"
                    ? "bg-green-900 border-green-700"
                    : milestone.type === "incident"
                    ? "bg-red-900 border-red-700"
                    : "";
                const milestoneTitleClass =
                  milestone.type === "general"
                    ? "text-green-400"
                    : milestone.type === "incident"
                    ? "text-red-400"
                    : "text-purple-300";
                return (
                  <li
                    key={milestone.title}
                    className={`p-4 border rounded-lg ${milestoneCardClass}`}
                  >
                    <h3 className={`text-lg font-bold ${milestoneTitleClass}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-400">{milestone.date}</p>
                    <p className="mb-2">{milestone.description}</p>
                    <a
                      href={milestone.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-400 hover:text-blue-300"
                    >
                      Read more
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No milestones added.</p>
          )}
        </div>
      )}

      {/* Technology Section */}
      {project.technology && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-purple-400 mb-2">Technology</h2>
          <p className="mb-1">
            {project.technology}
          </p>
        </div>
      )}

      {/* Discovery / Contracts Section */}
      {project.contracts && (
        <div id="contracts-section" className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-purple-400 mb-2">Contracts</h2>
          <ul className="space-y-4">
            {project.contracts.map((contract) => (
              <li key={contract.address} className="p-4 border border-gray-700 rounded-lg">
                <h3 className="font-bold text-purple-300">{contract.name}</h3>
                <p className="text-sm text-gray-400">{contract.address}</p>
                <p>{contract.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* About Section */}
      {project.display && project.display.description && (
        <div id="about-section" className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-purple-400 mb-2">About</h2>
          <p>{project.display.description}</p>
        </div>
      )}
    </div>
  );
}
