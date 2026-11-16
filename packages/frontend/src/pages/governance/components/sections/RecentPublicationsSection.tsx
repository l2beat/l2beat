import { Button } from '~/components/core/Button'
import { LinkWithThumbnail } from '~/components/LinkWithThumbnail'
import { getFilterSearchParams } from '~/components/table/filters/utils/getFilterSearchParams'
import type { GovernancePublicationEntry } from '../../../publications/governance/utils/getGovernancePublicationEntry'
import { GovernanceCard } from '../GovernanceCard'

interface Props {
  publications: GovernancePublicationEntry[]
  className?: string
}

export function RecentPublicationsSection({ publications }: Props) {
  return (
    <GovernanceCard mobileFull className="flex flex-col gap-4 lg:col-span-5">
      <div className="flex flex-wrap justify-between gap-2">
        <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
          Recent publications
        </h2>
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
  const filters = getFilterSearchParams({
    contentCategory: {
      values: ['Governance'],
    },
  })
  return (
    <Button className={className} variant="outline" size="sm" asChild>
      <a href={`/publications?tab=updates&filters=${filters}`}>
        Explore all publications
      </a>
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
      href={`/publications/${publication.id}`}
      topAccessory={
        <p className="text-brand-deep text-label-value-13">
          {publication.publishedOn}
        </p>
      }
      title={publication.shortTitle ?? publication.title}
      description={publication.description ?? publication.excerpt}
    />
  )
}
