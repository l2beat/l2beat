import React from 'react'

import { GovernancePublicationEntry } from '../../../pages/governance/index/props/getGovernancePublicationEntry'
import { Button } from '../../Button'
import { LinkWithThumbnail } from '../../LinkWithThumbnail'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'
import {
  formatDate,
  formatDateToArticleFormat,
  formatTimestamp,
} from '../../../utils'

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
      src={`/meta-images/governance/publications/${publication.id}.png`}
      href={`/governance/publications/${publication.id}`}
      topAccessory={
        <p className="text-2xs font-semibold uppercase text-purple-100 dark:text-pink-200">
          {formatDateToArticleFormat(publication.publishedOn)}
        </p>
      }
      title={publication.shortTitle ?? publication.title}
      description={publication.description ?? publication.excerpt}
    />
  )
}
