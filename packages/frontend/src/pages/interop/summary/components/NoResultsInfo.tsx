import { EmptyStateIcon } from '~/icons/EmptyState'

export function NoResultsInfo() {
  return (
    <div className="mt-2.5 flex h-full min-h-40 items-center justify-center rounded-sm bg-surface-secondary p-4">
      <div className="flex flex-col items-center">
        <EmptyStateIcon className="mb-4 size-10 fill-yellow-700 dark:fill-yellow-200" />
        <span className="mb-2 font-bold text-heading-20">No results</span>
        <div className="text-balance text-center font-normal text-paragraph-14">
          There are no results meeting the criteria, with the current chain
          selection.
        </div>
      </div>
    </div>
  )
}
