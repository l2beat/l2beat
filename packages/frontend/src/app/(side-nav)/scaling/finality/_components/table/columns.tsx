import { formatSeconds } from '@l2beat/shared-pure'
import type { Row } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '~/components/badge/badge'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/type-info'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sort-table-values'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import type { ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { FinalityDurationCell } from './finality-duration-cell'

const sortFinality =
  (key: 'timeToInclusion' | 'stateUpdateDelay') =>
  (a: Row<ScalingFinalityEntry>, b: Row<ScalingFinalityEntry>) => {
    const aVal = a.original.data?.[key]?.averageInSeconds
    const bVal = b.original.data?.[key]?.averageInSeconds

    if (!aVal || !bVal) {
      return -1
    }

    return aVal - bVal
  }
const columnHelper = createColumnHelper<ScalingFinalityEntry>()

export const scalingFinalityColumns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeInfo stack={ctx.row.original.stack}>{ctx.getValue()}</TypeInfo>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip showOnlyRollupsDefinitions />,
    },
  }),
  columnHelper.accessor((e) => adjustTableValue(e.dataAvailabilityMode), {
    header: 'DA Mode',
    meta: {
      cellClassName: 'whitespace-nowrap',
      tooltip:
        'The type shows whether projects are posting transaction data batches or state diffs to the L1.',
    },
    cell: (ctx) => (
      <TableValueCell
        emptyMode="em-dash"
        value={ctx.row.original.dataAvailabilityMode}
      />
    ),
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.dataAvailabilityMode,
        b.original.dataAvailabilityMode,
      ),
  }),
  columnHelper.accessor('data', {
    id: 'timeToInclusion',
    header: 'Past day avg.\nTime to inclusion',
    cell: (ctx) => {
      const { data } = ctx.row.original
      return (
        <FinalityDurationCell
          scope="timeToInclusion"
          warning={data.timeToInclusion.warning}
          timings={data.timeToInclusion}
          isSynced={data.isSynced}
        />
      )
    },
    sortUndefined: 'last',
    sortingFn: sortFinality('timeToInclusion'),
    meta: {
      tooltip:
        'The average time it would take for an L2 transaction to be included on the L1. Please note, this is an approximate estimation and is different than Time to finality since it ignores the overhead time to reach L1 finality after L1 inclusion.',
    },
  }),
  columnHelper.accessor('data.stateUpdateDelay.averageInSeconds', {
    id: 'stateUpdateDelay',
    header: 'State update\ndelay',
    cell: (ctx) => {
      const { data } = ctx.row.original
      return data?.stateUpdateDelay ? (
        data.stateUpdateDelay.averageInSeconds <= 0 ? (
          'None'
        ) : (
          <FinalityDurationCell
            scope="stateUpdateDelay"
            warning={data.stateUpdateDelay.warning}
            timings={data.stateUpdateDelay}
            isSynced={data.isSynced}
          />
        )
      ) : (
        <Badge type="gray">COMING SOON</Badge>
      )
    },
    sortUndefined: 'last',
    sortingFn: sortFinality('stateUpdateDelay'),
    meta: {
      tooltip:
        'Time interval between time to inclusion and state root submission.',
    },
  }),
  columnHelper.accessor('finalizationPeriod', {
    header: 'Execution\nDelay',
    cell: (ctx) => {
      const period = ctx.getValue()
      const value = period
        ? formatSeconds(period, {
            fullUnit: false,
          })
        : 'None'

      return <span className="w-[25px]">{value}</span>
    },
    meta: {
      tooltip:
        'Time interval between state root submission and state root finalization. For Optimistic Rollups, this usually corresponds to the challenge period, whereas for ZK Rollups, it might be added as a safety precaution.',
    },
  }),
]
