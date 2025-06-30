import clsx from 'clsx'
import type { ApiCodeSearchResponse } from '../api/types'
import { HighlightedText } from '../common/HighlightedText'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { useCodeStore } from '../components/editor/store'
import { isReadOnly } from '../config'
import { useMultiViewStore } from '../multi-view/store'
import { useSearchStore } from './store'

interface CodeSearchEntryProps {
  select: (address: string) => void
  entries: ApiCodeSearchResponse['matches']
}

export function CodeSearchResultEntry({
  select,
  entries,
}: CodeSearchEntryProps) {
  const { setOpen, searchTerm, selectedIndex } = useSearchStore()
  const { setSourceIndex, showRange } = useCodeStore()
  const { ensurePanel } = useMultiViewStore()
  const codeSearchTerm = getCodeSearchTerm(searchTerm).content

  let runningIndex = 0
  return (
    <ul>
      {entries.map((result) => (
        <li
          key={result.address}
          className="flex flex-col border-coffee-700 border-b p-2 text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="max-w-[25rem] truncate font-medium">
              {result.name ?? 'EOA'}
            </span>
            <span className="font-mono text-coffee-400 text-xs">
              {toShortenedAddress(result.address)}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {result.codeLocation.map((loc, locIndex) => {
              const itemIndex = runningIndex++

              return (
                <div
                  key={`${result.address}-${locIndex}`}
                  data-index={itemIndex}
                  className={clsx(
                    'cursor-pointer rounded px-1.5 py-0.5 font-mono text-xs',
                    itemIndex === selectedIndex
                      ? 'bg-coffee-600 text-autumn-300'
                      : 'bg-coffee-700 text-coffee-200 hover:bg-coffee-600 hover:text-autumn-300',
                  )}
                  onClick={() => {
                    ensurePanel('code')
                    select(result.address)
                    setOpen(false)
                    setSourceIndex(result.address, loc.index)
                    showRange(result.address, {
                      startOffset: loc.offset,
                      length: codeSearchTerm.length,
                    })
                  }}
                >
                  <div>{loc.fileName}</div>
                  <HighlightedText text={loc.line} run={codeSearchTerm} />
                </div>
              )
            })}
          </div>
        </li>
      ))}
    </ul>
  )
}

export interface CodeSearchTerm {
  content: string
  onSelectedAddress: boolean
}

export function isCodeSearchTerm(searchTerm: string): boolean {
  if (isReadOnly) {
    return false
  }

  return searchTerm.startsWith('%')
}

export function getCodeSearchTerm(searchTerm: string): CodeSearchTerm {
  const onSelectedAddress = searchTerm.startsWith('%%')
  const content = onSelectedAddress ? searchTerm.slice(2) : searchTerm.slice(1)
  return { content, onSelectedAddress }
}
