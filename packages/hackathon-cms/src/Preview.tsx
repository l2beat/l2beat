import type { BaseProject } from './BaseProject'

interface PreviewProps {
  project: BaseProject
}

export function Preview({project}: PreviewProps) {
  return <div>
    Preview:
    <h1>{ project.id }</h1>
    {project.badges && (
      <div>
        <h2>Badges</h2>
        <ul>
          {project.badges.map(badge => (
            <li key={badge}><img src={`https://l2beat.com/images/badges/${badge}.png`}></img></li>
          ))}
        </ul>
      </div>
    )}
    <div>Badges</div>
    <div>About</div>


    {/* {JSON.stringify(project)} */}
  </div>
}
