import { HomeCardHeader } from '~/pages/home/components/HomeCardHeader'
import { HOME_TEXT } from '~/pages/home/homeStyles'

/**
 * Holds the place of the Blobs component inside the Ethereum card, under its
 * charts, until it is built. It takes the height the interop graph beside it
 * leaves.
 */
export function LandingBlobsPlaceholder() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <HomeCardHeader
        title="Blobs"
        href="/data-availability/summary"
        level={3}
      />
      <div className="flex min-h-[200px] flex-1 items-center justify-center rounded-lg border border-divider border-dashed">
        <span className={HOME_TEXT.meta}>Blobs component placeholder</span>
      </div>
    </div>
  )
}
