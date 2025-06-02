import { CustomLink } from '~/components/link/custom-link'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import type { CollectionEntry } from '~/content/get-collection'
import { CustomLinkIcon } from '~/icons/outlink'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'
import type { GovernanceEventEntry } from '~/pages/governance/utils/get-governance-event-entries'
import type { GovernancePublicationEntry } from '~/pages/governance/utils/get-governance-publication-entry'
import { GovernanceHeaderIllustration } from './assets/governance-header'
import { GovernanceEventsSection } from './components/sections/governance-events-section'
import { OfficeHoursSection } from './components/sections/office-hours-section'
import { OurApproachSection } from './components/sections/our-approach-section'
import { OurMissionSection } from './components/sections/our-mission-section'
import { RecentPublicationsSection } from './components/sections/recent-publications-section'

interface Props extends AppLayoutProps {
  publications: GovernancePublicationEntry[]
  events: GovernanceEventEntry[]
  delegatedProjects: DelegatedProjectWithIcon[]
}

export function GovernancePage({
  publications,
  events,
  delegatedProjects,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Governance</MainPageHeader>
        <Header delegatedProjects={delegatedProjects} />
        <main>
          <div className="grid md:mt-6 md:gap-6 lg:grid-cols-8 lg:gap-6 [&>*:nth-child(odd)]:bg-transparent md:[&>*:nth-child(odd)]:bg-surface-primary">
            <RecentPublicationsSection publications={publications} />
            <OfficeHoursSection />
            <GovernanceEventsSection
              events={events}
              className="lg:col-span-full"
            />
            <OurApproachSection className="lg:col-span-4" />
            <OurMissionSection className="lg:col-span-4" />
          </div>
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}

export interface DelegatedProjectWithIcon
  extends CollectionEntry<'delegated-projects'> {
  icon: string
}

function Header({
  delegatedProjects,
}: { delegatedProjects: DelegatedProjectWithIcon[] }) {
  return (
    <PrimaryCard className="md:p-8">
      <h1 className="mb-4 text-3xl font-bold md:hidden">Governance</h1>
      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex flex-col gap-6">
          <p className="paragraph-18">
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
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-divider bg-surface-secondary p-2 text-xs tracking-[-0.14px] md:w-fit"
                  href={delegatedProject.data.delegateTokensUrl}
                  underline={false}
                >
                  <img
                    alt={`Logo of ${delegatedProject.data.name}`}
                    width={20}
                    height={20}
                    src={delegatedProject.icon}
                  />
                  {delegatedProject.data.name}
                  <CustomLinkIcon className="fill-current" />
                </CustomLink>
              ))}
            </div>
          </div>
          <p className="paragraph-15">
            If you&apos;d like to see us act as a delegate in another protocol,
            please let us know and we&apos;ll see what we can do.
          </p>
        </div>
        <GovernanceHeaderIllustration className="hidden h-full min-w-[434px] lg:block" />
      </div>
    </PrimaryCard>
  )
}
