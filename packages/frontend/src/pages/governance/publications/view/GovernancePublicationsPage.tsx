import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Button } from '../../../../components/Button'
import { FullPageHeader } from '../../../../components/FullPageHeader'
import { ArrowRightIcon } from '../../../../components/icons'
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
  const highlightedPublication = props.publications[0]

  return (
    <>
      <Navbar {...props.navbar} />
      <Header publication={highlightedPublication} />
      <PageContent type="subpage">
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
          {publication.readTimeInMinutes} min read
        </p>
      }
      description={publication.description ?? publication.excerpt}
      orientation="vertical"
    />
  )
}

function Header(props: { publication: GovernancePublicationEntry }) {
  return (
    <FullPageHeader pageContentClassName="justify-start">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-24">
        <img
          src={`/meta-images/governance/publications/${props.publication.id}.png`}
          className="rounded-lg md:hidden"
        />
        <div className="self-center">
          <h1 className="line-clamp-2 text-balance text-4xl leading-tight">
            {props.publication.title}
          </h1>
          {<p className="mt-6 line-clamp-5 text-sm text-gray-50">
            {props.publication.description ?? props.publication.excerpt}
          </p>}
          <Button
            as="a"
            href={`/governance/publications/${props.publication.id}`}
            variant="purple"
            className="mt-8"
          >
            Learn more
            <ArrowRightIcon className="ml-2 fill-current" />
          </Button>
        </div>
        <img
          src={`/images/thumbnails/${props.publication.id}.png`}
          className="hidden rounded-lg lg:block"
        />
      </div>
    </FullPageHeader>
  )
}
