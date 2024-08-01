import { type StageConfig } from '@l2beat/config'
import { compact, uniq } from 'lodash'
import React from 'react'
import { Checkbox } from '~/app/_components/checkbox'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import { TableFilter } from '~/app/_components/table/filters/table-filter'
import { useScalingFilterValues } from './scaling-filter-context'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'

interface Props {
  items: CommonScalingEntry[]
  additionalFilters?: React.ReactNode
}

export function BaseScalingFilters({ items, additionalFilters }: Props) {
  const filter = useScalingFilterValues()
  const typeOptions = uniq(items.map((item) => item.category))
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const stackOptions = uniq(items.map((item) => item.provider))
    .sort()
    .map((value) => ({
      label: value ?? 'No stack',
      value,
    }))

  const stageOptions = uniq(
    compact(
      items.map((item) => {
        if ('stage' in item) {
          return item.stage?.stage
        }
      }),
    ),
  )
    .sort()
    .map((value) => ({
      label: stageLabel(value),
      value,
    }))

  const purposeOptions = uniq(items.flatMap((item) => item.purposes))
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const isRollupInItems = items.some((item) => item.category.includes('Rollup'))

  return (
    <OverflowWrapper>
      <div className="flex flex-row justify-between space-x-2">
        <div className="flex space-x-2">
          <Checkbox
            id="rollups-only"
            onCheckedChange={(checked) =>
              filter.set({ rollupsOnly: !!checked })
            }
            disabled={!isRollupInItems}
          >
            Rollups only
          </Checkbox>
          <TableFilter
            title="Type"
            options={typeOptions}
            value={filter.category}
            onValueChange={(value) => filter.set({ category: value })}
          />
          <TableFilter
            title="Stack"
            options={stackOptions}
            value={filter.stack}
            onValueChange={(value) => filter.set({ stack: value })}
          />
          <TableFilter
            title="Stage"
            options={stageOptions}
            value={filter.stage}
            onValueChange={(value) => filter.set({ stage: value })}
          />
          <TableFilter
            title="Purpose"
            options={purposeOptions}
            value={filter.purpose}
            onValueChange={(value) => filter.set({ purpose: value })}
          />
          {additionalFilters}
        </div>

        <Checkbox
          onCheckedChange={(checked) => filter.set({ rollupsOnly: !!checked })}
          disabled={!isRollupInItems}
          id={'exclude-associated-tokens'}
        >
          Exclude associated tokens
        </Checkbox>
      </div>
    </OverflowWrapper>
  )
}

function stageLabel(stage: StageConfig['stage']) {
  switch (stage) {
    case 'NotApplicable':
      return 'Not applicable'
    case 'UnderReview':
      return 'Under review'
    default:
      return stage
  }
}
