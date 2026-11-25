import type { CSSProperties } from 'react'
import { RollingNumber } from '~/components/RollingNumber'
import { cn } from '~/utils/cn'
import type { ChainBlock } from './blocks/beaconChain'
import { describeBlobCost } from './model'

/**
 * What a blob costs at the newest block's fee, the price a batch sent now
 * pays. It counts to each new block's, so a change shows as it lands
 */
export function BlobCost({
  blocks,
  ethPriceUsd,
  hidden,
  className,
  style,
}: {
  blocks: ReadonlyMap<number, ChainBlock>
  ethPriceUsd: number | undefined
  hidden: boolean
  className?: string
  style?: CSSProperties
}) {
  const fee = newestFee(blocks)
  if (fee === undefined) return null
  return (
    <div
      aria-hidden={hidden}
      style={style}
      className={cn(
        'flex h-4 items-center gap-1.5 whitespace-nowrap font-medium text-label-value-14 text-primary tabular-nums',
        hidden && 'invisible',
        className,
      )}
    >
      Blob cost
      <RollingNumber
        value={fee}
        format={(gwei) => describeBlobCost(gwei, ethPriceUsd)}
        className="font-bold"
      />
    </div>
  )
}

function newestFee(blocks: ReadonlyMap<number, ChainBlock>) {
  let newest: { slot: number; fee: number } | undefined
  for (const block of blocks.values()) {
    if (block.status !== 'proposed' || block.blobBaseFee === null) continue
    if (!newest || block.slot > newest.slot) {
      newest = { slot: block.slot, fee: block.blobBaseFee }
    }
  }
  return newest?.fee
}
