import React from 'react'

import { FullPageHeader } from '../../../../components/FullPageHeader'
import { LinkWithThumbnail } from '../../../../components/LinkWithThumbnail'
import { PageContent } from '../../../../components/PageContent'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { GovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'

export interface GovernancePublicationsPageProps {
  publications: GovernancePublicationEntry[]
}

export function GovernancePublicationsPage(
  props: GovernancePublicationsPageProps,
) {
  return (
    <DashboardLayout>
      <Header />
      <PageContent>
        <h1 className="mt-20 font-bold text-3xl">
          All governance publications
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
          {props.publications.map((publication) => (
            <PublicationCard publication={publication} key={publication.id} />
          ))}
        </div>
      </PageContent>
    </DashboardLayout>
  )
}

function PublicationCard({
  publication,
}: {
  publication: GovernancePublicationEntry
}) {
  return (
    <LinkWithThumbnail
      href={`/governance/publications/${publication.id}`}
      src={`/meta-images/governance/publications/${publication.id}.png`}
      title={publication.shortTitle ?? publication.title}
      topAccessory={
        <p className="font-semibold text-2xs text-purple-100 uppercase dark:text-pink-200">
          {publication.readTimeInMinutes} min read • Published on{' '}
          {publication.publishedOn}
        </p>
      }
      description={publication.description ?? publication.excerpt}
      orientation="vertical"
      className="justify-self-center"
    />
  )
}

function Header() {
  return (
    <FullPageHeader pageContentClassName="flex-col md:text-center md:items-center items-start">
      <h1 className="mb-6 font-bold text-5xl">Governance publications</h1>
      <p className="text-xl">
        Explore the L2BEAT Governance publications, and discover the latest
        insights, analyses, and updates on Layer 2 project governance, curated
        by our L2BEAT Governance Team. Empower your blockchain decisions with
        our focused research and discussions on decentralized governance.
      </p>
    </FullPageHeader>
  )
}
