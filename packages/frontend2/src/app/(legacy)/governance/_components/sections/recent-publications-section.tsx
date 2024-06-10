import React from 'react'

import { Button } from '~/app/_components/button'
import { LinkWithThumbnail } from '~/app/_components/link-with-thumbnail'
import { getOpenGraphImageUrl } from '~/app/api/og-image/_utils/get-open-graph-image-url'
import { type GovernancePublicationEntry } from '../../_utils/get-governance-publication-entry'
import { GovernanceCard, GovernanceCardHeader } from '../governance-card'

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
      className={className}
      as="a"
      href="/governance/publications"
      variant="purple"
      size="sm"
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
    <LinkWithThumbnail
      src={getOpenGraphImageUrl({
        type: 'governance',
        title: publication.title,
      })}
      href={`/governance/publications/${publication.id}`}
      topAccessory={
        <p className="text-2xs font-semibold uppercase text-purple-100 dark:text-pink-200">
          {publication.publishedOn}
        </p>
      }
      title={publication.shortTitle ?? publication.title}
      description={publication.description ?? publication.excerpt}
    />
  )
}
