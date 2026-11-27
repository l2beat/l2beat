import type { AverageDuration } from '~/server/features/layer2s/interop/types'
import { AvgDurationCell } from '../../table/AvgDurationCell'

export function AvgDurationStatValue({
  avgDuration,
}: {
  avgDuration: AverageDuration
}) {
  return (
    <AvgDurationCell
      averageDuration={avgDuration}
      className="font-semibold text-label-value-13 leading-4"
      splitClassName="items-stretch gap-1 font-semibold text-label-value-13 md:gap-1"
      splitItemClassName="justify-between gap-3 [&>span:first-child]:font-normal [&>span]:leading-4"
    />
  )
}
