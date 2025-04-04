import { IconSearch } from '../icons/IconSearch'

interface ClosedSearchProps {
  onClick: () => void
}

export function ClosedSearch({ onClick }: ClosedSearchProps) {
  return (
    <div
      className="flex min-w-[20rem] cursor-pointer justify-center rounded border bg-coffee-700"
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        <IconSearch />
        <span>Search</span>
      </div>
    </div>
  )
}
