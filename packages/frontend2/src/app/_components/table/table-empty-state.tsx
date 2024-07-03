import { CustomLink } from '../custom-link'

interface Props {
  onResetFilters: () => void
}

export function TableEmptyState({ onResetFilters }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-b-lg bg-blue-700/15 py-10">
      <span className="mb-4 font-semibold text-2xl">No results</span>
      <span className="mb-6">There are no results meeting the criteria</span>
      <CustomLink
        className="cursor-pointer"
        as="button"
        onClick={onResetFilters}
      >
        Reset all filters
      </CustomLink>
    </div>
  )
}
