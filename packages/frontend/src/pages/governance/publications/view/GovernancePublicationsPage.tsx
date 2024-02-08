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
      <PageContent type="wider">
        <h1 className="mt-20 text-3xl font-bold">
          All governance publications
        </h1>
        <div className="mt-8 grid grid-cols-3 gap-8">
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
      src={`/images/thumbnails/${publication.id}.png`}
      title={publication.title}
      description={publication.description}
      orientation="vertical"
    />
  )
}

function Header(props: { publication: GovernancePublicationEntry }) {
  return (
    <FullPageHeader>
      <div className="grid grid-cols-2 gap-24">
        <div className="self-center">
          <h1 className="text-4xl">{props.publication.title}</h1>
          <p className="mt-6 text-sm text-gray-50">
            {props.publication.description}
          </p>
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
          className="rounded-lg"
        />
      </div>
    </FullPageHeader>
  )
}
