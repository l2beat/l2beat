import { layer2s, layer3s, safeGetTokenByAssetId } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { getDetailed7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'
import { getExplorerUrlByChainId } from '~/utils/get-explorer-url'
import { getDefaultMetadata } from '~/utils/metadata'
import { BreakdownPageWrapper } from './_components/breakdown-page-wrapper'
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

  const detailedBreakdown = await getDetailed7dTvlBreakdown()
  const breakdowns = await getTvlBreakdownForProject(project.id)
  const p = breakdowns.breakdowns[project.id.toString()]!

  const projectTokenBreakdown = {
    ...p,
    native: p.native.map((token) => ({
      ...token,
      iconUrl: safeGetTokenByAssetId(token.assetId)!.iconUrl!,
      symbol: safeGetTokenByAssetId(token.assetId)!.symbol,
      explorerUrl: getExplorerUrlByChainId(token.chainId)!,
      supply: safeGetTokenByAssetId(token.assetId)!.supply,
    })),
    external: p.external.map((token) => ({
      ...token,
      iconUrl: safeGetTokenByAssetId(token.assetId)!.iconUrl!,
      symbol: safeGetTokenByAssetId(token.assetId)!.symbol,
      explorerUrl: getExplorerUrlByChainId(token.chainId)!,
      supply: safeGetTokenByAssetId(token.assetId)!.supply,
    })),
  }

  const projectBreakdown = detailedBreakdown.projects[project.id.toString()]!

  return (
    <BreakdownPageWrapper>
      <TvlBreakdownPageHeader
        title={project.display.name}
        slug={project.display.slug}
        tvlBreakdownDate={breakdowns.dataTimestamp}
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
      <NativelyMintedTable tokens={projectTokenBreakdown.native} />
      <ExternallyBridgedTable tokens={projectTokenBreakdown.external} />
      <CanonicallyBridgedTable tokens={projectTokenBreakdown.canonical} />

      <RequestTokenBox />
    </BreakdownPageWrapper>
  )
}
