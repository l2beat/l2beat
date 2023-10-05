import React from 'react'

import { ScalingEntry } from '../../../pages/scaling'

interface ProjectFilters<T extends ScalingEntry> {
  items: T[]
  children: React.ReactNode
}

export function FiltersWrapper<T extends ScalingEntry>({
  items,
  children,
}: ProjectFilters<T>) {
  return (
    <div
      id="project-filters"
      className="flex flex-wrap gap-4"
      data-all-slugs={JSON.stringify(generateSlugList(items))}
    >
      {children}
    </div>
  )
}

export function generateSlugList<T extends ScalingEntry>(
  items: T[],
  check?: (item: T) => boolean,
): string[] {
  let result = [...items]

  if (check) {
    result = result.filter(check)
  }

  return result.map((i) => i.slug)
}
