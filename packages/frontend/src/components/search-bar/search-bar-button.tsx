'use client'

import { SearchIcon } from '~/icons/search'
import { useSearchBarContext } from './search-bar-context'

export function SearchBarButton() {
  const { setOpen } = useSearchBarContext()
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      className="border-divider bg-surface-primary text-secondary focus-visible:outline-hidden focus-visible:ring-brand flex h-10 w-72 items-center rounded-lg border p-2.5 focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <SearchIcon className="size-5" />
      <span className="ml-2 text-sm font-medium">Search</span>
      <kbd className="bg-icon-secondary text-2xs text-primary-invert ml-auto flex size-5 select-none items-center justify-center rounded-sm border border-none px-1.5 font-mono font-bold leading-none">
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
