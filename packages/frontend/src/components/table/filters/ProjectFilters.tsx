import { uniq } from 'lodash'
import React from 'react'

import { ScalingTvlViewEntry } from '../../../pages/scaling-tvl/types'
import { Select } from '../../Select'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'

interface Props {
  items: ScalingTvlViewEntry[]
}

export function ProjectFilters({ items }: Props) {
  const providers = uniq(items.map((i) => i.provider))
    .sort()
    .map((p) => ({
      label: p ?? 'No provider',
      value: generateSlugList(items, (i) => i.provider === p),
    }))

  const stages = uniq(items.map((i) => i.stage.stage))
    .sort()
    .map((stage) => ({
      label: stage ?? '',
      value: generateSlugList(items, (i) => i.stage.stage === stage),
    }))

  return (
    <div
      id="project-filters"
      className="flex gap-4"
      data-all-slugs={generateSlugList(items)}
    >
      <RollupsOnlyCheckbox items={items} />
      <Select label="Select stack" items={providers} id="filter-stack-select" />
      <Select label="Select stage" items={stages} id="filter-stage-select" />
    </div>
  )
}

function generateSlugList(
  items: ScalingTvlViewEntry[],
  check?: (item: ScalingTvlViewEntry) => boolean,
): string {
  let result = [...items]

  if (check) {
    result = result.filter(check)
  }

  return result.map((i) => i.slug).join(',')
}
