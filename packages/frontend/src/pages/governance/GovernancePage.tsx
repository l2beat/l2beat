import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { CollectionEntry } from '~/content/getCollection'
import { CustomLinkIcon } from '~/icons/Outlink'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GovernanceEventEntry } from '~/pages/governance/utils/getGovernanceEventEntries'
import type { GovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import { GovernanceHeaderIllustration } from './assets/GovernanceHeader'
import { GovernanceEventsSection } from './components/sections/GovernanceEventsSection'
import { OfficeHoursSection } from './components/sections/OfficeHoursSection'
import { OurApproachSection } from './components/sections/OurApproachSection'
import { OurMissionSection } from './components/sections/OurMissionSection'
import { RecentPublicationsSection } from './components/sections/RecentPublicationsSection'

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

interface DelegatedProjectWithIcon
  extends CollectionEntry<'delegated-projects'> {
  icon: string
}

function Header({
  delegatedProjects,
}: {
  delegatedProjects: DelegatedProjectWithIcon[]
}) {
  return (
    <PrimaryCard className="md:p-8">
      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex flex-col gap-6">
          <p className="text-paragraph-18">
            By delegating your governance votes to L2BEAT, you&apos;re
            supporting our mission to protect the interests of the Ethereum
            community and uphold our shared values. Together, we can lead the L2
            ecosystem towards a safer, more secure decentralized future.
          </p>
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-purple-100 text-xs uppercase tracking-[-0.14px] dark:text-pink-200">
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
          <p className="text-paragraph-15">
            If you&apos;d like to see us act as a delegate in another protocol,
            please let us know and we&apos;ll see what we can do.
          </p>
        </div>
        <GovernanceHeaderIllustration className="hidden h-full min-w-[434px] lg:block" />
      </div>
    </PrimaryCard>
  )
}
