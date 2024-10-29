import { createColumnHelper } from '@tanstack/react-table'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/da-common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { DaFallbackCell } from '../../../_components/da-fallback-cell'
import { DacMembersCell } from '../../../_components/dac-members-cell'
import { virtual, withSpanByBridges } from '../../../_utils/col-utils'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '../../../_utils/map-risks-to-rosette-values'
import { DaEconomicSecurityCell } from './da-economic-security-cell'

const columnHelper = createColumnHelper<DaSummaryEntry>()

export const [indexColumn, logoColumn, daLayerColumn] =
  getDaCommonProjectColumns(columnHelper)

export const daRisksColumn = columnHelper.display({
  id: 'da-risks',
  header: 'DA Risks',
  cell: (ctx) => {
    const risks = mapLayerRisksToRosetteValues(ctx.row.original.risks)

    return <GrissiniCell values={risks} />
  },
  meta: {
    align: 'center',
  },
})

const daBridgeRisksColumn = columnHelper.display({
  id: 'bridge-risks',
  header: 'Bridge Risks',
  cell: (ctx) => {
    const [firstBridge] = ctx.row.original.bridges

    if (!firstBridge) {
      return EM_DASH
    }

    const risks = mapBridgeRisksToRosetteValues(firstBridge.risks)

    return <GrissiniCell values={risks} />
  },
  enableSorting: false,
  meta: {
    align: 'center',
  },
})

const tvsColumn = columnHelper.accessor('tvs', {
  header: 'TVS',
  cell: (ctx) =>
    ctx.row.original.usedIn.length > 0 ? (
      <div className="w-full pl-4 text-right text-sm font-medium">
        {formatCurrency(ctx.row.original.tvs, 'usd')}
      </div>
    ) : (
      EM_DASH
    ),
  enableSorting: false,
  meta: {
    tooltip: 'The total value locked of all projects using this layer.',
    align: 'right',
  },
})

const slashableStakeColumn = columnHelper.accessor('economicSecurity', {
  header: () => <span className="text-right">{'Slashable\nstake'}</span>,
  cell: (ctx) => {
    const value = ctx.getValue()
    if (ctx.row.original.risks.economicSecurity.type === 'Unknown') {
      return (
        <div className="w-full pl-4 text-right text-xs font-medium md:text-sm">
          {formatCurrency(0, 'usd')}
        </div>
      )
    }

    return (
      <div className="w-full pl-4 text-right text-xs font-medium md:text-sm">
        <DaEconomicSecurityCell value={value} />
      </div>
    )
  },
  meta: {
    align: 'right',
    tooltip:
      'The assets that are slashable in case of a data withholding attack. For public blockchains, it is equal to 2/3 of the total validating stake.',
  },
  enableSorting: false,
})

const membersColumn = columnHelper.display({
  header: 'Members',
  cell: (ctx) => {
    const [firstBridge] = ctx.row.original.bridges

    if (!firstBridge) {
      return EM_DASH
    }

    if (firstBridge.type !== 'DAC') {
      return EM_DASH
    }

    return <DacMembersCell {...firstBridge} />
  },
})

const challengeMechanismColumn = columnHelper.accessor('challengeMechanism', {
  header: 'Challenge\nmechanism',
  cell: (ctx) => (
    <TwoRowCell>
      <TwoRowCell.First>{ctx.getValue()?.value ?? 'None'}</TwoRowCell.First>
    </TwoRowCell>
  ),
  enableSorting: false,
})

const fallbackColumn = columnHelper.accessor('fallback', {
  header: 'Fallback',
  cell: (ctx) => <DaFallbackCell entry={ctx.row.original} />,
  enableSorting: false,
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
  slashableStakeColumn,
]

const daLayerGroup = columnHelper.group({
  header: 'DA Layer',
  columns: [
    withSpanByBridges(daRisksColumn),
    withSpanByBridges(tvsColumn),
    withSpanByBridges(slashableStakeColumn),
  ],
})

export const bridgeColumn = virtual(
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
    header: 'Value Secured',
    meta: {
      tooltip: 'The total value locked of all projects using this bridge.',
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
