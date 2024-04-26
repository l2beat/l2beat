import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ChartType } from '../../scripts/charts/types'
import { cn } from '../../utils/cn'
import { RadioGroup, RadioGroupOption } from './RadioGroup'

interface Props {
  chartType: ChartType
  isMetaChart: boolean
}

export function RangeControls({ chartType, isMetaChart }: Props) {
  const options = getOptions(chartType)
  return (
    <RadioGroup
      role="chart-range-controls"
      name={`${chartType.type}-range`}
      className={cn(
        'transition-colors duration-200 group-data-[interactivity-disabled]/chart:bg-gray-200 dark:group-data-[interactivity-disabled]/chart:bg-zinc-700',
        isMetaChart && 'hidden',
      )}
      optionsClassname="group-data-[interactivity-disabled]/chart:opacity-0 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none"
      options={options}
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
      return [
        {
          value: '7D',
        },
        {
          value: '30D',
        },
        {
          value: '90D',
          className: '!hidden sm:!block',
        },
        {
          value: '180D',
          className: '!hidden sm:!block',
        },
        {
          value: '1Y',
          checked: true,
        },
        {
          value: 'MAX',
        },
      ]
    case 'scaling-activity':
    case 'project-activity':
    case 'storybook-fake-activity':
      return [
        {
          value: '30D',
        },
        {
          value: '90D',
          className: '!hidden sm:!block',
        },
        {
          value: '180D',
          className: '!hidden sm:!block',
        },
        {
          value: '1Y',
          checked: true,
        },
        {
          value: 'MAX',
        },
      ]
    case 'scaling-costs':
    case 'project-costs':
    case 'storybook-fake-costs':
      return [
        {
          value: '1D',
        },
        {
          value: '7D',
          checked: true,
        },
        {
          value: '30D',
        },
        {
          value: '90D',
        },
        {
          value: '180D',
        },
      ]
    default:
      assertUnreachable(chartType)
  }
}
