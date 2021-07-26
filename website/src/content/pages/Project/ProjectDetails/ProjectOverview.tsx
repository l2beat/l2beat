import { Project } from '@l2beat/config'
import { OverviewLinks } from './OverviewLinks'

export function ProjectOverview(props: Project['details']['links']) {
  return (
    <div className="ProjectOverview">
      <table>
        <tbody>
          <OverviewLinks name="Website" links={props.websites} />
          <OverviewLinks name="Social media" links={props.socialMedia} social />
          <OverviewLinks name="App" links={props.apps} />
          <OverviewLinks name="Documentation" links={props.documentation} />
          <OverviewLinks name="Explorer" links={props.explorers} />
          <OverviewLinks name="Source code" links={props.repositories} />
        </tbody>
      </table>
    </div>
  )
}
