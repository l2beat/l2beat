import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { CssVariables } from '~/components/CssVariables'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { EcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { cn } from '~/utils/cn'
import { EcosystemsActivityChart } from './components/charts/EcosystemsActivityChart'
import { EcosystemsProjectsChart } from './components/charts/EcosystemsProjectsChart'
import { EcosystemsTvsChart } from './components/charts/EcosystemsTvsChart'
import { EcosystemPageHeader } from './components/EcosystemPageHeader'
import { EcosystemProjectPageTables } from './components/EcosystemProjectPageTables'
import { EcosystemBuildOnLink } from './components/widgets/EcosystemBuildOnLink'
import { EcosystemGovernanceLinks } from './components/widgets/EcosystemGovernanceLinks'
import { EcosystemLearnMoreLink } from './components/widgets/EcosystemLearnMoreLink'
import { EcosystemMilestonesAndIncidents } from './components/widgets/EcosystemMilestonesAndIncidents'
import { EcosystemMobileProjectLinks } from './components/widgets/EcosystemMobileProjectLinks'
import { EcosystemProjectsByDaLayer } from './components/widgets/EcosystemProjectsByDaLayer'
import { EcosystemProjectsByRaas } from './components/widgets/EcosystemProjectsByRaas'
import { EcosystemToken } from './components/widgets/EcosystemToken'
import { EcosystemTvsByStage } from './components/widgets/EcosystemTvsByStage'
import { EcosystemTvsByTokenType } from './components/widgets/EcosystemTvsByTokenType'
import { EcosystemUpdateLink } from './components/widgets/EcosystemUpdateLink'

interface Props extends AppLayoutProps {
  ecosystem: EcosystemEntry
  queryState: DehydratedState
}

export function EcosystemProjectPage({
  ecosystem,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <div className="relative z-0 max-md:px-4" data-hide-overflow-x>
            <CssVariables
              variables={{
                'ecosystem-primary': ecosystem.colors.primary,
                'ecosystem-primary-50': {
                  light: `${ecosystem.colors.primary.light}80`,
                  dark: ecosystem.colors.primary.dark
                    ? `${ecosystem.colors.primary.dark}80`
                    : undefined,
                },
                'ecosystem-primary-25': {
                  light: `${ecosystem.colors.primary.light}40`,
                  dark: ecosystem.colors.primary.dark
                    ? `${ecosystem.colors.primary.dark}40`
                    : undefined,
                },
                'ecosystem-secondary': ecosystem.colors.secondary,
                'ecosystem-spacing': '0.75rem',
              }}
            />
            <div className="-z-1 -translate-y-1/2 absolute top-44 right-[20%] h-[400vh] w-screen translate-x-1/2 bg-radial-[closest-side] from-branding-primary via-25% via-branding-secondary to-transparent md:h-[180vh] lg:top-20 lg:w-[calc(100vw-15rem)]" />
            <div>
              <EcosystemPageHeader
                logo={ecosystem.logo}
                badges={ecosystem.badges}
                links={ecosystem.links.header}
              />
              <main className="my-(--ecosystem-spacing) grid grid-cols-12 gap-(--ecosystem-spacing)">
                <EcosystemMobileProjectLinks
                  links={ecosystem.links.header}
                  className="col-span-12"
                />
                <EcosystemsTvsChart
                  id={ecosystem.id}
                  name={ecosystem.name}
                  entries={ecosystem.liveProjects}
                  allScalingProjectsTvs={ecosystem.allScalingProjects.tvs}
                  ecosystemMilestones={ecosystem.ecosystemMilestones}
                  className="col-span-12 md:col-span-6"
                />
                <EcosystemsActivityChart
                  id={ecosystem.id}
                  name={ecosystem.name}
                  entries={ecosystem.liveProjects}
                  allScalingProjectsUops={ecosystem.allScalingProjects.uops}
                  ecosystemMilestones={ecosystem.ecosystemMilestones}
                  className="col-span-12 md:col-span-6"
                />
                <div className="col-span-12 grid gap-(--ecosystem-spacing) lg:hidden lg:grid-cols-2">
                  <EcosystemBuildOnLink
                    name={ecosystem.name}
                    slug={ecosystem.slug}
                    href={ecosystem.links.buildOn}
                    backgroundImage={ecosystem.images.buildOn}
                    className={cn(
                      ecosystem.slug === 'superchain' && 'text-primary',
                    )}
                  />
                  <EcosystemLearnMoreLink
                    name={ecosystem.name}
                    href={ecosystem.links.learnMore}
                  />
                </div>
                <EcosystemTvsByTokenType
                  tvsByTokenType={ecosystem.tvsByTokenType}
                  className="col-span-12 md:col-span-6 min-[1440px]:col-span-4"
                />
                <EcosystemTvsByStage
                  tvsByStage={ecosystem.tvsByStage}
                  className="col-span-12 md:col-span-6 min-[1440px]:col-span-4"
                />
                <EcosystemProjectsByDaLayer
                  projectsByDaLayer={ecosystem.projectsByDaLayer}
                  blobsData={ecosystem.blobsData}
                  className="col-span-12 md:col-span-6 min-[1440px]:col-span-4"
                />
                <EcosystemsProjectsChart
                  id={ecosystem.id}
                  data={ecosystem.projectsChartData}
                  ecosystemMilestones={ecosystem.ecosystemMilestones}
                  className="col-span-12 md:col-span-6 min-[1440px]:col-span-12"
                />
                <EcosystemToken
                  token={ecosystem.token}
                  className="col-span-12 lg:col-span-6"
                />
                <div className="col-span-12 grid grid-rows-2 gap-(--ecosystem-spacing) max-lg:hidden md:col-span-6">
                  <EcosystemBuildOnLink
                    name={ecosystem.name}
                    slug={ecosystem.slug}
                    href={ecosystem.links.buildOn}
                    backgroundImage={ecosystem.images.buildOn}
                    headlineText={ecosystem.banners.firstBanner?.headlineText}
                    mainText={ecosystem.banners.firstBanner?.mainText}
                    className={cn(
                      ecosystem.slug === 'superchain' && 'text-primary',
                    )}
                  />
                  <EcosystemLearnMoreLink
                    name={ecosystem.name}
                    href={ecosystem.links.learnMore}
                    headlineText={ecosystem.banners.secondBanner?.headlineText}
                    mainText={ecosystem.banners.secondBanner?.mainText}
                  />
                </div>
                <EcosystemMilestonesAndIncidents
                  milestones={ecosystem.allMilestones}
                  className="col-span-12"
                />
                <EcosystemProjectsByRaas
                  projectsByRaas={ecosystem.projectsByRaas}
                  className="col-span-12 lg:col-span-4"
                />
                <EcosystemGovernanceLinks
                  links={ecosystem.links.governance}
                  delegateToL2BEATBackgroundImage={
                    ecosystem.images.delegateToL2BEAT
                  }
                  className="col-span-12 lg:col-span-8"
                />
                <EcosystemUpdateLink
                  className="col-span-12"
                  href={ecosystem.links.ecosystemUpdate}
                />
              </main>
              <HorizontalSeparator className="my-4 max-md:hidden" />
              <TableFilterContextProvider>
                <EcosystemProjectPageTables ecosystem={ecosystem} />
              </TableFilterContextProvider>
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
