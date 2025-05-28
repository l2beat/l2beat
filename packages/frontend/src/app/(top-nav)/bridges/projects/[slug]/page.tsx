import { notFound } from 'next/navigation'
import { getBridgesProjectEntry } from 'rewrite/src/server/features/bridges/project/get-bridges-project-entry'
import { ps } from 'rewrite/src/server/projects'
import { env } from '~/env'
import { HydrateClient, api } from '~/trpc/server'
import { getProjectMetadata } from '~/utils/metadata'
import { BridgesProjectPage } from './_page'

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []
  const projects = await ps.getProjects({ where: ['isBridge'] })
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const project = await ps.getProject({
    slug: params.slug,
    select: ['display'],
    where: ['isBridge'],
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
        url: `/bridges/projects/${project.slug}`,
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
      'tvsInfo',
      'bridgeInfo',
      'bridgeRisks',
      'bridgeTechnology',
      'display',
    ],
    where: ['isBridge'],
    optional: [
      'tvsConfig',
      'chainConfig',
      'archivedAt',
      'isUpcoming',
      'milestones',
      'contracts',
      'permissions',
    ],
  })

  if (!project) {
    notFound()
  }

  const [projectEntry] = await Promise.all([
    getBridgesProjectEntry(project),
    api.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens: false,
      previewRecategorisation: false,
    }),
  ])

  // HydrateClient is used to hydrate the client with chart data that is fetched inside get-bridges-project-details.tsx
  return (
    <HydrateClient>
      <BridgesProjectPage projectEntry={projectEntry} />
    </HydrateClient>
  )
}
