import React from 'react'

import { ActivityViewEntry } from '../../../pages/scaling-activity/view/types'
import { ScalingDetailedTvlViewEntry } from '../../../pages/scaling-detailedTvl/types'
import { ScalingRiskViewEntry } from '../../../pages/scaling-risk/view/types'
import { ScalingTvlViewEntry } from '../../../pages/scaling-tvl/types'

interface ProjectFilters<
  T extends
    | ScalingTvlViewEntry
    | ScalingRiskViewEntry
    | ActivityViewEntry
    | ScalingDetailedTvlViewEntry,
> {
  items: T[]
  children: React.ReactNode
}

export function FiltersWrapper<
  T extends
    | ScalingTvlViewEntry
    | ScalingRiskViewEntry
    | ActivityViewEntry
    | ScalingDetailedTvlViewEntry,
>({ items, children }: ProjectFilters<T>) {
  return (
    <div
      id="project-filters"
      className="flex gap-4"
      data-all-slugs={generateSlugList(items)}
    >
      {children}
    </div>
  )
}

export function generateSlugList<
  T extends
    | ScalingTvlViewEntry
    | ScalingRiskViewEntry
    | ActivityViewEntry
    | ScalingDetailedTvlViewEntry,
>(items: T[], check?: (item: T) => boolean): string {
  let result = [...items]

  if (check) {
    result = result.filter(check)
  }

  return result.map((i) => i.slug).join(',')
}
