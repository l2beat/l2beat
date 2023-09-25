import { uniq } from 'lodash'
import React from 'react'

import { ScalingTvlViewEntry } from '../../../pages/scaling/tvl/types'
import { Select } from '../../Select'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'
import { FiltersWrapper, generateSlugList } from './FiltersWrapper'

interface Props {
  items: ScalingTvlViewEntry[]
}

export function ScalingTvlFilters({ items }: Props) {
  const providers = uniq(items.map((i) => i.provider))
    .sort()
    .map((p) => ({
      label: p ?? 'No provider',
      value: generateSlugList(items, (i) => i.provider === p),
    }))

  const stages = uniq(items.map((i) => i.stage.stage))
    .sort()
    .map((stage) => ({
      label: stageLabel(stage),
      value: generateSlugList(items, (i) => i.stage.stage === stage),
    }))

  return (
    <FiltersWrapper items={items}>
      <RollupsOnlyCheckbox items={items} />
      <Select label="Select stack" items={providers} id="stack-select" />
      <Select label="Select stage" items={stages} id="stage-select" />
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
