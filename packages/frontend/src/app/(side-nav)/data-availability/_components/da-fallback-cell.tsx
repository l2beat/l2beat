import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

type FallbackDisplay = {
  firstLine: string
  secondLine?: string
}

export function DaFallbackCell({ entry }: { entry: DaSummaryEntry }) {
  const display = translateFallback(entry.fallback)

  const value = display ? display.firstLine : 'None'

  return (
    <TwoRowCell>
      <TwoRowCell.First className="leading-5">{value}</TwoRowCell.First>
      {display?.secondLine && (
        <TwoRowCell.Second>{display.secondLine}</TwoRowCell.Second>
      )}
    </TwoRowCell>
  )
}

function translateFallback(
  fallback: DaSummaryEntry['fallback'],
): FallbackDisplay | null {
  switch (fallback) {
    case 'Ethereum (blobs or calldata)':
      return {
        firstLine: 'Ethereum)',
        secondLine: 'Blobs/Calldata',
      }
    case 'Ethereum (blobs)':
      return {
        firstLine: 'Ethereum',
        secondLine: 'Blobs',
      }
    case 'Ethereum (calldata)':
      return {
        firstLine: 'Ethereum',
        secondLine: 'Calldata',
      }
    default:
      return fallback
        ? {
            firstLine: fallback,
          }
        : null
  }
}
