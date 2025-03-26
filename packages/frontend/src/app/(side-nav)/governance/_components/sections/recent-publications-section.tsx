import Link from 'next/link'
import { Button } from '~/components/core/button'
import { LinkWithThumbnail } from '~/components/link-with-thumbnail'
import type { GovernancePublicationEntry } from '../../_utils/get-governance-publication-entry'
import { GovernanceCard, GovernanceCardHeader } from '../governance-card'

interface Props {
  publications: GovernancePublicationEntry[]
  className?: string
}

export function RecentPublicationsSection({ publications, className }: Props) {
  return (
    <GovernanceCard mobileFull className={className}>
      <div className="flex flex-wrap justify-between gap-2">
        <GovernanceCardHeader>Recent publications</GovernanceCardHeader>
        <ExploreAllButton className="hidden md:block" />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {publications.map((publication) => (
          <Publication publication={publication} key={publication.id} />
        ))}
      </div>
      <ExploreAllButton className="mt-6 w-full md:hidden" />
    </GovernanceCard>
  )
}

function ExploreAllButton({ className }: { className?: string }) {
  return (
    <Button className={className} variant="outline" size="sm" asChild>
      <Link href="/governance/publications">Explore all publications</Link>
    </Button>
  )
}

interface PublicationProps {
  publication: GovernancePublicationEntry
}

function Publication({ publication }: PublicationProps) {
  return (
    <LinkWithThumbnail
      src={`/meta-images/governance/publications/${publication.id}.png`}
      href={`/governance/publications/${publication.id}`}
      topAccessory={
        <p className="text-2xs font-medium uppercase text-purple-100 dark:text-pink-200">
          {publication.publishedOn}
        </p>
      }
      title={publication.shortTitle ?? publication.title}
      description={publication.description ?? publication.excerpt}
    />
  )
}
