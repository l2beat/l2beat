import type { Metadata } from 'next'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { ps } from '~/server/projects'
import { getDefaultMetadata } from '~/utils/metadata'
import { ZkCatalogPage } from './_page'
import { getZkCatalogEntries } from './_utils/get-zk-catalog-entries'

export const metadata: Metadata = getDefaultMetadata({
  title: 'ZK Catalog - L2BEAT',
  description: 'A catalog of the ZK projects with detailed research.',
  openGraph: {
    url: '/zk-catalog',
  },
})

export default async function Page() {
  const [verifiers, projects] = await Promise.all([
    getVerifiers(),
    ps.getProjects({
      select: ['proofVerification'],
      whereNot: ['archivedAt'],
    }),
  ])
  const entries = getZkCatalogEntries(projects, verifiers)

  return <ZkCatalogPage entries={entries} />
}
