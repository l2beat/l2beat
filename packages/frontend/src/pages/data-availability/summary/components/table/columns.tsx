import { ProjectId } from '@l2beat/shared-pure'
import type { Row } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { GrissiniCell } from '~/components/rosette/grissini/GrissiniCell'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TableLink } from '~/components/table/TableLink'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/DaCommonProjectColumns'
import { EM_DASH } from '~/consts/characters'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { DacMembersCell } from '../../../components/DacMembersCell'
import { BridgeNameCell } from './BridgeNameCell'
import { BridgeRiskCell } from './BridgeRiskCell'
import { BridgeUsedByCell } from './BridgeUsedByCell'
import { BridgeValueSecuredCell } from './BridgeValueSecuredCell'

const columnHelper = createColumnHelper<DaSummaryEntry>()

const daLayerColumn = (hash?: string) =>
  columnHelper.accessor('name', {
    header: 'DA Layer',
    cell: (ctx) => (
      <TableLink href={`${ctx.row.original.href}${hash ? `#${hash}` : ''}`}>
        <ProjectNameCell project={ctx.row.original} />
      </TableLink>
    ),
    meta: {
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is posted.',
    },
  })

const daRisksColumn = columnHelper.display({
  id: 'da-risks',
  header: 'DA Risks',
  cell: (ctx) => {
    return (
      <GrissiniCell
        values={ctx.row.original.risks}
        href={
          ctx.row.original.id === ProjectId.ETHEREUM
            ? undefined
            : `/data-availability/risk?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`
        }
        disabledOnMobile
      />
    )
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
        values={bridge.risks}
        href={
          ctx.row.original.id === ProjectId.ETHEREUM
            ? undefined
            : `/data-availability/risk?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`
        }
        disabledOnMobile
      />
    )
  },
  meta: {
    align: 'center',
  },
})

const tvsColumn = (href?: (row: DaSummaryEntry) => string) =>
  columnHelper.accessor('tvs', {
    header: 'TVS',
    cell: (ctx) => (
      <TableLink
        href={
          ctx.row.original.tvs.latest > 0 ? href?.(ctx.row.original) : undefined
        }
      >
        <div className="w-full text-right font-medium text-sm">
          {formatDollarValueNumber(ctx.row.original.tvs.latest)}
        </div>
      </TableLink>
    ),
    meta: {
      tooltip:
        'Total value secured (TVS) is the sum of the total value secured across all L2s & L3s that use this DA layer and are listed on L2BEAT. It does not include the TVS of sovereign rollups.',
      align: 'right',
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

function sortSlashableStake(
  rowA: Row<DaSummaryEntry>,
  rowB: Row<DaSummaryEntry>,
) {
  const rowAValue = rowA.original.economicSecurity ?? 0
  const rowBValue = rowB.original.economicSecurity ?? 0

  return rowBValue - rowAValue
}

export const publicSystemsColumns = [
  ...getDaCommonProjectColumns(columnHelper, (row) => `${row.href}`),
  daLayerColumn(),
  columnHelper.group({
    header: 'DA Layer',
    columns: [
      daRisksColumn,
      tvsColumn(),
      columnHelper.accessor('economicSecurity', {
        header: () => <span className="text-right">Slashable</span>,
        cell: (ctx) => {
          const value = ctx.getValue()

          return (
            <div className="w-full pr-[18px] text-right font-medium text-xs md:text-sm">
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
      }),
    ],
  }),
  columnHelper.display({
    id: 'bridge',
    header: 'Bridge',
    cell: (ctx) => {
      const bridge = ctx.row.original.bridges[0]
      if (!bridge) {
        return null
      }
      return <BridgeNameCell bridge={bridge} />
    },
    meta: {
      tooltip:
        'The DA bridge through which Ethereum is informed that data has been made available.',
      additionalRows: (ctx) => {
        return ctx.row.original.bridges
          .slice(1)
          .map((bridge) => <BridgeNameCell key={bridge.slug} bridge={bridge} />)
      },
    },
  }),
  columnHelper.group({
    header: 'DA Bridge',
    columns: [
      columnHelper.display({
        id: 'bridge-risks',
        header: 'Bridge Risks',
        cell: (ctx) => {
          const bridge = ctx.row.original.bridges[0]
          if (!bridge) {
            return null
          }
          return <BridgeRiskCell bridge={bridge} layer={ctx.row.original} />
        },
        meta: {
          additionalRows: (ctx) => {
            return ctx.row.original.bridges
              .slice(1)
              .map((bridge) => (
                <BridgeRiskCell
                  key={bridge.slug}
                  bridge={bridge}
                  layer={ctx.row.original}
                />
              ))
          },
        },
      }),
      columnHelper.display({
        id: 'bridge-tvs',
        header: 'Value secured',
        cell: (ctx) => {
          const bridge = ctx.row.original.bridges[0]
          if (!bridge) {
            return null
          }
          return <BridgeValueSecuredCell bridge={bridge} />
        },
        meta: {
          additionalRows: (ctx) => {
            return ctx.row.original.bridges
              .slice(1)
              .map((bridge) => (
                <BridgeValueSecuredCell key={bridge.slug} bridge={bridge} />
              ))
          },
          align: 'right',
          cellClassName: 'pr-[30px] md:pr-[34px]',
          tooltip:
            'The sum of the total value secured (TVS) across all L2s & L3s that use this DA layer and DA bridge, and are listed on L2BEAT.',
        },
      }),
      columnHelper.display({
        id: 'bridge-used-by',
        header: 'Used By',
        cell: (ctx) => {
          const bridge = ctx.row.original.bridges[0]
          if (!bridge) {
            return null
          }
          return <BridgeUsedByCell bridge={bridge} />
        },
        meta: {
          additionalRows: (ctx) => {
            return ctx.row.original.bridges
              .slice(1)
              .map((bridge) => (
                <BridgeUsedByCell key={bridge.slug} bridge={bridge} />
              ))
          },
        },
      }),
    ],
  }),
]

export const customColumns = [
  ...getDaCommonProjectColumns(columnHelper, (row) => `${row.href}#da-layer`),
  daLayerColumn('da-layer'),
  daRisksColumn,
  daBridgeRisksColumn,
  tvsColumn((row) => `${row.href}#tvs`),
  membersColumn,
  fallbackColumn,
  challengeMechanismColumn,
]
