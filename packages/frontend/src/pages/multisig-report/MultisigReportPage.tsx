import { Logo } from '~/components/Logo'
import { PolygonLogo } from '~/icons/PolygonLogo'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ReportBanner } from '~/pages/multisig-report/components/ReportBanner'
import { ReportDownloadButton } from '~/pages/multisig-report/components/ReportDownloadButton'
import type { ImageParams } from '~/utils/project/getImageParams'

const multisigReportUrl =
  'https://drive.google.com/file/d/1w__7gL91tDg81Nyq9NohC1R6MVMSEzpD/view'

interface Props extends AppLayoutProps {
  multisigReportImage: ImageParams
}

export function MultisigReportPage({ multisigReportImage, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <main className="flex flex-col md:items-center">
          <ReportBanner image={multisigReportImage} />
          <ReportDownloadButton fileUrl={multisigReportUrl} />
          <div className="mt-12 mb-6 w-full leading-7">
            <h2 className="mb-3 font-bold text-2xl md:mb-5 md:text-4xl">
              About the report
            </h2>
            <div>
              In recent years the Ethereum L2s ecosystem has grown tremendously
              in terms of the number of available systems, the number of
              different system architectures, and their complexity. As a direct
              consequence, a deeper understanding of the management mechanisms
              of these systems has grown increasingly important. Almost all
              present-day L2s are equipped with some form of upgrade mechanism,
              whether a code implementation upgrade or system parameters update.
              Given that these systems are in their relative infancy and
              continue to evolve, it&apos;s reasonable to expect that these
              upgrade mechanisms will remain an essential aspect of L2s for the
              foreseeable future.
            </div>
            <div className="mt-6">
              This report is a snapshot of our current knowledge as of June
              2023. In the report, we delve into various aspects of system
              upgradeability. We start with why and when we need Layer 2s to be
              upgradable, both from a user’s and an operator’s perspective. We
              go through different aspects that need to be considered when
              thinking about code upgradeability and managing system parameters,
              and we finish with our recommendations regarding the design of the
              systems architecture and safety measures. Attached at the end, you
              will find our analysis of 8 existing L2s and how they approached
              upgradeability and management. For every project, we focus
              primarily on the technical and organizational aspects, leaving
              away considerations regarding the governance structures and
              processes.
            </div>
          </div>
          <div className="flex w-full space-x-4">
            <Logo className="h-[26px] w-[64px]" />
            <PolygonLogo />
          </div>
          <ReportDownloadButton
            fileUrl={multisigReportUrl}
            className="visible mt-12 md:invisible"
          />
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}
