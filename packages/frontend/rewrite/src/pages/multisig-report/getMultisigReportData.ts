import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'
import { getImageParams } from '~/utils/project/get-image-params'

export async function getMultisigReportData(
  manifest: Manifest,
): Promise<RenderData> {
  const props = await getAppLayoutProps()
  const multisigReportImage = getImageParams('/images/multisig-report.png')
  if (!multisigReportImage) {
    throw new Error('Multisig report image not found')
  }
  return {
    head: {
      manifest,
      title: 'L2BEAT - Multisig Report',
      description: 'L2BEAT - Multisig Report',
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
