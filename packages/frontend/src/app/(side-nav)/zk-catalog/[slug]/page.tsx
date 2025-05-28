import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { env } from '~/env'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { ps } from '~/server/projects'
import { getDefaultMetadata } from '~/utils/metadata'
import { getZkCatalogProjectDetails } from '../../../../pages/zk-catalog/project/utils/get-zk-catalog-project-details'
import { ZkCatalogProjectPage } from './_page'

interface Params {
  slug: string
}

interface Props {
  params: Promise<Params>
}

export async function generateStaticParams(): Promise<Params[]> {
  if (env.VERCEL_ENV !== 'production') return []
  const projects = await ps.getProjects({
    where: ['proofVerification'],
    whereNot: ['archivedAt'],
  })
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata | null> {
  const params = await props.params
  const project = await ps.getProject({
    slug: params.slug,
    where: ['proofVerification'],
    whereNot: ['archivedAt'],
  })
  if (!project) {
    return null
  }
  return getDefaultMetadata({
    title: `${project.name} - ZK Catalog`,
  })
}

export default async function Page(props: Props) {
  const params = await props.params
  const project = await ps.getProject({
    slug: params.slug,
    select: ['proofVerification'],
    optional: ['isScaling'],
    whereNot: ['archivedAt'],
  })
  if (!project) {
    return notFound()
  }

  const verifiers = await getVerifiers()
  const projectDetails = getZkCatalogProjectDetails(project, verifiers)

  return <ZkCatalogProjectPage projectDetails={projectDetails} />
}
