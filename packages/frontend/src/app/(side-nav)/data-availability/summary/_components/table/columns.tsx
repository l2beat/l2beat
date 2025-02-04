import type { Row } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/da-common-project-columns'
import { EM_DASH } from '~/consts/characters'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'
import { DacMembersCell } from '../../../_components/dac-members-cell'
import { virtual, withSpanByBridges } from '../../../_utils/col-utils'

const columnHelper = createColumnHelper<DaSummaryEntry>()

export const [indexColumn, logoColumn] = getDaCommonProjectColumns(columnHelper)

const daLayerColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
})

const daRisksColumn = columnHelper.display({
  id: 'da-risks',
  header: 'DA Risks',
  cell: (ctx) => {
    return <GrissiniCell values={ctx.row.original.risks} />
  },
  meta: {
    align: 'center',
  },
})

const daBridgeRisksColumn = columnHelper.display({
  id: 'bridge-risks',
  header: 'Bridge Risks',
  cell: (ctx) => {
    const [bridge] = ctx.row.original.bridges
    if (!bridge) {
      return EM_DASH
    }
    return (
      <GrissiniCell
        values={bridge.risks.values}
        hasNoBridge={bridge.risks.isNoBridge}
      />
    )
  },
  meta: {
    align: 'center',
  },
})

const tvsColumn = columnHelper.accessor('tvs', {
  header: 'TVS',
  cell: (ctx) => (
    <div className="w-full pr-5 text-right text-sm font-medium">
      {formatDollarValueNumber(ctx.row.original.tvs)}
    </div>
  ),
  meta: {
    tooltip:
      'Total value secured (TVS) is the sum of the total value secured across all L2s & L3s that use this DA layer and are listed on L2BEAT. It does not include the TVS of sovereign rollups.',
    align: 'right',
  },
})

const slashableStakeColumn = columnHelper.accessor('economicSecurity', {
  header: () => <span className="text-right">Slashable</span>,
  cell: (ctx) => {
    const value = ctx.getValue()

    return (
      <div className="w-full pr-[18px] text-right text-xs font-medium md:text-sm">
        {formatDollarValueNumber(value ?? 0)}
      </div>
    )
  },
  sortingFn: sortSlashableStake,
  meta: {
    align: 'right',
    tooltip:
      'The assets that are slashable in case of a data withholding attack. For public blockchains, it is equal to 2/3 of the total validating stake.',
  },
})

const membersColumn = columnHelper.display({
  header: 'Members',
  cell: (ctx) => (
    <DacMembersCell dacInfo={ctx.row.original.bridges[0]?.dacInfo} />
  ),
})

const challengeMechanismColumn = columnHelper.display({
  header: 'Challenge\nmechanism',
  cell: (ctx) => (
    <TableValueCell
      value={{ value: ctx.row.original.challengeMechanism ?? '' }}
    />
  ),
  meta: {
    tooltip:
      'Shows if there is a mechanism that  users to dispute the availability or accuracy of data committed by the DA provider',
  },
})

const fallbackColumn = columnHelper.display({
  header: 'Fallback',
  cell: (ctx) => (
    <TableValueCell value={ctx.row.original.fallback ?? { value: 'None' }} />
  ),
  meta: {
    tooltip:
      'Is there a mechanism that allows data to be posted to an alternative DA layer in case of downtime or unavailability of the primary layer? If so, where is the data posted?',
  },
})

export const customColumns = [
  indexColumn,
  logoColumn,
  daLayerColumn,
  daRisksColumn,
  daBridgeRisksColumn,
  tvsColumn,
  membersColumn,
  fallbackColumn,
  challengeMechanismColumn,
]

const daLayerGroup = columnHelper.group({
  header: 'DA Layer',
  columns: [
    withSpanByBridges(daRisksColumn),
    withSpanByBridges(tvsColumn),
    withSpanByBridges(slashableStakeColumn),
  ],
})

const bridgeColumn = virtual(
  columnHelper.display({
    id: 'bridge',
    header: 'Bridge',
    meta: {
      headClassName: 'px-4',
      tooltip:
        'The DA bridge through which Ethereum is informed that data has been made available.',
    },
  }),
)

const bridgeRisksColumn = virtual(
  columnHelper.display({
    id: 'bridge-risks',
    header: 'Bridge Risks',
  }),
)

const bridgeTvsColumn = virtual(
  columnHelper.display({
    id: 'bridge-tvs',
    header: 'Value secured',
    meta: {
      tooltip:
        'The sum of the total value secured (TVS) across all L2s & L3s that use this DA layer and DA bridge, and are listed on L2BEAT.',
    },
  }),
)

const bridgeUsedByColumn = virtual(
  columnHelper.display({
    id: 'bridge-used-by',
    header: 'Used By',
  }),
)

const bridgeGroup = columnHelper.group({
  header: 'DA Bridge',
  columns: [bridgeRisksColumn, bridgeTvsColumn, bridgeUsedByColumn],
})

export const publicSystemsColumns = [
  withSpanByBridges(indexColumn),
  withSpanByBridges(logoColumn),
  withSpanByBridges(daLayerColumn),
  daLayerGroup,
  bridgeColumn,
  bridgeGroup,
]

function sortSlashableStake(
  rowA: Row<DaSummaryEntry>,
  rowB: Row<DaSummaryEntry>,
) {
  const rowAValue = rowA.original.economicSecurity ?? 0
  const rowBValue = rowB.original.economicSecurity ?? 0

  return rowBValue - rowAValue
}
