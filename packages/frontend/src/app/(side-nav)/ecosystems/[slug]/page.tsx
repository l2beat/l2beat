import { notFound } from 'next/navigation'
import { env } from '~/env'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'
import { EcosystemProjectPage } from './_page'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []

  const ecosystems = await ps.getProjects({ select: ['ecosystemConfig'] })
  return ecosystems.map((ecosystem) => ({
    slug: ecosystem.slug,
  }))
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const ecosystem = await getEcosystemEntry(slug)

  if (!ecosystem) {
    return notFound()
  }

  await Promise.all([
    api.tvs.chart.prefetch({
      range: '1y',
      excludeAssociatedTokens: false,
      filter: {
        type: 'projects',
        projectIds: ecosystem.projects.map((project) => project.id),
      },
      previewRecategorisation: false,
    }),
    api.activity.chart.prefetch({
      range: '1y',
      filter: {
        type: 'projects',
        projectIds: ecosystem.projects.map((project) => project.id),
      },
      previewRecategorisation: false,
    }),
  ])

  return <EcosystemProjectPage ecosystem={ecosystem} />
}
