import { notFound } from 'next/navigation'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import { cn } from '~/utils/cn'
import { EcosystemsActivityChart } from '../_components/charts/ecosystems-activity-chart'
import { EcosystemsProjectsChart } from '../_components/charts/ecosystems-projects-chart'
import { EcosystemsTvsChart } from '../_components/charts/ecosystems-tvs-chart'
import { EcosystemPageHeader } from '../_components/ecosystem-page-header'
import { EcosystemProjectsTable } from '../_components/ecosystem-projects-table'
import { EcosystemBuildOnLink } from '../_components/widgets/ecosystem-build-on-link'
import { EcosystemDaLayersUsed } from '../_components/widgets/ecosystem-da-layers-used'
import { EcosystemGovernanceLinks } from '../_components/widgets/ecosystem-governance-links'
import { EcosystemLearnMoreLink } from '../_components/widgets/ecosystem-learn-more-link'
import { EcosystemMilestonesAndIncidents } from '../_components/widgets/ecosystem-milestones-and-incidents'
import { EcosystemProjectsByRaas } from '../_components/widgets/ecosystem-projects-by-raas'
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

  return (
    <div
      className="relative z-[0]"
      style={
        {
          '--ecosystem-primary': ecosystem.colors.primary,
          '--ecosystem-primary-50': `${ecosystem.colors.primary}80`,
          '--ecosystem-primary-25': `${ecosystem.colors.primary}40`,
          '--ecosystem-secondary': ecosystem.colors.secondary,
          '--spacing': '0.75rem',
        } as React.CSSProperties
      }
    >
      <div className="fixed right-[20%] top-44 -z-1 h-[2400px] w-screen -translate-y-1/2 translate-x-1/2 bg-gradient-radial from-ecosystem-primary via-ecosystem-secondary via-25% to-transparent lg:top-20 lg:w-[calc(100vw_-_15rem)]"></div>
      <div>
        <EcosystemPageHeader
          logo={ecosystem.logo}
          badges={ecosystem.badges}
          links={ecosystem.links.header}
        />
        <main className="mt-3 space-y-[--spacing]">
          <div className="grid grid-cols-2 gap-[--spacing]">
            <EcosystemsTvsChart
              name={ecosystem.name}
              entries={ecosystem.projects}
              allScalingProjectsTvs={ecosystem.allScalingProjects.tvs}
            />
            <EcosystemsActivityChart
              name={ecosystem.name}
              entries={ecosystem.projects}
              allScalingProjectsUops={ecosystem.allScalingProjects.uops}
            />
          </div>
          <div className="grid grid-cols-3 gap-[--spacing]">
            <EcosystemTvsByTokenType
              tvsByTokenType={ecosystem.tvsByTokenType}
            />
            <EcosystemTvsByStage tvsByStage={ecosystem.tvsByStage} />
            <EcosystemDaLayersUsed daLayersUsed={ecosystem.daLayersUsed} />
          </div>
          <EcosystemsProjectsChart
            entries={ecosystem.projects}
            allScalingProjectsCount={ecosystem.allScalingProjects.count}
          />
          <div className="grid grid-cols-2 gap-[--spacing]">
            <PrimaryCard>Token</PrimaryCard>
            <div className="grid grid-rows-2 gap-[--spacing]">
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
          </div>
          <EcosystemMilestonesAndIncidents milestones={ecosystem.milestones} />
          <div className="grid grid-cols-4 gap-[--spacing]">
            <EcosystemProjectsByRaas
              projectsByRaas={ecosystem.projectsByRaas}
            />
            <EcosystemGovernanceLinks
              links={ecosystem.links.governance}
              className="col-span-2 col-start-3"
            />
          </div>
          <EcosystemProjectsTable entries={ecosystem.projects} />
        </main>
      </div>
    </div>
  )
}
