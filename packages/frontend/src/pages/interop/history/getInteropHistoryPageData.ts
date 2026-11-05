import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getActiveInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import type { InteropQuery } from '../InteropRouter'
import { getInitialInteropSelection } from '../utils/getInitialInteropSelection'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'

export async function getInteropHistoryPageData(
  req: Request<unknown, unknown, unknown, InteropQuery>,
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = mapInteropChainsToWithIcons(
    manifest,
    getActiveInteropChains(),
  )
  const interopChainsIds = interopChains.map((chain) => chain.id)

  // The history starts at everything, rather than at an empty selection.
  const selection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds,
  })
  const initialSelection = {
    from: req.query?.from ? selection.from : interopChainsIds,
    to: req.query?.to ? selection.to : interopChainsIds,
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Interop history',
        description:
          'Historical interop volumes, flows per chain and transfer times, with the data-quality rules that remove bogus spikes shown side by side.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/interop/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropHistoryPage',
      props: {
        ...appLayoutProps,
        interopChains,
        initialSelection,
      },
    },
  }
}
