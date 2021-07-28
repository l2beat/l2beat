import { ProjectLinks } from '@l2beat/config'
import { OverviewLinks } from './OverviewLinks'
import { Section } from './Section'

interface Props {
  links: ProjectLinks
}

export function OverviewSection({ links }: Props) {
  return (
    <Section title="Project overview">
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
