'use client'

import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { CustomLink } from '../link/custom-link'

export function TableEmptyState() {
  const filter = useScalingFilter()
  return (
    <div className="flex flex-col items-center justify-center rounded-b-lg bg-blue-700/15 py-10">
      <span className="mb-4 text-2xl font-semibold">No results</span>
      <span className="mb-6">There are no results meeting the criteria</span>
      <CustomLink className="cursor-pointer" as="button" onClick={filter.reset}>
        Reset all filters
      </CustomLink>
    </div>
  )
}
