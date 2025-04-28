import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getCollection } from '~/content/get-collection'
import type { Manifest } from '~/utils/Manifest'

export async function getGlossaryData(manifest: Manifest): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const glossaryEntries = getCollection('glossary')

  return {
    head: {
      manifest,
      title: 'Glossary - L2BEAT',
      description:
        'Learn about the terminology used in Ethereum layer 2 scaling solutions.',
    },
    ssr: {
      page: 'GlossaryPage',
      props: {
        ...appLayoutProps,
        glossaryEntries,
      },
    },
  }
}
