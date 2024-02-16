import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Article } from '../../../../components/Article'
import { FullPageHeader } from '../../../../components/FullPageHeader'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'

export interface GovernancePublicationPageProps {
  publication: GovernancePublicationEntry
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePublicationPage(
  props: GovernancePublicationPageProps,
) {
  return (
    <>
      <Navbar {...props.navbar} />
      <Header publication={props.publication} />
      <PageContent type="article" className="mt-12 md:mt-16 lg:mt-20">
        {props.publication.description && (
          <p className="mb-12 font-roboto-serif text-xl font-normal opacity-80">
            {props.publication.description}
          </p>
        )}
        <img
          src={`/meta-images/governance/publications/${props.publication.id}.png`}
          alt={`${props.publication.title} publication thumbnail`}
          className="mb-12 w-full rounded-lg"
        />
        <Article>{props.publication.content}</Article>
      </PageContent>
      <Footer {...props.footer} className="mt-0 md:mt-20" />
    </>
  )
}

function Header({ publication }: { publication: GovernancePublicationEntry }) {
  return (
    <FullPageHeader pageContentClassName="flex-col items-start gap-6">
      <p className="text-2xs font-semibold uppercase text-purple-100 dark:text-pink-200">
        {publication.readTimeInMinutes} min read
      </p>
      <h1 className="text-2xl font-bold md:text-3xl lg:text-[44px] lg:leading-[1.2]">
        {publication.title}
      </h1>
      <div>
        <div className="flex items-center justify-center">
          <img
            src={`/avatars/${publication.author.id}.png`}
            className="mr-2 size-10 rounded-full"
          />
          <div>
            <p className="text-lg font-bold leading-none">
              {publication.author.firstName} {publication.author.lastName}
            </p>
            <p className="text-2xs font-medium text-zinc-500 dark:text-gray-50">
              {publication.author.role}
            </p>
          </div>
        </div>
      </div>
    </FullPageHeader>
  )
}
