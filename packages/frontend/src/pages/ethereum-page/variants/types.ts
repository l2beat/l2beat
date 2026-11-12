import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'

/** What every variant gets from the server. Live data comes from `useEthereumHead` */
export interface VariantProps {
  /** The DA assessment: risk summary, risk analysis and technology sections */
  entry: EthereumProjectPageEntry
  /** Every project that posts blobs to Ethereum */
  posters: BlobPoster[]
  /** Unix seconds, 00:00 UTC today: where `getSimulatedHistory` ends */
  historyEnd: number
}
