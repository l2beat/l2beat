import { notFound } from 'next/navigation'
import { env } from '~/env'
import { getScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingProjectTvsBreakdownPage } from './_page'

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
    title: `${project.name} | TVS Breakdown - L2BEAT`,
    description: `See a detailed breakdown of ${project.name}'s TVS on L2BEAT.`,
  })
}

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params

  const tvsBreakdownData = await getScalingProjectTvsBreakdownData(params.slug)
  if (!tvsBreakdownData) {
    notFound()
  }

  await api.tvs.chart.prefetch({
    filter: {
      type: 'projects',
      projectIds: [tvsBreakdownData.project.id.toString()],
    },
    excludeAssociatedTokens: false,
    range: '1y',
  })

  return <ScalingProjectTvsBreakdownPage {...tvsBreakdownData} />
}
