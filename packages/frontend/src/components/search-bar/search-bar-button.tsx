'use client'

import { SearchIcon } from '~/icons/search'
import { useSearchBarContext } from './search-bar-context'

export function SearchBarButton() {
  const { setOpen } = useSearchBarContext()
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      className="flex h-10 w-72 items-center rounded-lg border border-divider bg-surface-primary p-2.5 text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <SearchIcon className="size-5" />
      <span className="ml-2 text-sm font-medium">Search</span>
      <kbd className="ml-auto flex size-5 select-none items-center justify-center rounded border border-none bg-icon-secondary px-1.5 font-mono text-2xs font-bold leading-none text-primary-invert">
        /
      </kbd>
    </button>
  )
}

export function SmallSearchBarButton() {
  const { setOpen } = useSearchBarContext()
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      className="flex size-6 items-center justify-center"
    >
      <SearchIcon className="size-6" />
    </button>
  )
}
