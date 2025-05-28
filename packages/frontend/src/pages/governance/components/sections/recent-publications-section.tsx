import { Button } from '~/components/core/button'
import { LinkWithThumbnail } from '~/components/link-with-thumbnail'
import type { GovernancePublicationEntry } from '../../utils/get-governance-publication-entry'
import { GovernanceCard } from '../governance-card'

interface Props {
  publications: GovernancePublicationEntry[]
  className?: string
}

export function RecentPublicationsSection({ publications }: Props) {
  return (
    <GovernanceCard mobileFull className="flex flex-col gap-4 lg:col-span-5">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="heading-24 md:heading-32">Recent publications</div>
        <ExploreAllButton className="hidden md:block" />
      </div>
      <div className="flex flex-col gap-4">
        {publications.map((publication) => (
          <Publication publication={publication} key={publication.id} />
        ))}
      </div>
      <ExploreAllButton className="w-full md:hidden" />
    </GovernanceCard>
  )
}

function ExploreAllButton({ className }: { className?: string }) {
  return (
    <Button className={className} variant="outline" size="sm" asChild>
      <a href="/governance/publications">Explore all publications</a>
    </Button>
  )
}

interface PublicationProps {
  publication: GovernancePublicationEntry
}

function Publication({ publication }: PublicationProps) {
  return (
    <LinkWithThumbnail
      {...publication.thumbnail}
      href={`/governance/publications/${publication.id}`}
      topAccessory={
        <p className="subtitle-11 text-brand">{publication.publishedOn}</p>
      }
      title={publication.shortTitle ?? publication.title}
      description={publication.description ?? publication.excerpt}
    />
  )
}
