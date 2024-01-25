import React from 'react'

import { GovernancePublicationEntry } from '../../../pages/governance/getGovernancePublicationEntry'
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
    <GovernanceCard as="section" className={className}>
      <div className="flex flex-wrap justify-between">
        <GovernanceCardHeader title="Recent publications" />
        {showExploreAll && (
          <a
            className="inline-flex items-center justify-center rounded-md border border-pink-900 px-6 py-2 text-xs"
            href="/governance/publications"
          >
            Explore all publications
          </a>
        )}
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {publicationsToShow.map((publication) => (
          <Publication publication={publication} key={publication.id} />
        ))}
      </div>
    </GovernanceCard>
  )
}

interface PublicationProps {
  publication: GovernancePublicationEntry
}

function Publication({ publication }: PublicationProps) {
  return (
    <div className="flex gap-6">
      <img
        className="aspect-video h-[98px] rounded-md"
        src="/images/thumbnails/lifi-01.jpg"
      />
      <div className="flex flex-col justify-center">
        <p>{publication.title}</p>
        <Link className="text-sm" showArrow>
          Learn more
        </Link>
      </div>
    </div>
  )
}
