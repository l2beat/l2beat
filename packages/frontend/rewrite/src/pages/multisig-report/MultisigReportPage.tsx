import { MultisigReportPage as NextMultisigReportPage } from '~/app/(top-nav)/multisig-report/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ImageParams } from '~/utils/project/get-image-params'

interface Props extends AppLayoutProps {
  multisigReportImage: ImageParams
}

export function MultisigReportPage({ multisigReportImage, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <TopNavLayout>
        <NextMultisigReportPage multisigReportImage={multisigReportImage} />
      </TopNavLayout>
    </AppLayout>
  )
}
