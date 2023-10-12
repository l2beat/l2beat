import uniq from 'lodash/uniq'
import React from 'react'

import { ScalingTvlViewEntry } from '../../../pages/scaling/tvl/types'
import { ScalingEntry } from '../../../pages/scaling/types'
import { RichSelect } from '../../RichSelect'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'
import { FiltersWrapper, generateSlugList } from './FiltersWrapper'

interface Props {
  items: ScalingEntry[]
}

export function ScalingFilters({ items }: Props) {
  const providers = uniq(items.map((i) => i.provider))
    .sort()
    .map((p) => ({
      label: p ?? 'No provider',
      value: generateSlugList(items, (i) => i.provider === p),
    }))

  const stages = uniq(items.map((i) => i.stage?.stage))
    .sort()
    .filter(noUndefined)
    .map((stage) => ({
      label: stageLabel(stage),
      value: generateSlugList(items, (i) => i.stage?.stage === stage),
    }))

  return (
    <FiltersWrapper items={items}>
      <RollupsOnlyCheckbox items={items} />
      <RichSelect label="Select stack" id="stack-select">
        {providers.map((da) => (
          <RichSelect.Item
            selectedLabel={da.label}
            key={da.label}
            value={da.value}
          >
            {da.label}
          </RichSelect.Item>
        ))}
      </RichSelect>
      <RichSelect label="Select stage" id="stage-select">
        {stages.map((stage) => (
          <RichSelect.Item
            selectedLabel={stage.label}
            key={stage.label}
            value={stage.value}
          >
            {stage.label}
          </RichSelect.Item>
        ))}
      </RichSelect>
    </FiltersWrapper>
  )
}

function stageLabel(stage: ScalingTvlViewEntry['stage']['stage']) {
  switch (stage) {
    case 'NotApplicable':
      return 'Not applicable'
    case 'UnderReview':
      return 'Under review'
    default:
      return stage
  }
}

function noUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
