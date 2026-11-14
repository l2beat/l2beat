import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { ImageParams } from '~/utils/project/getImageParams'
import { ReportDownloadButton } from './ReportDownloadButton'

export function ReportBanner({
  image,
  fileUrl,
}: {
  image: ImageParams
  fileUrl: string
}) {
  return (
    <PrimaryCard className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
      <div className="flex flex-col items-start gap-4">
        <div>
          <p className="font-medium text-label-value-13 text-secondary">
            June 2023 snapshot
          </p>
          <h2 className="mt-2 text-balance font-semibold text-heading-28 tracking-[-0.01em] md:text-heading-40">
            Upgradeability of Ethereum L2s
          </h2>
        </div>
        <ReportDownloadButton fileUrl={fileUrl} />
      </div>
      {/* The report's cover on its own backdrop, framed as a photo */}
      <img alt="" {...image} className="h-auto w-full rounded-lg" />
    </PrimaryCard>
  )
}
