import { notFound } from 'next/navigation'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import { EcosystemsActivityChart } from '../_components/charts/ecosystems-activity-chart'
import { EcosystemsProjectsChart } from '../_components/charts/ecosystems-projects-chart'
import { EcosystemsTvsChart } from '../_components/charts/ecosystems-tvs-chart'
import { EcosystemPageHeader } from '../_components/ecosystem-page-header'
import { EcosystemProjectsTable } from '../_components/ecosystem-projects-table'
import { EcosystemDaLayersUsed } from '../_components/widgets/ecosystem-da-layers-used'
import { EcosystemTvsByStage } from '../_components/widgets/ecosystem-tvs-by-stage'
import { EcosystemTvsByTokenType } from '../_components/widgets/ecosystem-tvs-by-token-type'
import { EcosystemMilestonesAndIncidents } from '../_components/widgets/ecosystem-milestones-and-incidents'

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
          links={ecosystem.links}
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
          <EcosystemMilestonesAndIncidents milestones={ecosystem.milestones} />
          <EcosystemProjectsTable entries={ecosystem.projects} />
        </main>
      </div>
    </div>
  )
}
