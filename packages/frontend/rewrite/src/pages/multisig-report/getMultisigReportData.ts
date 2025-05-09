import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'
import { getImageParams } from '~/utils/project/get-image-params'

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
        openGraph: {
          url,
        },
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
