import { EM_DASH } from '~/consts/characters'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

type FallbackDisplay = {
  firstLine: string
  secondLine?: string
}

export function DaFallbackCell({ entry }: { entry: DaSummaryEntry }) {
  const display = translateFallback(entry.fallback)

  if (!display) {
    return EM_DASH
  }

  return (
    <div className="flex flex-col gap-0">
      <span className="text-sm font-medium leading-5">{display.firstLine}</span>
      {display.secondLine && (
        <span className="text-xs leading-none text-gray-500">
          {display.secondLine}
        </span>
      )}
    </div>
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
