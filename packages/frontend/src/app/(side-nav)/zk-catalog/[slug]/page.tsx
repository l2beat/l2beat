import { ProjectService } from '@l2beat/config'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentWrapper } from '~/components/content-wrapper'
import { env } from '~/env'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { getDefaultMetadata } from '~/utils/metadata'
import { ZK_CATALOG_ASK_FOR_VERIFICATION_LINK } from '../_utils/get-zk-catalog-view'
import { ZkCatalogProjectPage } from './_components/zk-catalog-project-page'
import { getZkCatalogProjectDetails } from './_utils/get-zk-catalog-project-details'

interface Params {
  slug: string
}

interface Props {
  params: Promise<Params>
}

export async function generateStaticParams(): Promise<Params[]> {
  if (env.VERCEL_ENV !== 'production') return []
  const projects = await ProjectService.STATIC.getProjects({
    where: ['proofVerification'],
    whereNot: ['isArchived'],
  })
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata | null> {
  const params = await props.params
  const project = await ProjectService.STATIC.getProject({
    slug: params.slug,
    where: ['proofVerification'],
    whereNot: ['isArchived'],
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
  const project = await ProjectService.STATIC.getProject({
    slug: params.slug,
    select: ['proofVerification'],
    optional: ['isScaling'],
    whereNot: ['isArchived'],
  })
  if (!project) {
    return notFound()
  }

  const verifiers = await getVerifiers()
  const projectDetails = {
    details: getZkCatalogProjectDetails(project, verifiers),
    askForVerificationLink: ZK_CATALOG_ASK_FOR_VERIFICATION_LINK,
  }

  return (
    <ContentWrapper mobileFull asChild>
      <main>
        <ZkCatalogProjectPage {...projectDetails} />
      </main>
    </ContentWrapper>
  )
}
