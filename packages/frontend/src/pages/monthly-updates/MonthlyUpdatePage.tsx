import type { UnixTime } from '@l2beat/shared-pure'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { DaMonthlyUpdateEntry } from '~/server/features/monthly-reports/getDaEntries'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import type { UpcomingProjectUpdateEntry } from '~/server/features/monthly-reports/getUpcomingEntries'
import { DaUpdateSection } from './components/da/DaUpdateSection'
import { EcosystemUpdateSection } from './components/ecosystems/EcosystemUpdateSection'
import { UpcomingProjectUpdateSection } from './components/upcoming/UpcomingProjectUpdateSection'

interface Props extends AppLayoutProps {
  entry: {
    publishedOn: string
    title: string
    from: UnixTime
    to: UnixTime
    ecosystemsUpdatesEntries: EcosystemMonthlyUpdateEntry[]
    daUpdatesEntries: DaMonthlyUpdateEntry[]
    upcomingProjectsUpdatesEntries: UpcomingProjectUpdateEntry[]
  }
}

export function MonthlyUpdatePage({ entry, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Monthly Updates</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <div>
            <p className="text-brand text-subtitle-12 uppercase">
              Published on {entry.publishedOn}
            </p>
            <h1 className="mt-2 text-heading-24 md:text-heading-32">
              {entry.title}
            </h1>
          </div>
          <HorizontalSeparator className="my-6 md:my-8" />
          <div className="mx-auto mt-6 max-w-[960px] md:mt-8">
            <div className="mb-6 flex flex-col md:mb-8">
              {[
                ...entry.ecosystemsUpdatesEntries,
                ...entry.daUpdatesEntries,
                ...entry.upcomingProjectsUpdatesEntries,
              ].map((e, i) => (
                <a
                  href={`#${e.id}`}
                  key={e.id}
                  className="w-fit font-normal font-roboto-serif text-link text-sm leading-[160%] underline md:text-[17px]"
                >
                  {i + 1}. {e.name}
                </a>
              ))}
            </div>
            {entry.ecosystemsUpdatesEntries.map((ecosystem) => (
              <EcosystemUpdateSection
                key={ecosystem.id}
                ecosystem={ecosystem}
                from={entry.from}
                to={entry.to}
              />
            ))}
            {entry.daUpdatesEntries.map((da) => (
              <DaUpdateSection
                key={da.id}
                daLayer={da}
                from={entry.from}
                to={entry.to}
              />
            ))}
            {entry.upcomingProjectsUpdatesEntries.map((upcomingProject) => (
              <UpcomingProjectUpdateSection
                key={upcomingProject.id}
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
