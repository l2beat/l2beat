import { OverviewProps } from '../props/getOverviewProps'
import { OverviewLinks } from './OverviewLinks'
import { Section } from './Section'

export function OverviewSection({ links, editLink, issueLink }: OverviewProps) {
  return (
    <Section title="Project overview" editLink={editLink} issueLink={issueLink}>
      <div className="OverviewSection">
        <table>
          <tbody>
            <OverviewLinks name="Website" links={links.websites} />
            <OverviewLinks
              name="Social media"
              links={links.socialMedia}
              social
            />
            <OverviewLinks name="App" links={links.apps} />
            <OverviewLinks name="Documentation" links={links.documentation} />
            <OverviewLinks name="Explorer" links={links.explorers} />
            <OverviewLinks name="Source code" links={links.repositories} />
          </tbody>
        </table>
      </div>
    </Section>
  )
}
