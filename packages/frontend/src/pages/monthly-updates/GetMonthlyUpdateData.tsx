import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getMonthlyUpdateEntry } from './utils/getMonthlyUpdateEntry'

export async function getMonthlyUpdateData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps()
  const publications = getCollection('monthly-updates')

  const monthlyUpdate = publications.find((p) => p.id === slug)
  if (!monthlyUpdate) {
    return undefined
  }

  const monthlyUpdateEntry = await getMonthlyUpdateEntry(monthlyUpdate)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Monthly Updates - L2BEAT',
        openGraph: {
          url,
          image: '/meta-images/governance/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'MonthlyUpdatePage',
      props: {
        ...appLayoutProps,
        ...monthlyUpdateEntry,
      },
    },
  }
}
