import { IconSearch } from '../../../icons/IconSearch'
import { useSearchStore } from './store'

export function ClosedSearch() {
  const { searchTerm } = useSearchStore()
  return (
    <div className="flex w-[15rem] cursor-pointer items-center justify-between gap-1 rounded border bg-coffee-700 pr-1 pl-2">
      <div className="flex items-center gap-1 overflow-hidden">
        <IconSearch />
        <span className="truncate">
          {searchTerm.length > 0 ? searchTerm : 'Search'}
        </span>
      </div>
      <KeyButton keys={[['/']]} />
    </div>
  )
}

function KeyButton(props: { keys: string[][] }) {
  return (
    <kbd className="items-center gap-1 rounded border-coffee-600 border-b-2 bg-coffee-200 px-1 text-coffee-800 text-sm leading-tight">
      {props.keys.map((key) => key.join('+')).join(' ')}
    </kbd>
  )
}
