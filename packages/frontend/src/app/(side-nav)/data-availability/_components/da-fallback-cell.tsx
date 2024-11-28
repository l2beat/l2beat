import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

export function DaFallbackCell({
  fallback,
}: { fallback: DaSummaryEntry['fallback'] }) {
  const value = fallback ? fallback.value : 'None'

  return (
    <TwoRowCell>
      <TwoRowCell.First className="leading-5">{value}</TwoRowCell.First>
      {fallback?.secondLine && (
        <TwoRowCell.Second>{fallback.secondLine}</TwoRowCell.Second>
      )}
    </TwoRowCell>
  )
}
