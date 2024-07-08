import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ZK_CATALOG_ASK_FOR_VERIFICATION_LINK } from '../_utils/getZkCatalogView'
import { projects } from '../_utils/projects'
import { ZkCatalogProjectPage } from './_components/ZkCatalogProjectPage'
import { getZkCatalogProjectDetails } from './_utils/getZkCatalogProjectDetails'

interface Props {
  params: {
    project: string
  }
}

// Do we want to prerender these pages?
// export async function generateStaticParams() {
//   return projects.map((project) => ({
//     project: project.display.slug,
//   }));
// }

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
    <ContentWrapper>
      <main className="mt-4 md:mt-12">
        <ZkCatalogProjectPage {...projectDetails} />
      </main>
    </ContentWrapper>
  )
}
