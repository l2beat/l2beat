import { formatSeconds } from '@l2beat/shared-pure'
import { type Row, createColumnHelper } from '@tanstack/react-table'
import { Badge } from '~/components/badge/badge'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { sortTwoRowCell } from '~/components/table/sorting/functions/sort-two-row-cell'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
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
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip showOnlyRollupsDefinitions />,
    },
  }),
  columnHelper.accessor('dataAvailabilityMode.value', {
    header: 'DA Mode',
    cell: (ctx) => {
      const daMode = ctx.row.original.dataAvailabilityMode
      if (!daMode) {
        return <span>&mdash;</span>
      }

      return (
        <TwoRowCell>
          <TwoRowCell.First>{daMode.value}</TwoRowCell.First>
          {daMode.secondLine && (
            <TwoRowCell.Second>{daMode.secondLine}</TwoRowCell.Second>
          )}
        </TwoRowCell>
      )
    },
    meta: {
      cellClassName: 'whitespace-nowrap',
      tooltip:
        'The type shows whether projects are posting transaction data batches or state diffs to the L1.',
    },
    sortingFn: (a, b) =>
      sortTwoRowCell(
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
          syncStatus={data.syncStatus}
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
            syncStatus={data.syncStatus}
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
