import { ProjectService } from '@l2beat/config'
import { type Metadata } from 'next'
import { ContentWrapper } from '~/components/content-wrapper'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { getDefaultMetadata } from '~/utils/metadata'
import { ZkCatalogPage } from './_components/zk-catalog-page'
import { getZkCatalogView } from './_utils/get-zk-catalog-view'

export const metadata: Metadata = getDefaultMetadata({
  title: 'ZK Catalog - L2BEAT',
  description: 'A catalog of the ZK projects with detailed research.',
  openGraph: {
    url: '/zk-catalog',
  },
})

export default async function Page() {
  const verifiers = await getVerifiers()
  const projects = await ProjectService.STATIC.getProjects({
    select: ['proofVerification'],
    whereNot: ['isArchived'],
  })
  const view = getZkCatalogView(projects, verifiers)

  return (
    <ContentWrapper>
      <header className="mt-[72px] text-left md:text-center">
        <h1 className="text-5xl font-bold md:text-6xl">ZK Catalog</h1>
        <p className="mx-auto mt-6 max-w-[994px] text-base font-medium">
          ZK Catalog by L2BEAT is a community-driven resource offering detailed
          insights into the ZK technology utilized by various blockchain
          projects. It aims to enhance transparency and understanding of ZK tech
          implementations across the industry.
        </p>
      </header>
      <main className="mt-4 md:mt-12">
        <ZkCatalogPage {...view} />
      </main>
    </ContentWrapper>
  )
}
