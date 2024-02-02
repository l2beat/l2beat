import React from 'react'

import { GovernancePublicationEntry } from '../../../pages/governance/getGovernancePublicationEntry'
import { Button } from '../../Button'
import { Link } from '../../Link'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  publications: GovernancePublicationEntry[]
  className?: string
}

export function RecentPublicationsSection({ publications, className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull className={className}>
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
    <Button
      as="a"
      className={className}
      variant="purple"
      size="sm"
      href="https://medium.com/l2beat"
    >
      Explore all publications
    </Button>
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
