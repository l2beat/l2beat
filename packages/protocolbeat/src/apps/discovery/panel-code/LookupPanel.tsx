import { useEffect } from 'react'
import { IconClose } from '../../../icons/IconClose'
import { rowsOf, title } from './lookupRows'
import type { CodeLocation, DefinitionLookup } from './useGoToDefinition'

const MESSAGE_DURATION_MS = 3000

export function LookupPanel(props: {
  lookup: DefinitionLookup
  onPick: (location: CodeLocation, keepOpen: boolean) => void
  onDismiss: () => void
}) {
  const { lookup, onPick, onDismiss } = props
  const rows = rowsOf(lookup)

  useEffect(() => {
    if (rows.length > 0 || lookup.status === 'references') {
      return
    }
    const timeout = setTimeout(onDismiss, MESSAGE_DURATION_MS)
    return () => clearTimeout(timeout)
  }, [lookup])

  return (
    <div className="absolute top-8 right-3 z-20 w-[28rem] rounded border border-coffee-600 bg-coffee-800 text-xs shadow-lg">
      <div className="flex items-center justify-between gap-2 border-coffee-600 border-b px-2 py-1">
        <span className="truncate font-mono text-coffee-200">
          {title(lookup)}
        </span>
        <button type="button" onClick={onDismiss} aria-label="Close">
          <IconClose className="text-coffee-400 hover:text-coffee-200" />
        </button>
      </div>
      {rows.length > 0 && (
        <ul className="max-h-80 overflow-y-auto">
          {rows.map((row) => (
            <li
              key={`${row.location.address}-${row.location.sourceIndex}-${row.location.offset}`}
            >
              <button
                type="button"
                className="flex w-full flex-col items-start px-2 py-1 text-left hover:bg-coffee-600"
                onClick={() =>
                  onPick(row.location, lookup.status === 'references')
                }
              >
                <span className="w-full truncate font-mono text-autumn-300">
                  {row.headline}
                </span>
                <span className="text-coffee-400">{row.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
