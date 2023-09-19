import { uniq } from 'lodash'
import React from 'react'

import { ScalingTvlViewEntry } from '../../../pages/scaling-tvl/types'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'

interface Props {
  items: ScalingTvlViewEntry[]
}

export function ProjectFilters({ items }: Props) {
  const providers = uniq(items.map((i) => i.provider)).sort()
  const stages = uniq(items.map((i) => i.stage.stage)).sort()
  return (
    <div
      id="project-filters"
      className="flex gap-4"
      data-slugs={generateSlugList(items)}
    >
      <RollupsOnlyCheckbox items={items} />
      <select
        className="rounded bg-gray-200 px-4 py-2 dark:bg-gray-750"
        id="provider-select-filter"
      >
        <option value="">Providers</option>
        {providers.map((provider, index) => (
          <option
            key={index}
            value={generateSlugList(items, (i) => i.provider === provider)}
          >
            {provider ?? 'No provider'}
          </option>
        ))}
      </select>

      <select
        className="rounded bg-gray-200 px-4 py-2 dark:bg-gray-750"
        id="stages-select-filter"
      >
        <option value="">Stages</option>
        {stages.map((stage, index) => (
          <option
            key={index}
            value={generateSlugList(items, (i) => i.stage.stage === stage)}
          >
            {stage}
          </option>
        ))}
      </select>
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
