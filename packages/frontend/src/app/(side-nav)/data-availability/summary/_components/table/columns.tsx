import { type Row, createColumnHelper } from '@tanstack/react-table'
import { NaBadge } from '~/components/badge/na-badge'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/da-common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { DaFallbackCell } from '../../../_components/da-fallback-cell'
import { DaLayerCell } from '../../../_components/da-layer-cell'
import { DacMembersCell } from '../../../_components/dac-members-cell'
import { virtual, withSpanByBridges } from '../../../_utils/col-utils'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '../../../_utils/map-risks-to-rosette-values'
import { DaEconomicSecurityCell } from './da-economic-security-cell'

const columnHelper = createColumnHelper<DaSummaryEntry>()

export const [indexColumn, logoColumn] = getDaCommonProjectColumns(columnHelper)

const daLayerColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  cell: (ctx) => <DaLayerCell entry={ctx.row.original} />,
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
})

const daRisksColumn = columnHelper.display({
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

    return (
      <GrissiniCell
        values={risks}
        hasNoBridge={firstBridge.type === 'NoBridge'}
      />
    )
  },
  meta: {
    align: 'center',
  },
})

const tvsColumn = columnHelper.accessor('tvs', {
  header: 'TVS',
  cell: (ctx) => {
    const valueToFormat =
      ctx.row.original.usedIn.length > 0 ? ctx.row.original.tvs : 0

    return (
      <div className="w-full pr-5 text-right text-sm font-medium">
        {formatCurrency(valueToFormat, 'usd')}
      </div>
    )
  },
  meta: {
    tooltip:
      'Total value secured (TVS) is the total value locked of all projects using this layer.',
    align: 'right',
  },
})

const slashableStakeColumn = columnHelper.accessor('economicSecurity', {
  header: () => <span className="text-right">Slashable</span>,
  cell: (ctx) => {
    const value = ctx.getValue()
    if (ctx.row.original.risks.economicSecurity.type === 'Unknown') {
      return (
        <div className="w-full pr-[18px] text-right text-xs font-medium md:text-sm">
          {formatCurrency(0, 'usd')}
        </div>
      )
    }

    return (
      <div className="w-full pr-[18px] text-right text-xs font-medium md:text-sm">
        <DaEconomicSecurityCell value={value} />
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
  cell: (ctx) => {
    const [firstBridge] = ctx.row.original.bridges

    if (!firstBridge) {
      return <NaBadge />
    }

    if (firstBridge.type !== 'DAC') {
      return <NaBadge />
    }

    if (firstBridge.hideMembers) {
      return <NaBadge />
    }

    return <DacMembersCell {...firstBridge} />
  },
})

const challengeMechanismColumn = columnHelper.display({
  header: 'Challenge\nmechanism',
  cell: (ctx) => (
    <TwoRowCell>
      <TwoRowCell.First>
        {ctx.row.original.challengeMechanism?.value ?? 'None'}
      </TwoRowCell.First>
    </TwoRowCell>
  ),
  meta: {
    tooltip:
      'Shows if there is a mechanism that  users to dispute the availability or accuracy of data committed by the DA provider',
  },
})

const fallbackColumn = columnHelper.display({
  header: 'Fallback',
  cell: (ctx) => <DaFallbackCell fallback={ctx.row.original.fallback} />,
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
    header: 'Value Secured',
    meta: {
      tooltip:
        'Value secured is the total value locked of all projects using this bridge.',
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
  const rowAValue = slashableStakeToValue(rowA.original)
  const rowBValue = slashableStakeToValue(rowB.original)

  return rowBValue - rowAValue
}

function slashableStakeToValue(entry: DaSummaryEntry) {
  if (entry.risks.economicSecurity.type === 'Unknown') {
    return 0
  }

  if (!entry.economicSecurity || entry.economicSecurity.status !== 'Synced') {
    return 0
  }

  return entry.economicSecurity.economicSecurity
}
