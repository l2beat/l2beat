import { notFound } from 'next/navigation'
import { env } from '~/env'
import { getScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { ps } from '~/server/projects'
import { HydrateClient, api } from '~/trpc/server'
import { getProjectMetadata } from '~/utils/metadata'
import { ScalingProjectPage } from './_page'

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []

  const projects = await ps.getProjects({ where: ['scalingInfo'] })
  return projects.map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata(props: Props) {
  const params = await props.params

  const project = await ps.getProject({
    slug: params.slug,
    select: ['display'],
    where: ['scalingInfo'],
  })
  if (!project) {
    notFound()
  }

  return getProjectMetadata({
    project: {
      name: project.name,
      description: project.display.description,
    },
    metadata: {
      openGraph: {
        url: `/scaling/projects/${project.slug}`,
      },
    },
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
    select: [
      'display',
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvsInfo',
    ],
    optional: [
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'customDa',
      'isUpcoming',
      'archivedAt',
      'milestones',
      'trackedTxsConfig',
      'tvsConfig',
      'livenessConfig',
    ],
  })
  if (!project) {
    notFound()
  }

  const [projectEntry] = await Promise.all([
    getScalingProjectEntry(project),
    api.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens: false,
    }),
    api.activity.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
    }),
    project.scalingInfo.layer === 'layer2'
      ? api.costs.projectChart.prefetch({
          range: '1y',
          projectId: project.id,
        })
      : undefined,
  ])

  return (
    <HydrateClient>
      <ScalingProjectPage projectEntry={projectEntry} />
    </HydrateClient>
  )
}
