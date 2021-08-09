import { ShieldWarnIcon } from '../../../common/icons'
import { OverviewProps } from '../props/getOverviewProps'
import { OverviewLinks } from './OverviewLinks'
import { Section } from './Section'

export function OverviewSection(props: OverviewProps) {
  return (
    <Section
      title="Project overview"
      editLink={props.editLink}
      issueLink={props.issueLink}
    >
      <div className="OverviewSection">
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
            <OverviewLinks
              name="Source code"
              links={props.links.repositories}
            />
          </tbody>
        </table>
      </div>
    </Section>
  )
}
