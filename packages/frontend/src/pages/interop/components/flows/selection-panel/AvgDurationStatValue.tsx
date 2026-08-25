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
      className="font-semibold text-[13px] leading-[1.15]"
      splitClassName="items-stretch font-semibold text-[13px] md:gap-0.5"
      splitItemClassName="justify-between gap-3"
    />
  )
}
