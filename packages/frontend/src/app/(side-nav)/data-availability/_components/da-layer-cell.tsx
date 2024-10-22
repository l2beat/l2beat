import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { kindToType } from '~/server/features/data-availability/utils/kind-to-layer-type'

export function DaLayerCell({
  entry,
}: { entry: DaRiskEntry | DaSummaryEntry }) {
  return (
    <div className="flex flex-col gap-0">
      <span className="text-base font-bold leading-5">{entry.name}</span>
      <span className="text-[13px] font-medium leading-none text-gray-500">
        {kindToType(entry.kind)}
      </span>
    </div>
  )
}
