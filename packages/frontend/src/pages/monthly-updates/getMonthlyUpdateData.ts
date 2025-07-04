import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { env } from '~/env'
import { getMonthlyUpdateEntry } from '~/server/features/monthly-reports/getMonthlyUpdateEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getMonthlyUpdateData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps()
  const publications = getCollection('monthly-updates')

  const monthlyUpdate = publications.find((p) => p.id === slug)
  if (!monthlyUpdate || !env.NEXT_PUBLIC_PARTNERS) {
    return undefined
  }

  const monthlyUpdateEntry = await getMonthlyUpdateEntry(monthlyUpdate)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${monthlyUpdateEntry.title} Update - L2BEAT`,
        description:
          "L2BEAT's monthly overview of the Ethereum scaling ecosystem: key news, protocol updates, and metrics.",
        openGraph: {
          url,
          image: '/meta-images/monthly-updates/opengraph-image.png',
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
