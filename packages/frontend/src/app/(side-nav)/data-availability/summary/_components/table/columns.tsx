import { type CellContext, createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/components/table/cells/index-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { DaLayerCell } from '../../../_components/da-layer-cell'
import { RiskGrissini } from '../../../_components/risk-grissini'
import { DaEconomicSecurityCell } from './da-economic-security-cell'

const columnHelper = createColumnHelper<DaSummaryEntry>()

const nameColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
  cell: (ctx) => (
    <ProjectNameCell
      project={{
        name: ctx.getValue(),
      }}
    />
  ),
})

const daRisksColumn = columnHelper.accessor('risks', {
  header: 'DA Risks',
  cell: (ctx) => {
    const risks = [
      ctx.row.original.risks.economicSecurity,
      ctx.row.original.risks.fraudDetection,
    ]

    return <RiskGrissini values={risks} />
  },
  enableSorting: false,
  meta: {
    align: 'center',
  },
})

const daBridgeRisksColumn = columnHelper.accessor('risks', {
  header: 'Bridge Risks',
  cell: (ctx) => {
    const risks = [
      ctx.row.original.bridges[0]!.risks.committeeSecurity,
      ctx.row.original.bridges[0]!.risks.upgradeability,
      ctx.row.original.bridges[0]!.risks.relayerFailure,
    ]

    return <RiskGrissini values={risks} />
  },
  enableSorting: false,
  meta: {
    align: 'center',
  },
})

const tvsColumn = columnHelper.accessor('tvs', {
  header: 'TVS',
  cell: (ctx) =>
    ctx.row.original.usedIn.length > 0
      ? formatCurrency(ctx.row.original.tvs, 'usd')
      : EM_DASH,
  meta: {
    tooltip: 'The total value locked of all L2s using this layer.',
    align: 'right',
  },
})

const slashableStakeColumn = columnHelper.accessor('economicSecurity', {
  header: 'Slashable\nstake',
  cell: (ctx) => {
    const value = ctx.getValue()
    if (ctx.row.original.risks.economicSecurity.type === 'Unknown') {
      return formatCurrency(0, 'usd')
    }

    return <DaEconomicSecurityCell value={value} />
  },
  meta: {
    align: 'right',
    tooltip:
      'The assets that are slashable in case of a data withholding attack (the amount of funds a committee would need to burn to successfully deceive the DA bridge). It’s equal to 2/3 of the total validating stake, if any.',
  },
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
  },
)

const fallbackColumn = columnHelper.accessor('fallback', {
  header: 'Fallback',
  cell: (ctx) => ctx.getValue() ?? 'None',
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
    ...virtual,
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
