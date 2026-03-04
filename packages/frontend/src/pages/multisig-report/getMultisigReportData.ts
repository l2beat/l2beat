import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getImageParams } from '~/utils/project/getImageParams'

export async function getMultisigReportData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData> {
  const props = await getAppLayoutProps(req)
  const multisigReportImage = getImageParams('/images/multisig-report.png')
  if (!multisigReportImage) {
    throw new Error('Multisig report image not found')
  }
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
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
