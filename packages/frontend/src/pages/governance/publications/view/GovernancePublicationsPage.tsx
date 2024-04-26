import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { FullPageHeader } from '../../../../components/FullPageHeader'
import { LinkWithThumbnail } from '../../../../components/LinkWithThumbnail'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'

export interface GovernancePublicationsPageProps {
  publications: GovernancePublicationEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePublicationsPage(
  props: GovernancePublicationsPageProps,
) {
  return (
    <>
      <Navbar {...props.navbar} />
      <Header />
      <PageContent>
        <h1 className="mt-20 text-3xl font-bold">
          All governance publications
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {props.publications.map((publication) => (
            <PublicationCard publication={publication} key={publication.id} />
          ))}
        </div>
      </PageContent>
      <Footer {...props.footer} />
    </>
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
        <p className="text-2xs font-semibold uppercase text-purple-100 dark:text-pink-200">
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
      <h1 className="mb-6 text-5xl font-bold">Governance publications</h1>
      <p className="text-xl">
        Explore the L2BEAT Governance publications, and discover the latest
        insights, analyses, and updates on Layer 2 project governance, curated
        by our L2BEAT Governance Team. Empower your blockchain decisions with
        our focused research and discussions on decentralized governance.
      </p>
    </FullPageHeader>
  )
}
