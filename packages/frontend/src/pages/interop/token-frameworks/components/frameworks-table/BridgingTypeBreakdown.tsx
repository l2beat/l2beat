import { Breakdown } from '~/components/breakdown/Breakdown'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '~/pages/interop/utils/display'
import type { FrameworkBridgingTypeItem } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { cn } from '~/utils/cn'
import { RowStats } from './Rows'

export function BridgingTypeBreakdown({
  items,
}: {
  items: FrameworkBridgingTypeItem[]
}) {
  return (
    <div className="flex flex-col gap-2">
      <Breakdown
        className="h-2 w-full"
        gap={2}
        values={items.map((item) => ({
          value: item.volume,
          className: INTEROP_TYPE_TO_BG_COLOR[item.type],
        }))}
      />
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {items.map((item) => (
          <div
            key={item.type}
            className="flex items-center gap-1 text-label-value-12 text-secondary"
          >
            <span
              className={cn(
                'size-2 rounded-full',
                INTEROP_TYPE_TO_BG_COLOR[item.type],
              )}
            />
            <span className="font-medium">
              {TRANSFER_TYPE_DISPLAY[item.type].label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <div
            key={item.type}
            className="flex items-center justify-between gap-2 text-label-value-13"
          >
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  INTEROP_TYPE_TO_BG_COLOR[item.type],
                )}
              />
              <span className="truncate font-medium">
                {TRANSFER_TYPE_DISPLAY[item.type].label}
              </span>
            </div>
            <RowStats volume={item.volume} transferCount={item.transferCount} />
          </div>
        ))}
      </div>
    </div>
  )
}
