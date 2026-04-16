import type React from 'react'
import { useId, useState } from 'react'
import { TableCell, TableRow } from '~/components/table/Table'
import { ChevronIcon } from '~/icons/Chevron'
import type { PrivacyAssetSnapshot } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'

interface Props {
  asset: PrivacyAssetSnapshot
  idPrefix: string
  colSpan: number
  children: React.ReactNode
  detail: React.ReactNode
}

export function PrivacyExpandableAssetRow({
  asset,
  idPrefix,
  colSpan,
  children,
  detail,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const detailId = `${idPrefix}-${useId()}`
  const isExpandable = asset.bucketCount > 1

  return (
    <>
      <TableRow
        highlightId={asset.symbol}
        className={cn(isOpen && isExpandable && 'border-b-0')}
      >
        <TableCell className="font-bold text-base">
          {isExpandable ? (
            <button
              type="button"
              className="flex w-full items-center gap-2 text-left"
              aria-expanded={isOpen}
              aria-controls={detailId}
              onClick={() => setIsOpen((open) => !open)}
            >
              <ChevronIcon
                className={cn(
                  'size-3 shrink-0 fill-brand transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
              <span>{asset.symbol}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span aria-hidden className="size-3 shrink-0" />
              <span>{asset.symbol}</span>
            </div>
          )}
        </TableCell>
        {children}
      </TableRow>
      {isExpandable && isOpen && (
        <tr
          id={detailId}
          className="border-divider border-b bg-surface-secondary/30"
        >
          <td colSpan={colSpan} className="px-3 pb-3 md:px-4">
            {detail}
          </td>
        </tr>
      )}
    </>
  )
}
