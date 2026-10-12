import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata, SITE_TITLE } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getImageParams } from '~/utils/project/getImageParams'

export async function getMultisigReportData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const props = await getAppLayoutProps()
  const multisigReportImage = getImageParams('/images/multisig-report.png')
  if (!multisigReportImage) {
    throw new Error('Multisig report image not found')
  }
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        url,
        openGraph: {
          image: '/meta-images/multisig-report/opengraph-image.png',
        },
        name: 'Multisig Report',
        title: SITE_TITLE,
      }),
    },
    ssr: {
      page: 'MultisigReportPage',
      props: {
        ...props,
        multisigReportImage,
      },
    },
  }
}
