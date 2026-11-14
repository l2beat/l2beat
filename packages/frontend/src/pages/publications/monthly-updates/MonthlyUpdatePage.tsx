import type { UnixTime } from '@l2beat/shared-pure'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionNavigation } from '~/components/section-navigation/SectionNavigation'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { EcosystemMonthlyUpdateEntry } from '~/server/features/monthly-reports/getEcosystemEntries'
import type { UpcomingProjectUpdateEntry } from '~/server/features/monthly-reports/getUpcomingEntries'
import { PublicationTag } from '../components/PublicationTag'
import { EcosystemUpdateSection } from './components/ecosystems/EcosystemUpdateSection'
import { UpcomingProjectUpdateSection } from './components/upcoming/UpcomingProjectUpdateSection'

interface Props extends AppLayoutProps {
  entry: {
    publishedOn: string
    title: string
    from: UnixTime
    to: UnixTime
    ecosystemsUpdatesEntries: EcosystemMonthlyUpdateEntry[]
    upcomingProjectsUpdatesEntries: UpcomingProjectUpdateEntry[]
  }
}

export function MonthlyUpdatePage({ entry, ...props }: Props) {
  const sections = [
    ...entry.ecosystemsUpdatesEntries,
    ...entry.upcomingProjectsUpdatesEntries,
  ].map((item) => ({
    id: item.id,
    title: item.name,
    icon: <img src={item.iconUrl} alt={item.name} />,
  }))
  return (
    <AppLayout {...props}>
      <SideNavLayout childrenWrapperClassName="md:pt-0">
        <StickyMobileSectionNavigation
          sections={sections}
          className="md:mb-6"
        />

        <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
          <MainPageHeader>Publication</MainPageHeader>
          <PrimaryCard className="row-start-2">
            <div>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label-value-13">
                <PublicationTag tag="monthly-update" />
                <span className="text-brand-deep">
                  Published on {entry.publishedOn}
                </span>
              </p>
              <h1 className="mt-3 text-balance font-semibold text-[28px] leading-[1.15] tracking-[-0.02em] md:text-[36px]">
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
      </SideNavLayout>
    </AppLayout>
  )
}
