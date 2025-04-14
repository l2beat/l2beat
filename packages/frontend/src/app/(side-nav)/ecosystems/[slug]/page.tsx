import { notFound } from 'next/navigation'
import { CssVariables } from '~/components/css-variables'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import { api } from '~/trpc/server'
import { cn } from '~/utils/cn'
import { EcosystemsActivityChart } from '../_components/charts/ecosystems-activity-chart'
import { EcosystemsProjectsChart } from '../_components/charts/ecosystems-projects-chart'
import { EcosystemsTvsChart } from '../_components/charts/ecosystems-tvs-chart'
import { EcosystemPageHeader } from '../_components/ecosystem-page-header'
import { EcosystemProjectsTable } from '../_components/ecosystem-projects-table'
import { EcosystemBuildOnLink } from '../_components/widgets/ecosystem-build-on-link'
import { EcosystemGovernanceLinks } from '../_components/widgets/ecosystem-governance-links'
import { EcosystemLearnMoreLink } from '../_components/widgets/ecosystem-learn-more-link'
import { EcosystemMilestonesAndIncidents } from '../_components/widgets/ecosystem-milestones-and-incidents'
import { EcosystemMobileProjectLinks } from '../_components/widgets/ecosystem-mobile-project-links'
import { EcosystemProjectsByDaLayer } from '../_components/widgets/ecosystem-projects-by-da-layer'
import { EcosystemProjectsByRaas } from '../_components/widgets/ecosystem-projects-by-raas'
import { EcosystemToken } from '../_components/widgets/ecosystem-token'
import { EcosystemTvsByStage } from '../_components/widgets/ecosystem-tvs-by-stage'
import { EcosystemTvsByTokenType } from '../_components/widgets/ecosystem-tvs-by-token-type'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const ecosystem = await getEcosystemEntry(slug)

  if (!ecosystem) {
    return notFound()
  }

  await Promise.all([
    api.tvs.chart.prefetch({
      range: '1y',
      excludeAssociatedTokens: false,
      filter: {
        type: 'projects',
        projectIds: ecosystem.projects.map((project) => project.id),
      },
    }),
    api.activity.chart.prefetch({
      range: '1y',
      filter: {
        type: 'projects',
        projectIds: ecosystem.projects.map((project) => project.id),
      },
    }),
  ])

  return (
    <div className="relative z-[0] max-md:px-4" data-hide-overflow-x>
      <CssVariables
        variables={{
          'ecosystem-primary': ecosystem.colors.primary,
          'ecosystem-primary-50': `${ecosystem.colors.primary}80`,
          'ecosystem-primary-25': `${ecosystem.colors.primary}40`,
          'ecosystem-secondary': ecosystem.colors.secondary,
          spacing: '0.75rem',
        }}
      />
      {/* eslint-disable-next-line tailwindcss/no-contradicting-classname */}
      <div className="absolute right-[20%] top-44 -z-1 h-[180vh] w-screen -translate-y-1/2 translate-x-1/2 bg-gradient-radial from-[--ecosystem-primary] via-[--ecosystem-secondary] via-25% to-transparent lg:top-20 lg:w-[calc(100vw_-_15rem)]"></div>
      <div>
        <EcosystemPageHeader
          logo={ecosystem.logo}
          badges={ecosystem.badges}
          links={ecosystem.links.header}
        />
        <main className="my-[--spacing] grid grid-cols-12 gap-[--spacing]">
          <EcosystemMobileProjectLinks
            links={ecosystem.links.header}
            className="col-span-12"
          />
          <EcosystemsTvsChart
            name={ecosystem.name}
            entries={ecosystem.projects}
            allScalingProjectsTvs={ecosystem.allScalingProjects.tvs}
            className="col-span-12 md:col-span-6"
          />
          <EcosystemsActivityChart
            name={ecosystem.name}
            entries={ecosystem.projects}
            allScalingProjectsUops={ecosystem.allScalingProjects.uops}
            className="col-span-12 md:col-span-6"
          />
          <div className="col-span-12 grid gap-[--spacing] lg:hidden lg:grid-cols-2">
            <EcosystemBuildOnLink
              name={ecosystem.name}
              slug={slug}
              href={ecosystem.links.buildOn}
              className={cn(slug === 'superchain' && 'text-primary')}
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
            data={ecosystem.projectsChartData}
            className="col-span-12 md:col-span-6 min-[1440px]:col-span-12"
          />
          <EcosystemToken
            token={ecosystem.token}
            className="col-span-12 lg:col-span-6"
          />
          <div className="col-span-12 grid grid-rows-2 gap-[--spacing] max-lg:hidden md:col-span-6">
            <EcosystemBuildOnLink
              name={ecosystem.name}
              slug={slug}
              href={ecosystem.links.buildOn}
              className={cn(slug === 'superchain' && 'text-primary')}
            />
            <EcosystemLearnMoreLink
              name={ecosystem.name}
              href={ecosystem.links.learnMore}
            />
          </div>
          <EcosystemMilestonesAndIncidents
            milestones={ecosystem.milestones}
            className="col-span-12"
          />
          <EcosystemProjectsByRaas
            projectsByRaas={ecosystem.projectsByRaas}
            className="col-span-12 lg:col-span-4"
          />
          <EcosystemGovernanceLinks
            links={ecosystem.links.governance}
            className="col-span-12 lg:col-span-8"
          />
        </main>
        <EcosystemProjectsTable entries={ecosystem.projects} />
      </div>
    </div>
  )
}
