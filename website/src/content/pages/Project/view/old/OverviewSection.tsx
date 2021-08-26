import { ProjectLinks } from '@l2beat/config'
import { ShieldWarnIcon } from '../../../../common/icons'
import { OverviewLinks } from './OverviewLinks'
import { Section } from '../Section'

export interface OverviewSectionProps {
  links: ProjectLinks
  issueLink: string
  editLink: string
  warning?: string
}

export function OverviewSection(props: OverviewSectionProps) {
  return (
    <Section
      title="Project overview"
      className="OverviewSection"
      id="overview"
      editLink={props.editLink}
      issueLink={props.issueLink}
    >
      {props.warning && (
        <div className="OverviewSection-Warning">
          <ShieldWarnIcon />
          {props.warning}
        </div>
      )}
      <table>
        <tbody>
          <OverviewLinks name="Website" links={props.links.websites} />
          <OverviewLinks
            name="Social media"
            links={props.links.socialMedia}
            social
          />
          <OverviewLinks name="App" links={props.links.apps} />
          <OverviewLinks
            name="Documentation"
            links={props.links.documentation}
          />
          <OverviewLinks name="Explorer" links={props.links.explorers} />
          <OverviewLinks name="Source code" links={props.links.repositories} />
        </tbody>
      </table>
    </Section>
  )
}
