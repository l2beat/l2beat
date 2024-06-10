import React from 'react'

import { Article } from '../../../../components/Article'
import { FullPageHeader } from '../../../../components/FullPageHeader'
import { PageContent } from '../../../../components/PageContent'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { GovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'

export interface GovernancePublicationPageProps {
  publication: GovernancePublicationEntry
}

export function GovernancePublicationPage(
  props: GovernancePublicationPageProps,
) {
  return (
    <DashboardLayout>
      <Header publication={props.publication} />
      <PageContent type="article" className="mt-12 lg:mt-20 md:mt-16">
        {props.publication.description && (
          <p className="mb-12 font-light font-roboto-serif text-xl leading-[1.6] opacity-80">
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
    </DashboardLayout>
  )
}

function Header({ publication }: { publication: GovernancePublicationEntry }) {
  return (
    <FullPageHeader pageContentClassName="flex-col items-start gap-6">
      <p className="font-semibold text-2xs text-purple-100 uppercase dark:text-pink-200">
        {publication.readTimeInMinutes} min read • Published on{' '}
        {publication.publishedOn}
      </p>
      <h1 className="font-bold text-2xl lg:text-[44px] md:text-3xl lg:leading-[1.2]">
        {publication.title}
      </h1>
      <div>
        <div className="flex items-center justify-center">
          <img
            src={`/images/avatars/${publication.author.id}.png`}
            className="mr-2 size-10 rounded-full"
          />
          <div>
            <p className="font-bold text-lg leading-none">
              {publication.author.firstName} {publication.author.lastName}
            </p>
            <p className="font-medium text-2xs text-zinc-500 dark:text-gray-50">
              {publication.author.role}
            </p>
          </div>
        </div>
      </div>
    </FullPageHeader>
  )
}
