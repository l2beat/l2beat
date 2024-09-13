import { layer2s, layer3s } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { get7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'
import { getDefaultMetadata } from '~/utils/metadata'
import { RequestTokenBox } from './_components/request-token-box'
import { CanonicallyBridgedTable } from './_components/tables/canonically-bridged-table'
import { ExternallyBridgedTable } from './_components/tables/externally-bridges-table'
import { NativelyMintedTable } from './_components/tables/natively-minted-table'
import { TvlBreakdownPageHeader } from './_components/tvl-breakdown-page-header'
import { TvlBreakdownSummaryBox } from './_components/tvl-breakdown-summary-box'

const scalingProjects = [...layer2s, ...layer3s]

export async function generateMetadata({ params }: Props) {
  const project = scalingProjects.find(
    (layer) => layer.display.slug === params.slug,
  )

  if (!project) {
    notFound()
  }

  return getDefaultMetadata({
    title: `${project.display.name} | TVL Breakdown – L2BEAT`,
    description: `${project.display.name} project TVL Breakdown overview on L2BEAT. In depth scaling protocol analysis. Ethereum scaling analytics and research.`,
  })
}

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

  const projects7dData = await get7dTvlBreakdown()
  const project7dData = projects7dData.projects[project.id.toString()]!

  const {
    dataTimestamp,
    breakdown: { canonical, native, external },
  } = await getTvlBreakdownForProject(project)

  return (
    <>
      <TvlBreakdownPageHeader
        title={project.display.name}
        slug={project.display.slug}
        tvlBreakdownTimestamp={dataTimestamp}
      />
      <TvlBreakdownSummaryBox
        tvl={{
          value: project7dData.total,
          change: project7dData.totalChange,
        }}
        canonical={{
          value: project7dData.breakdown.canonical,
          change: project7dData.change.canonical,
        }}
        external={{
          value: project7dData.breakdown.external,
          change: project7dData.change.external,
        }}
        native={{
          value: project7dData.breakdown.native,
          change: project7dData.change.native,
        }}
      />
      <NativelyMintedTable tokens={native} />
      <ExternallyBridgedTable tokens={external} />
      <CanonicallyBridgedTable tokens={canonical} />

      <RequestTokenBox />
    </>
  )
}
