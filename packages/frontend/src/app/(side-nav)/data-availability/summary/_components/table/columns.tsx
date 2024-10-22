import { type CellContext } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { IndexCell } from '~/components/table/cells/index-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { DaLayerCell } from '../../../_components/da-layer-cell'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '../../../_utils/map-risks-to-rosette-values'
import { DaEconomicSecurityCell } from './da-economic-security-cell'

const columnHelper = createColumnHelper<DaSummaryEntry>()

const nameColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
  cell: (ctx) => <DaLayerCell entry={ctx.row.original} />,
})

const daRisksColumn = columnHelper.accessor('risks', {
  header: 'DA Risks',
  cell: (ctx) => {
    const risks = mapLayerRisksToRosetteValues(ctx.row.original.risks)

    return <GrissiniCell values={risks} />
  },
  enableSorting: false,
  meta: {
    align: 'center',
  },
})

const daBridgeRisksColumn = columnHelper.accessor('risks', {
  header: 'Bridge Risks',
  cell: (ctx) => {
    const [firstBridge] = ctx.row.original.bridges

    if (!firstBridge) {
      return EM_DASH
    }

    const risks = mapBridgeRisksToRosetteValues(firstBridge.risks)

    return <GrissiniCell values={risks.slice(0, 3)} />
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
      <div className="w-full pl-4 text-right text-sm font-bold">
        {formatCurrency(ctx.row.original.tvs, 'usd')}
      </div>
    ) : (
      EM_DASH
    ),
  enableSorting: false,
  meta: {
    tooltip: 'The total value locked of all L2s using this layer.',
    align: 'right',
  },
})

const slashableStakeColumn = columnHelper.accessor('economicSecurity', {
  header: () => <span className="text-right">{'Slashable\nstake'}</span>,
  cell: (ctx) => {
    const value = ctx.getValue()
    if (ctx.row.original.risks.economicSecurity.type === 'Unknown') {
      return (
        <div className="w-full pl-4 text-right text-sm font-bold">
          {formatCurrency(0, 'usd')}
        </div>
      )
    }

    return (
      <div className="w-full pl-4 text-right text-sm font-bold">
        <DaEconomicSecurityCell value={value} />
      </div>
    )
  },
  meta: {
    align: 'right',
    tooltip:
      'The assets that are slashable in case of a data withholding attack (the amount of funds a committee would need to burn to successfully deceive the DA bridge). It’s equal to 2/3 of the total validating stake, if any.',
  },
  enableSorting: false,
})

const membersColumn = columnHelper.display({
  header: 'Members',
  cell: () => 'TBD',
})

const challengeMechanismColumn = columnHelper.accessor(
  'hasChallengeMechanism',
  {
    header: 'Challenge\nmechanism',
    cell: (ctx) => (
      <RiskCell
        risk={{
          value: ctx.getValue() ? 'Yes' : 'None',
          sentiment: ctx.getValue() ? 'good' : 'bad',
        }}
        emptyMode="em-dash"
      />
    ),
    enableSorting: false,
  },
)

const fallbackColumn = columnHelper.accessor('fallback', {
  header: 'Fallback',
  cell: (ctx) => ctx.getValue() ?? 'None',
  enableSorting: false,
})

export const customColumns = [
  ...getCommonProjectColumns(columnHelper),
  nameColumn,
  daRisksColumn,
  daBridgeRisksColumn,
  tvsColumn,
  membersColumn,
  fallbackColumn,
  challengeMechanismColumn,
  slashableStakeColumn,
]

const spanByBridges = (ctx: CellContext<DaSummaryEntry, unknown>) =>
  ctx.row.original.bridges.length

const virtual = {
  meta: {
    virtual: true,
  },
}

export const publicSystemsColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
      rowSpan: spanByBridges,
    },
    size: 44,
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[20px] min-w-[20px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={20}
        height={20}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:!pr-1.5',
      rowSpan: spanByBridges,
    },
    size: 28,
  }),
  columnHelper.accessor('name', {
    header: 'DA Layer',
    cell: (info) => <DaLayerCell entry={info.row.original} />,
    meta: {
      rowSpan: spanByBridges,
    },
  }),
  columnHelper.group({
    header: 'DA Layer',
    columns: [
      { ...daRisksColumn, meta: { rowSpan: spanByBridges, align: 'center' } },
      { ...tvsColumn, meta: { rowSpan: spanByBridges, align: 'right' } },
      {
        ...slashableStakeColumn,
        meta: { rowSpan: spanByBridges, align: 'center' },
      },
    ],
    meta: {
      rowSpan: spanByBridges,
    },
  }),
  columnHelper.display({
    id: 'bridge',
    header: 'Bridge',
    meta: {
      virtual: true,
      headClassName: 'px-4',
    },
  }),
  columnHelper.group({
    header: 'DA Bridge',
    columns: [
      { id: 'bridge-risks', header: 'Bridge Risks', ...virtual },
      { id: 'bridge-tvs', header: 'Value Secured', ...virtual },
      { id: 'bridge-used-by', header: 'Used By', ...virtual },
    ],
  }),
]
