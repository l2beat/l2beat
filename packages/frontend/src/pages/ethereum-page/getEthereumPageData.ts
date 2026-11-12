import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getEntry } from '~/pages/ethereum/getEthereumProjectData'
import { getBlobPosters } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { todayStart } from './live/simulatedHistory'

export async function getEthereumPageData(
  manifest: Manifest,
  url: string,
  speed: number,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry, posters] = await Promise.all([
    getAppLayoutProps(),
    getEntry(helpers),
    getBlobPosters(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Ethereum',
        description:
          'Ethereum, live from the tip of the chain: what it carries, what it costs, who relies on it and what they have to trust.',
        url,
        openGraph: {
          image: '/meta-images/projects/ethereum/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'EthereumPage',
      props: {
        ...appLayoutProps,
        speed,
        entry,
        posters,
        historyEnd: todayStart(),
        queryState: helpers.dehydrate(),
      },
    },
  }
}
