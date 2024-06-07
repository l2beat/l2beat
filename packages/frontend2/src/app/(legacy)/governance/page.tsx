import { chunk } from 'lodash'
import { type Metadata } from 'next'
import Image from 'next/image'
import React from 'react'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { CustomLink } from '~/app/_components/custom-link'
import { FullPageHeader } from '~/app/_components/full-page-header'
import { getCollection } from '~/content/getCollection'
import OutLinkIcon from '~/icons/outlink.svg'
import { GovernanceHeaderIllustration } from './_assets/governance-header'
import { GovernanceEventsSection } from './_components/sections/governance-events-section'
import { OfficeHoursSection } from './_components/sections/office-hours-section'
import { OurApproachSection } from './_components/sections/our-approach-section'
import { OurMissionSection } from './_components/sections/our-mission-section'
import { RecentPublicationsSection } from './_components/sections/recent-publications-section'
import { getGovernanceEventEntries } from './_utils/get-governance-event-entries'
import { getGovernancePublicationEntry } from './_utils/get-governance-publication-entry'

export const metadata: Metadata = {
  title: 'Governance - L2BEAT',
  description:
    'Discover everything about the L2BEAT Governance Team, including the latest insights, analyses, and updates',
  openGraph: {
    url: '/governance',
  },
}

export default function Page() {
  const publications = getCollection('publications')
    .sort((a, b) => b.data.publishedOn.getTime() - a.data.publishedOn.getTime())
    .slice(0, 4)
  const publicationEntries = publications.map(getGovernancePublicationEntry)

  const events = getCollection('events')
  const eventEntries = getGovernanceEventEntries(events).slice(0, 8)

  return (
    <>
      <Header />
      <ContentWrapper className="md:px-6 lg:px-12" as="main">
        <div className="grid md:mt-20 md:gap-6 lg:grid-cols-8 lg:gap-8 [&>*:nth-child(odd)]:bg-transparent md:[&>*:nth-child(odd)]:bg-gray-100 md:[&>*:nth-child(odd)]:dark:dark:bg-zinc-900">
          <RecentPublicationsSection
            publications={publicationEntries}
            className="lg:col-span-5"
          />
          <OfficeHoursSection className="lg:col-span-3" />
          <GovernanceEventsSection
            events={eventEntries}
            className="lg:col-span-full"
          />
          <OurApproachSection className="lg:col-span-4" />
          <OurMissionSection className="lg:col-span-4" />
        </div>
      </ContentWrapper>
    </>
  )
}

function Header() {
  const delegatedProjects = getCollection('delegatedProjects')
  const chunkedProjects = chunk(delegatedProjects, 3)

  return (
    <FullPageHeader>
      <div className="flex justify-between w-full gap-10">
        <div className="leading-normal lg:max-w-[585px]">
          <h1 className="text-5xl font-bold md:text-6xl">Governance</h1>
          <p className="mt-6 text-lg md:text-base">
            By delegating your governance votes to L2BEAT, you&apos;re
            supporting our mission to protect the interests of the Ethereum
            community and uphold our shared values. Together, we can lead the L2
            ecosystem towards a safer, more secure decentralized future.
          </p>

          <div className="mt-6">
            <span className="text-sm text-purple-100 dark:text-pink-200">
              DELEGATE YOUR TOKENS
            </span>
            {chunkedProjects.map((projects, i) => {
              return (
                <div
                  className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap"
                  key={i}
                >
                  {projects.map((delegatedProject) => (
                    <CustomLink
                      key={delegatedProject.id}
                      className="flex items-center text-sm font-medium justify-center gap-1.5 rounded-lg border border-gray-400 bg-gray-100 py-3 transition-colors hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-900 md:px-3 md:py-1 w-full md:w-max"
                      href={delegatedProject.data.delegateTokensUrl}
                      underline={false}
                    >
                      <Image
                        alt={`Logo of ${delegatedProject.data.name}`}
                        width={20}
                        height={20}
                        src={`/icons/${delegatedProject.id}.png`}
                      />
                      {delegatedProject.data.name}
                      <OutLinkIcon className="fill-current" />
                    </CustomLink>
                  ))}
                </div>
              )
            })}
          </div>
          <p className="mt-6 text-xs md:text-sm">
            If you’d like to see us act as a delegate in another protocol,
            please let us know and we’ll see what we can do.
          </p>
        </div>
        <GovernanceHeaderIllustration className="hidden size-full min-w-[500px] lg:block" />
      </div>
    </FullPageHeader>
  )
}
