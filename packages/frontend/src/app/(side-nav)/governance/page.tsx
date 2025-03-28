import type { Metadata } from 'next'
import Image from 'next/image'
import { CustomLink } from '~/components/link/custom-link'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { getCollection } from '~/content/get-collection'
import { CustomLinkIcon } from '~/icons/outlink'
import { getDefaultMetadata } from '~/utils/metadata'
import { GovernanceHeaderIllustration } from './_assets/governance-header'
import { GovernanceEventsSection } from './_components/sections/governance-events-section'
import { OfficeHoursSection } from './_components/sections/office-hours-section'
import { OurApproachSection } from './_components/sections/our-approach-section'
import { OurMissionSection } from './_components/sections/our-mission-section'
import { RecentPublicationsSection } from './_components/sections/recent-publications-section'
import { getGovernanceEventEntries } from './_utils/get-governance-event-entries'
import { getGovernancePublicationEntry } from './_utils/get-governance-publication-entry'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Governance - L2BEAT',
  description:
    'Discover everything about the L2BEAT Governance Team, including the latest insights, analyses, and updates',
  openGraph: {
    url: '/governance',
  },
})

export default function Page() {
  const publications = getCollection('publications')
    .sort((a, b) => b.data.publishedOn.getTime() - a.data.publishedOn.getTime())
    .slice(0, 4)
  const publicationEntries = publications.map(getGovernancePublicationEntry)

  const events = getCollection('events')
  const allEventEntries = getGovernanceEventEntries(events)
  const nearestEventIndex = allEventEntries.findIndex(
    (e) => e.startDate > new Date(),
  )
  const eventEntries = allEventEntries.slice(
    nearestEventIndex,
    nearestEventIndex + 8,
  )

  return (
    <>
      <MainPageHeader>Governance</MainPageHeader>
      <Header />
      <main>
        <div className="grid md:mt-6 md:gap-6 lg:grid-cols-8 lg:gap-6 [&>*:nth-child(odd)]:bg-transparent md:[&>*:nth-child(odd)]:bg-surface-primary">
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
      </main>
    </>
  )
}

function Header() {
  const delegatedProjects = getCollection('delegated-projects')

  return (
    <PrimaryCard className="md:p-8">
      <h1 className="mb-4 text-3xl font-bold md:hidden">Governance</h1>
      <div className="flex w-full justify-between gap-5">
        <div className="flex flex-col gap-6">
          <p className="text-lg font-normal leading-[150%]">
            By delegating your governance votes to L2BEAT, you&apos;re
            supporting our mission to protect the interests of the Ethereum
            community and uphold our shared values. Together, we can lead the L2
            ecosystem towards a safer, more secure decentralized future.
          </p>
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-medium uppercase tracking-[-0.14px] text-purple-100 dark:text-pink-200">
              Delegate your tokens
            </span>
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
              {delegatedProjects.map((delegatedProject) => (
                <CustomLink
                  key={delegatedProject.id}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-400 bg-surface-secondary p-2 text-xs tracking-[-0.14px] md:w-fit"
                  href={delegatedProject.data.delegateTokensUrl}
                  underline={false}
                >
                  <Image
                    alt={`Logo of ${delegatedProject.data.name}`}
                    width={20}
                    height={20}
                    src={`/icons/${delegatedProject.data.slug}.png`}
                  />
                  {delegatedProject.data.name}
                  <CustomLinkIcon className="fill-current" />
                </CustomLink>
              ))}
            </div>
          </div>
          <p className="text-sm font-normal leading-[150%]">
            If you&apos;d like to see us act as a delegate in another protocol,
            please let us know and we&apos;ll see what we can do.
          </p>
        </div>
        <GovernanceHeaderIllustration className="hidden h-full min-w-[434px] lg:block" />
      </div>
    </PrimaryCard>
  )
}
