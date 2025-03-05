import { notFound } from 'next/navigation'
import { PrimaryCardHighlighter } from '~/components/highlighters/primary-card-highlighter'
import { PrimaryCard } from '~/components/primary-card'
import { env } from '~/env'
import { getTvsBreakdownForProject } from '~/server/features/scaling/tvs/breakdown/get-tvs-breakdown-for-project'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/utils/get-7d-tvs-breakdown'
import { ps } from '~/server/projects'
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
    optional: ['chainConfig'],
    where: ['isScaling'],
  })

  if (!project || env.EXCLUDED_TVS_PROJECTS?.includes(project.id.toString())) {
    notFound()
  }

  const projects7dData = await get7dTvsBreakdown()
  const project7dData = projects7dData.projects[project.id.toString()]!
  if (!project7dData) {
    notFound()
  }

  const {
    dataTimestamp,
    breakdown: { canonical, native, external },
  } = await getTvsBreakdownForProject(project)

  return (
    <>
      <TvsBreakdownPageHeader
        title={project.name}
        slug={project.slug}
        tvs={project7dData}
        tvsWarning={project.tvlInfo.warnings[0]}
        tvsBreakdownTimestamp={dataTimestamp}
      />
      <div className="md:mt-6 md:space-y-6">
        {canonical.length > 0 && (
          <PrimaryCard id="canonical">
            <CanonicallyBridgedTable tokens={canonical} />
          </PrimaryCard>
        )}
        {external.length > 0 && (
          <PrimaryCard id="external">
            <ExternallyBridgedTable tokens={external} />
          </PrimaryCard>
        )}
        {native.length > 0 && (
          <PrimaryCard id="native">
            <NativelyMintedTable tokens={native} />
          </PrimaryCard>
        )}
      </div>
      <RequestTokenBox />
      <PrimaryCardHighlighter />
    </>
  )
}
