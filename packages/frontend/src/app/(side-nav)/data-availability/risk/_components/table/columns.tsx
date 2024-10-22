import { type CellContext, createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { DaLayerCell } from '~/app/(side-nav)/data-availability/_components/da-layer-cell'
import { IndexCell } from '~/components/table/cells/index-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'

const columnHelper = createColumnHelper<DaRiskEntry>()

const spanByBridges = (ctx: CellContext<DaRiskEntry, unknown>) =>
  ctx.row.original.bridges.length

const virtual = {
  meta: {
    virtual: true,
  },
}

const baseColumns = [
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
]
const daLayerRisksColumns = [
  columnHelper.group({
    header: 'Da Layer Risks',
    columns: [
      columnHelper.accessor('risks.economicSecurity', {
        header: 'Economic security',
        cell: (ctx) => (
          <RiskCell risk={ctx.row.original.risks.economicSecurity} />
        ),
        meta: {
          rowSpan: spanByBridges,
        },
      }),
      columnHelper.accessor('risks.fraudDetection', {
        header: 'Fraud detection',
        cell: (ctx) => (
          <RiskCell risk={ctx.row.original.risks.fraudDetection} />
        ),
        meta: {
          rowSpan: spanByBridges,
        },
      }),
    ],
  }),
]

const bridgeColumn = columnHelper.display({
  id: 'bridge',
  header: 'Bridge',
  meta: {
    virtual: true,
    headClassName: 'px-4',
  },
})

const spacerColumn = columnHelper.display({
  id: 'spacer',
  header: '',
  meta: {
    virtual: true,
    headClassName: 'px-4',
  },
})

const bridgeRisksColumns = [
  columnHelper.group({
    header: 'Bridge Risks',
    columns: [
      columnHelper.display({
        id: 'committee-security',
        header: 'Committee Security',
        ...virtual,
      }),
      columnHelper.display({
        id: 'upgradeability',
        header: 'Upgradeability',
        ...virtual,
      }),
      columnHelper.display({
        id: 'relayer-failure',
        header: 'Relayer Failure',
        ...virtual,
      }),
    ],
  }),
]

export const publicColumns = [
  ...baseColumns,
  ...daLayerRisksColumns,
  bridgeColumn,
  ...bridgeRisksColumns,
]

export const customColumns = [
  ...baseColumns,
  ...daLayerRisksColumns,
  spacerColumn,
  ...bridgeRisksColumns,
]
