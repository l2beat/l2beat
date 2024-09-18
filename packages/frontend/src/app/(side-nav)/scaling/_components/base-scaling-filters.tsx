import { type StageConfig } from '@l2beat/config'
import { compact, uniq } from 'lodash'
import React from 'react'
import { Checkbox } from '~/components/core/checkbox'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { useScalingFilterValues } from './scaling-filter-context'

interface Props {
  items: CommonScalingEntry[]
  showRollupsOnly?: boolean
  additionalFilters?: React.ReactNode
}

export function BaseScalingFilters({
  items,
  showRollupsOnly,
  additionalFilters,
}: Props) {
  const filter = useScalingFilterValues()
  const typeOptions = uniq(items.map((item) => item.category))
    .sort()
    .filter((value) => !!value)
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

  const isRollupInItems = items.some((item) =>
    item.category?.includes('Rollup'),
  )

  const raasOptions = uniq(
    items
      .flatMap((item) => item.badges ?? [])
      .filter((badge) => badge.kind === 'RaaS')
      .map((badge) => badge.badge),
  )
    .sort()
    .map((badge) => ({
      label: badge,
      value: badge,
    }))

  return (
    <OverflowWrapper>
      <div className="flex flex-row space-x-2">
        {showRollupsOnly && (
          <Checkbox
            id="rollups-only"
            onCheckedChange={(checked) =>
              filter.set({ rollupsOnly: !!checked })
            }
            disabled={!isRollupInItems}
          >
            Rollups only
          </Checkbox>
        )}
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
        <TableFilter
          title="RaaS"
          options={raasOptions}
          value={filter.badgeRaaS}
          onValueChange={(value) => filter.set({ badgeRaaS: value })}
        />
        {additionalFilters}
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
