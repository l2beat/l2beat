import type { ApiAddressEntry } from '../../../api/types'
import { cn } from '../../../utils/cn'
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
          className={cn(
            'grid min-h-[29px] cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-coffee-800 border-b px-3 text-[13px] text-coffee-200',
            index === selectedIndex
              ? 'bg-coffee-700 shadow-[inset_2px_0_0_#BAD80A]'
              : 'hover:bg-coffee-800',
          )}
          onClick={() => {
            select([result.address])
            setOpen(false)
          }}
        >
          <span className="min-w-0 truncate font-medium">
            <HighlightedText text={result.name ?? 'EOA'} run={searchTerm} />
          </span>
          <span className="truncate text-right font-mono text-coffee-300 text-xs">
            {toShortenedAddress(result.address)}
          </span>
        </li>
      ))}
    </ul>
  )
}
