import { IconSearch } from '../../../icons/IconSearch'
import { useSearchStore } from './store'

export function ClosedSearch() {
  const { searchTerm } = useSearchStore()
  return (
    <div className="flex min-h-[30px] w-[14rem] cursor-pointer items-center justify-between gap-1 rounded-sm border border-coffee-400 bg-coffee-800/30 pr-1 pl-2">
      <div className="flex items-center gap-1 overflow-hidden">
        <IconSearch />
        <span className="truncate text-coffee-200/80 text-xs">
          {searchTerm.length > 0 ? searchTerm : 'Search'}
        </span>
      </div>
      <KeyButton keys={[['/']]} />
    </div>
  )
}

function KeyButton(props: { keys: string[][] }) {
  return (
    <kbd className="items-center gap-1 rounded border-coffee-600 border-b-2 bg-coffee-400 px-1 text-coffee-800 text-sm leading-tight">
      {props.keys.map((key) => key.join('+')).join(' ')}
    </kbd>
  )
}
