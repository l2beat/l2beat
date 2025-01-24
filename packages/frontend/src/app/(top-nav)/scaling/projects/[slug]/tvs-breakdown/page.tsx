import { layer2s, layer3s } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { PrimaryCard } from '~/components/primary-card'
import { env } from '~/env'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { get7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'
import { getDefaultMetadata } from '~/utils/metadata'
import { RequestTokenBox } from './_components/request-token-box'
import { CanonicallyBridgedTable } from './_components/tables/canonically-bridged-table'
import { ExternallyBridgedTable } from './_components/tables/externally-bridges-table'
import { NativelyMintedTable } from './_components/tables/natively-minted-table'
import { TvlBreakdownPageHeader } from './_components/tvl-breakdown-page-header'

const scalingProjects = [...layer2s, ...layer3s]

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []
  return scalingProjects.map((project) => ({ slug: project.display.slug }))
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const project = scalingProjects.find(
    (layer) => layer.display.slug === params.slug,
  )

  if (!project) {
    notFound()
  }

  return getDefaultMetadata({
    title: `${project.display.name} | TVS Breakdown – L2BEAT`,
    description: `${project.display.name} project TVS Breakdown overview on L2BEAT. In depth scaling protocol analysis. Ethereum scaling analytics and research.`,
  })
}

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const project = scalingProjects.find((p) => p.display.slug === params.slug)

  if (!project || env.EXCLUDED_TVL_PROJECTS?.includes(project.id.toString())) {
    notFound()
  }

  const projects7dData = await get7dTvlBreakdown()
  const project7dData = projects7dData.projects[project.id.toString()]!
  if (!project7dData) {
    notFound()
  }

  const {
    dataTimestamp,
    breakdown: { canonical, native, external },
  } = await getTvlBreakdownForProject(project)

  return (
    <>
      <TvlBreakdownPageHeader
        title={project.display.name}
        slug={project.display.slug}
        tvl={project7dData}
        tvlWarning={project.display.tvlWarning}
        tvlBreakdownTimestamp={dataTimestamp}
      />
      <div className="md:mt-6 md:space-y-6">
        {native.length > 0 && (
          <PrimaryCard>
            <NativelyMintedTable tokens={native} />
          </PrimaryCard>
        )}
        {external.length > 0 && (
          <PrimaryCard>
            <ExternallyBridgedTable tokens={external} />
          </PrimaryCard>
        )}
        {canonical.length > 0 && (
          <PrimaryCard>
            <CanonicallyBridgedTable tokens={canonical} />
          </PrimaryCard>
        )}
      </div>

      <RequestTokenBox />
    </>
  )
}
