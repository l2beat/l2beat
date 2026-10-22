import clsx from 'clsx'
import type { ApiAddressEntry } from '../../../api/types'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { HighlightedText } from './HighlightedText'
import { useSearchStore } from './store'

interface ContractSearchEntryProps {
  select: (address: string[]) => void
  entries: ApiAddressEntry[]
}

export function ContractSearchResultEntry({
  select,
  entries,
}: ContractSearchEntryProps) {
  const setOpen = useSearchStore((state) => state.setOpen)
  const searchTerm = useSearchStore((state) => state.searchTerm)
  const selectedIndex = useSearchStore((state) => state.selectedIndex)

  return (
    <ul>
      {entries.map((result, index) => (
        <li
          key={result.address}
          data-index={index}
          className={clsx(
            'flex cursor-pointer items-center gap-2 border-coffee-700 border-b p-1 px-2 text-sm',
            index === selectedIndex
              ? 'bg-coffee-700 text-autumn-300'
              : 'text-coffee-200 hover:bg-coffee-700',
          )}
          onClick={() => {
            select([result.address])
            setOpen(false)
          }}
        >
          <span className="max-w-100 truncate font-medium">
            <HighlightedText text={result.name ?? 'EOA'} run={searchTerm} />
          </span>
          <span className="truncate font-mono text-coffee-400">
            {toShortenedAddress(result.address)}
          </span>
        </li>
      ))}
    </ul>
  )
}
