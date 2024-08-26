import { layer2s, layer3s } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { getDetailed7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-detailed-7d-tvl-breakdown'
import { BreakdownPageWrapper } from './_components/breakdown-page-wrapper'
import { TvlBreakdownPageHeader } from './_components/tvl-breakdown-page-header'
import { TvlBreakdownSummaryBox } from './_components/tvl-breakdown-summary-box'

const scalingProjects = [...layer2s, ...layer3s]

interface Props {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const project = scalingProjects.find((p) => p.display.slug === params.slug)

  if (!project) {
    notFound()
  }

  const detailedBreakdown = await getDetailed7dTvlBreakdown()
  const tokenBreakdown = await getTvlBreakdownForProject(project.id)
  const projectBreakdown = detailedBreakdown.projects[project.id.toString()]!

  return (
    <BreakdownPageWrapper>
      <TvlBreakdownPageHeader
        title={project.display.name}
        slug={project.display.slug}
        tvlBreakdownDate={tokenBreakdown.dataTimestamp}
      />
      <TvlBreakdownSummaryBox
        tvl={{
          value: projectBreakdown.total,
          change: projectBreakdown.totalChange,
        }}
        canonical={{
          value: projectBreakdown.breakdown.canonical,
          change: projectBreakdown.change.canonical,
        }}
        external={{
          value: projectBreakdown.breakdown.external,
          change: projectBreakdown.change.external,
        }}
        native={{
          value: projectBreakdown.breakdown.native,
          change: projectBreakdown.change.native,
        }}
      />
    </BreakdownPageWrapper>
  )
}
