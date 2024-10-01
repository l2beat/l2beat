import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentWrapper } from '~/components/content-wrapper'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { getDefaultMetadata } from '~/utils/metadata'
import { ZK_CATALOG_ASK_FOR_VERIFICATION_LINK } from '../_utils/get-zk-catalog-view'
import { projects } from '../_utils/projects'
import { ZkCatalogProjectPage } from './_components/zk-catalog-project-page'
import { getZkCatalogProjectDetails } from './_utils/get-zk-catalog-project-details'

interface Props {
  params: {
    project: string
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | null> {
  const project = projects.find((p) => p.display.slug === params.project)

  if (!project) {
    return null
  }

  return getDefaultMetadata({
    title: `${project.display.name} - ZK Catalog`,
  })
}

export default async function Page(props: Props) {
  const project = projects.find((p) => p.display.slug === props.params.project)

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
