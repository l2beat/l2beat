import { notFound } from 'next/navigation'
import { ProjectStackedTvsChart } from '~/components/chart/tvs/stacked/project-stacked-tvs-chart'
import { HighlightablePrimaryCard } from '~/components/primary-card/highlightable-primary-card'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { env } from '~/env'
import { getTvsBreakdownForProject } from '~/server/features/scaling/tvs/breakdown/get-tvs-breakdown-for-project'
import type { BaseAssetBreakdownData } from '~/server/features/scaling/tvs/breakdown/types'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/utils/get-7d-tvs-breakdown'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { RequestTokenBox } from './_components/request-token-box'
import { CanonicallyBridgedTable } from './_components/tables/canonically-bridged-table'
import { ExternallyBridgedTable } from './_components/tables/externally-bridges-table'
import { NativelyMintedTable } from './_components/tables/natively-minted-table'
import { TvsBreakdownPageHeader } from './_components/tvs-breakdown-page-header'

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []

  const projects = await ps.getProjects({ where: ['isScaling'] })
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const project = await ps.getProject({
    slug: params.slug,
    where: ['isScaling'],
  })

  if (!project) {
    notFound()
  }

  return getDefaultMetadata({
    title: `${project.name} | TVS Breakdown – L2BEAT`,
    description: `${project.name} project TVS Breakdown overview on L2BEAT. In depth scaling protocol analysis. Ethereum scaling analytics and research.`,
  })
}

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const project = await ps.getProject({
    slug: params.slug,
    select: ['tvlConfig', 'tvlInfo'],
    optional: ['chainConfig', 'milestones', 'contracts'],
    where: ['isScaling'],
  })

  if (!project || env.EXCLUDED_TVS_PROJECTS?.includes(project.id.toString())) {
    notFound()
  }

  const projects7dData = await get7dTvsBreakdown({ type: 'layer2' })
  const project7dData = projects7dData.projects[project.id.toString()]!
  if (!project7dData) {
    notFound()
  }

  const [
    {
      dataTimestamp,
      breakdown: { canonical, native, external },
    },
  ] = await Promise.all([
    getTvsBreakdownForProject(project),
    api.tvs.chart.prefetch({
      filter: { type: 'projects', projectIds: [project.id.toString()] },
      excludeAssociatedTokens: false,
      range: '1y',
    }),
  ])

  const tokens: ProjectTokens = {
    canonical: canonical.map((t) => breakdownToToken(t, 'canonical')),
    native: native.map((t) => breakdownToToken(t, 'native')),
    external: external.map((t) => breakdownToToken(t, 'external')),
  }

  return (
    <>
      <TvsBreakdownPageHeader
        title={project.name}
        slug={project.slug}
        tvsBreakdownTimestamp={dataTimestamp}
      />
      <div className="md:space-y-6">
        <PrimaryCard>
          <ProjectStackedTvsChart
            projectId={project.id}
            milestones={project.milestones ?? []}
            tokens={tokens}
            isBridge={false}
            slug={project.slug}
            tvsProjectStats={project7dData}
            tvlInfo={project.tvlInfo}
            hideBreakdownLink
          />
        </PrimaryCard>

        {canonical.length > 0 && (
          <HighlightablePrimaryCard id="canonical" className="md:scroll-mt-6">
            <CanonicallyBridgedTable tokens={canonical} id="canonical" />
          </HighlightablePrimaryCard>
        )}
        {native.length > 0 && (
          <HighlightablePrimaryCard id="native" className="md:scroll-mt-6">
            <NativelyMintedTable tokens={native} id="native" />
          </HighlightablePrimaryCard>
        )}
        {external.length > 0 && (
          <HighlightablePrimaryCard id="external" className="md:scroll-mt-6">
            <ExternallyBridgedTable tokens={external} id="external" />
          </HighlightablePrimaryCard>
        )}
      </div>
      <RequestTokenBox />
    </>
  )
}

function breakdownToToken(
  t: BaseAssetBreakdownData & { iconUrl: string; name: string; symbol: string },
  source: 'canonical' | 'native' | 'external',
): ProjectToken {
  return {
    assetId: t.assetId,
    iconUrl: t.iconUrl,
    symbol: t.symbol,
    name: t.name,
    address: t.tokenAddress ?? 'native',
    chain: t.chain.name,
    source,
  }
}
