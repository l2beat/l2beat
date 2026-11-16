import { Kbd } from '../../../components/Kbd'
import { IconSearch } from '../../../icons/IconSearch'
import { useCommandShortcut } from '../keybindings/useCommandShortcut'
import { SCOPE_INFO } from './scopes'
import { useSearchStore } from './store'

export function ClosedSearch() {
  const scope = useSearchStore((state) => state.scope)
  const text = useSearchStore((state) => state.text)
  const shortcut = useCommandShortcut('search.open')
  const label = scope === 'all' ? text : `${SCOPE_INFO[scope].label}: ${text}`
  return (
    <div className="flex min-h-[30px] w-56 cursor-pointer items-center justify-between gap-1 rounded-xs border border-coffee-400 bg-coffee-800/30 pr-1 pl-2">
      <div className="flex items-center gap-1 overflow-hidden">
        <IconSearch />
        <span className="truncate text-coffee-200/80 text-xs">
          {label.length > 0 ? label : 'Search'}
        </span>
      </div>
      {shortcut !== undefined && <Kbd keys={[shortcut]} />}
    </div>
  )
}
