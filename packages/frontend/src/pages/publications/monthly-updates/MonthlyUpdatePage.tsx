import type { UnixTime } from '@l2beat/shared-pure'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import { SectionNavigation } from '~/components/section-navigation/SectionNavigation'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { DaMonthlyUpdateEntry } from '~/server/features/monthly-reports/getDaEntries'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import type { UpcomingProjectUpdateEntry } from '~/server/features/monthly-reports/getUpcomingEntries'
import { PublicationTag } from '../components/PublicationsList'
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
  const sections = [
    ...entry.ecosystemsUpdatesEntries,
    ...entry.daUpdatesEntries,
    ...entry.upcomingProjectsUpdatesEntries,
  ].map((item) => ({
    id: item.id,
    title: item.name,
    icon: <img src={`/icons/${item.id}.png`} alt={item.name} />,
  }))
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div className="md:-mx-6 sticky top-0 z-100 lg:hidden">
          <MobileSectionNavigation sections={sections} />
        </div>

        <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
          <MainPageHeader>Publication</MainPageHeader>
          <PrimaryCard className="row-start-2 md:p-8">
            <div>
              <div className="flex items-baseline gap-2">
                <PublicationTag tag="monthly-update" />
                <p className="text-brand text-subtitle-12 uppercase">
                  Published on {entry.publishedOn}
                </p>
              </div>
              <h1 className="mt-2 text-heading-24 md:text-heading-32">
                {entry.title}
              </h1>
            </div>
            <HorizontalSeparator className="my-6 md:my-8" />
            <div className="mt-6 md:mt-8">
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
          <div className="row-start-2 mt-3 hidden shrink-0 lg:block">
            <div className="sticky top-8 w-full">
              <SectionNavigation sections={sections} />
            </div>
          </div>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
