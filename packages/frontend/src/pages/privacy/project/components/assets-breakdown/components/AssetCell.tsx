import type { Row } from '@tanstack/react-table'
import { ChevronIcon } from '~/icons/Chevron'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'

export function AssetCell({ row }: { row: Row<PrivacyAsset> }) {
  const asset = row.original
  const isExpandable = row.getCanExpand()
  const isExpanded = row.getIsExpanded()

  if (!isExpandable) {
    return (
      <div className="flex items-center gap-1.5">
        <img
          src={asset.iconUrl}
          alt={asset.symbol}
          className="size-5 shrink-0"
        />
        <span>{asset.symbol}</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 text-left"
      aria-expanded={isExpanded}
      onClick={row.getToggleExpandedHandler()}
    >
      <div className="flex shrink-0 items-center gap-1.5">
        <img
          src={asset.iconUrl}
          alt={asset.symbol}
          className="size-5 shrink-0"
        />
        <span>{asset.symbol}</span>
      </div>
      <ChevronIcon
        className={cn(
          'size-3 shrink-0 fill-brand transition-transform duration-200',
          isExpanded && 'rotate-180',
        )}
      />
    </button>
  )
}
