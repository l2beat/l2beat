import React from 'react'

import { GovernancePublicationEntry } from '../../../pages/governance/getGovernancePublicationEntry'
import { cn } from '../../../utils/cn'
import { Link } from '../../Link'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  publications: GovernancePublicationEntry[]
  className?: string
}

const RECENT_PUBLICATIONS_COUNT = 4

export function RecentPublicationsSection({ publications, className }: Props) {
  const showExploreAll = publications.length > RECENT_PUBLICATIONS_COUNT
  const publicationsToShow = publications.slice(0, RECENT_PUBLICATIONS_COUNT)
  return (
    <GovernanceCard as="section" mobileFull className={className}>
      <div className="flex flex-wrap justify-between gap-2">
        <GovernanceCardHeader>Recent publications</GovernanceCardHeader>
        {showExploreAll && <ExploreAllButton className="hidden md:block" />}
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {publicationsToShow.map((publication) => (
          <Publication publication={publication} key={publication.id} />
        ))}
      </div>
      {showExploreAll && <ExploreAllButton className="mt-6 w-full md:hidden" />}
    </GovernanceCard>
  )
}

function ExploreAllButton({ className }: { className?: string }) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-pink-900 px-6 py-2 text-xs',
        className,
      )}
      href="/governance/publications"
    >
      Explore all publications
    </a>
  )
}

interface PublicationProps {
  publication: GovernancePublicationEntry
}

function Publication({ publication }: PublicationProps) {
  return (
    <a
      className="group/publication flex gap-6 rounded-md hover:bg-gray-400 dark:hover:bg-gray-900"
      href={publication.link}
    >
      <img
        className="aspect-video h-[98px] rounded-md"
        src="/images/thumbnails/lifi-01.jpg"
      />
      <div className="flex flex-col justify-center">
        <p>{publication.title}</p>
        <Link as="div" className="text-sm" showArrow>
          Learn more
        </Link>
      </div>
    </a>
  )
}
