import { notFound } from 'next/navigation'
import { getImageParams } from '~/utils/project/get-image-params'
import { MultisigReportPage } from './_page'

export default function Page() {
  const image = getImageParams('/images/multisig-report.png')
  if (!image) {
    notFound()
  }
  return <MultisigReportPage multisigReportImage={image} />
}
