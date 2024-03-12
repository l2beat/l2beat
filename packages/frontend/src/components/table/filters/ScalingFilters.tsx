import { notUndefined } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import React, { ReactElement } from 'react'

import { ScalingL2SummaryViewEntry } from '../../../pages/scaling/summary/types'
import { ScalingEntry } from '../../../pages/scaling/types'
import { OverflowWrapper } from '../../OverflowWrapper'
import { RichSelect, RichSelectProps } from '../../RichSelect'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'
import { FiltersWrapper, generateSlugList } from './FiltersWrapper'

interface Props {
  children?: ReactElement<RichSelectProps>
  items: ScalingEntry[]
  hideRollupsOnlyCheckbox?: boolean
}

export function ScalingFilters({
  children,
  items,
  hideRollupsOnlyCheckbox,
}: Props) {
  const providers = uniq(items.map((i) => i.provider))
    .sort()
    .map((p) => ({
      label: p ?? 'No provider',
      value: generateSlugList(items, (i) => i.provider === p),
    }))

  const stages = uniq(items.map((i) => i.stage?.stage))
    .sort()
    .filter(notUndefined)
    .map((stage) => ({
      label: stageLabel(stage),
      value: generateSlugList(items, (i) => i.stage?.stage === stage),
    }))

  const categories = uniq(items.map((i) => i.category))
    .sort()
    .filter(notUndefined)
    .map((category) => ({
      label: category,
      value: generateSlugList(items, (i) => i.category === category),
    }))

  const purposes = uniq(items.flatMap((i) => i.purposes))
    .sort()
    .filter(notUndefined)
    .map((purpose) => ({
      label: purpose,
      value: generateSlugList(items, (i) => !!i.purposes?.includes(purpose)),
    }))

  return (
    <OverflowWrapper>
      <FiltersWrapper>
        {!hideRollupsOnlyCheckbox && <RollupsOnlyCheckbox items={items} />}
        <RichSelect label="Type" id="technology-select">
          {categories.map((category) => (
            <RichSelect.Item
              selectedLabel={category.label}
              key={category.label}
              value={category.value}
            >
              {category.label}
            </RichSelect.Item>
          ))}
        </RichSelect>
        <RichSelect label="Stack" id="stack-select">
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
        <RichSelect label="Stage" id="stage-select">
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
        <RichSelect label="Purpose" id="purpose-select">
          {purposes.map((stage) => (
            <RichSelect.Item
              selectedLabel={stage.label}
              key={stage.label}
              value={stage.value}
            >
              {stage.label}
            </RichSelect.Item>
          ))}
        </RichSelect>
        {children}
      </FiltersWrapper>
    </OverflowWrapper>
  )
}

function stageLabel(stage: ScalingL2SummaryViewEntry['stage']['stage']) {
  switch (stage) {
    case 'NotApplicable':
      return 'Not applicable'
    case 'UnderReview':
      return 'Under review'
    default:
      return stage
  }
}
