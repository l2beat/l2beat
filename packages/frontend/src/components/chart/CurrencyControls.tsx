import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ChartType } from '../../scripts/charts/types'
import { RadioGroup, RadioGroupOption } from './RadioGroup'

interface Props {
  chartType: ChartType
}

export function UnitControls(props: Props) {
  return (
    <RadioGroup
      role="chart-unit-controls"
      name={`${props.chartType.type}-unit`}
      className="transition-colors duration-200 group-data-[interactivity-disabled]/chart:bg-gray-200 dark:group-data-[interactivity-disabled]/chart:bg-zinc-700"
      optionsClassname="group-data-[interactivity-disabled]/chart:opacity-0 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none"
      options={getOptions(props.chartType)}
    />
  )
}

function getOptions(chartType: ChartType): RadioGroupOption[] {
  switch (chartType.type) {
    case 'scaling-tvl':
    case 'scaling-detailed-tvl':
    case 'bridges-tvl':
    case 'project-tvl':
    case 'project-token-tvl':
    case 'project-detailed-tvl':
    case 'storybook-fake-tvl':
    case 'storybook-fake-detailed-tvl':
    case 'scaling-activity':
    case 'project-activity':
    case 'storybook-fake-activity':
      return [{ value: 'USD', checked: true }, { value: 'ETH' }]
    case 'scaling-costs':
    case 'project-costs':
    case 'storybook-fake-costs':
      return [
        { value: 'USD', checked: true },
        { value: 'ETH' },
        { value: 'GAS' },
      ]
    default:
      assertUnreachable(chartType)
  }
}
