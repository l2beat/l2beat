import type { UnixTime } from '@l2beat/shared-pure'
import { MainPageHeader } from '~/components/MainPageHeader'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { UpcomingProjectUpdate } from '~/content/monthly-updates'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { DaMonthlyUpdateEntry } from '~/server/features/monthly-reports/getDaEntries'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import { DaUpdateSection } from './components/da/DaUpdateSection'
import { EcosystemUpdateSection } from './components/ecosystems/EcosystemUpdateSection'
import { UpcomingProjectUpdateSection } from './components/upcoming/UpcomingProjectUpdateSection'

interface Props extends AppLayoutProps {
  publishedOn: string
  title: string
  from: UnixTime
  to: UnixTime
  ecosystemsUpdatesEntries: EcosystemMonthlyUpdateEntry[]
  daUpdatesEntries: DaMonthlyUpdateEntry[]
  upcomingProjectsUpdatesEntries: UpcomingProjectUpdate[]
}

export function MonthlyUpdatePage({
  publishedOn,
  title,
  from,
  to,
  ecosystemsUpdatesEntries,
  daUpdatesEntries,
  upcomingProjectsUpdatesEntries,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Monthly Updates</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <div>
            <p className="subtitle-12 text-brand uppercase">
              Published on {publishedOn}
            </p>
            <h1 className="md:heading-32 heading-24 mt-2">{title}</h1>
          </div>
          <HorizontalSeparator className="my-6 md:my-8" />
          <div className="mx-auto mt-6 max-w-[960px] md:mt-8">
            <div className="mb-6 flex flex-col md:mb-8">
              {[
                ...ecosystemsUpdatesEntries,
                ...daUpdatesEntries,
                ...upcomingProjectsUpdatesEntries,
              ].map((e, i) => (
                <a
                  href={`#${e.name}`}
                  key={`#${e.name}`}
                  className="w-fit font-normal font-roboto-serif text-link text-sm leading-[160%] underline md:text-[17px]"
                >
                  {i + 1}. {e.name}
                </a>
              ))}
            </div>
            {ecosystemsUpdatesEntries.map((ecosystem) => (
              <EcosystemUpdateSection
                key={ecosystem.ecosystemId}
                ecosystem={ecosystem}
                from={from}
                to={to}
              />
            ))}
            {daUpdatesEntries.map((da) => (
              <DaUpdateSection
                key={da.daLayerId}
                daLayer={da}
                from={from}
                to={to}
              />
            ))}
            {upcomingProjectsUpdatesEntries.map((upcomingProject) => (
              <UpcomingProjectUpdateSection
                key={upcomingProject.projectId}
                upcomingProject={upcomingProject}
              />
            ))}
          </div>
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
