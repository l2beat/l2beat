import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { formatCurrency } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'
import { EM_DASH } from '~/consts/characters'
import { formatNetFlow } from '~/pages/interop/components/flows/graph/utils/chainLabel'
import type {
  CompactProtocolEntry,
  ProtocolEntry,
} from '~/server/features/layer2s/interop/types'
import { cn } from '~/utils/cn'
import type { InteropSelection } from '../../utils/types'
import { InteropNoDataBadge } from '../InteropNoDataBadge'
import { TopTokensCell } from '../tokens/TopTokensCell'
import { AvgDurationCell } from './AvgDurationCell'
import { BridgeTypeBadge } from './BridgeTypeBadge'
import { InteropProjectNameTooltip } from './InteropProjectNameTooltip'
import { SubgroupTooltip } from './SubgroupTooltip'
import { TransferCountCell } from './transfer-count-cell/TransferCountCell'

export type ProtocolRow = ProtocolEntry & BasicTableRow

const columnHelper = createColumnHelper<ProtocolEntry>()

function makeLogoColumn<T extends CompactProtocolEntry>() {
  return createColumnHelper<T>().display({
    id: 'logo',
    cell: (ctx) => (
      <img
        className="min-h-[20px] min-w-[20px]"
        src={ctx.row.original.iconUrl}
        width={20}
        height={20}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:pr-1.5!',
    },
    size: 28,
    enableHiding: false,
  })
}

function makeNameColumn<T extends CompactProtocolEntry>(opts?: {
  headClassName?: string
  cellClassName?: string
}) {
  return createColumnHelper<T>().accessor((row) => row.name, {
    id: 'name',
    header: 'Name',
    cell: (ctx) => {
      return (
        <InteropProjectNameTooltip
          projectName={ctx.row.original.name}
          description={ctx.row.original.description}
        >
          <TableLink
            href={`/interop/protocols/${ctx.row.original.slug}`}
            className="w-auto"
          >
            <TwoRowCell>
              <TwoRowCell.First className="flex items-center gap-2 pr-1 leading-none!">
                <div className="w-fit font-bold text-label-value-15 md:leading-none">
                  {ctx.row.original.name}
                </div>
                {ctx.row.original.subgroup && (
                  <SubgroupTooltip subgroup={ctx.row.original.subgroup} />
                )}
              </TwoRowCell.First>
              <TwoRowCell.Second>
                {ctx.row.original.isAggregate && 'Aggregate'}
              </TwoRowCell.Second>
            </TwoRowCell>
          </TableLink>
        </InteropProjectNameTooltip>
      )
    },
    meta: {
      cellClassName: cn('whitespace-normal', opts?.cellClassName),
      headClassName: cn('text-2xs', opts?.headClassName),
    },
  })
}

function makeCategoryColumn<T extends CompactProtocolEntry>(opts?: {
  /** Hides it with CSS below md. See `hideCollapsedColumnsBeforeMount`. */
  hideOnPhones?: boolean
}) {
  return createColumnHelper<T>().accessor((row) => row.type, {
    id: 'type',
    header: 'Category',
    cell: (ctx) => (
      <div className="whitespace-nowrap font-medium text-xs capitalize leading-[15px] md:text-sm md:leading-[1.2]">
        {ctx.row.original.type}
      </div>
    ),
    meta: {
      headClassName: cn('text-2xs', opts?.hideOnPhones && 'max-md:hidden'),
      cellClassName: opts?.hideOnPhones ? 'max-md:hidden' : undefined,
    },
  })
}

function makeLast24hVolumeColumn<T extends CompactProtocolEntry>(
  header = 'Last 24h\nvolume',
) {
  return createColumnHelper<T>().accessor((row) => row.volume, {
    id: 'volume',
    header,
    cell: (ctx) => {
      if (!ctx.row.original.volume) return EM_DASH
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.volume, 'usd')}
        </span>
      )
    },
    meta: {
      align: 'right',
      headClassName: 'text-2xs text-right',
      tooltip:
        'The total USD value of all token transfers completed in the past 24 hours.',
    },
  })
}

const commonColumns = [
  makeLogoColumn<ProtocolEntry>(),
  // 8px from the logo, like the summary's protocols table; one line from md,
  // where the table scrolls sideways rather than wrap names.
  makeNameColumn<ProtocolEntry>({
    cellClassName: 'md:pl-2! md:whitespace-nowrap',
    headClassName: 'md:pl-2!',
  }),
]
const categoryColumn = makeCategoryColumn<ProtocolEntry>()
const last24hVolumeColumn = makeLast24hVolumeColumn<ProtocolEntry>()

const averageValueColumn = columnHelper.accessor('averageValue', {
  header: 'Last 24h avg.\ntransfer value',
  meta: {
    align: 'right',
    headClassName: 'text-2xs',
    tooltip:
      'The average USD value per token transfer completed in the past 24 hours.',
  },
  cell: (ctx) => {
    if (!ctx.row.original.averageValue) return EM_DASH

    const averageValue = formatCurrency(ctx.row.original.averageValue, 'usd')
    const minTransferSize =
      ctx.row.original.minTransferValueUsd !== undefined
        ? formatCurrency(ctx.row.original.minTransferValueUsd, 'usd')
        : EM_DASH
    const maxTransferSize =
      ctx.row.original.maxTransferValueUsd !== undefined
        ? formatCurrency(ctx.row.original.maxTransferValueUsd, 'usd')
        : EM_DASH

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-label-value-15 text-primary">
            {averageValue}
          </span>
        </TooltipTrigger>
        <TooltipContent className="min-w-[200px]">
          <div className="font-medium text-label-value-14 text-secondary">
            Transfer value
          </div>
          <HorizontalSeparator className="my-1" />
          <div className="flex items-center justify-between gap-x-6">
            <span className="font-medium text-label-value-14">Minimum</span>
            <span className="font-medium text-label-value-15 text-primary tabular-nums">
              {minTransferSize}
            </span>
          </div>
          <div className="flex items-center justify-between gap-x-6">
            <span className="font-medium text-label-value-14">Average</span>
            <span className="font-medium text-label-value-15 text-primary tabular-nums">
              {averageValue}
            </span>
          </div>
          <div className="flex items-center justify-between gap-x-6">
            <span className="font-medium text-label-value-14">Maximum</span>
            <span className="font-medium text-label-value-15 text-primary tabular-nums">
              {maxTransferSize}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  },
})

function makeTokensColumn(opts: {
  type: KnownInteropBridgeType | undefined
  apiSelection: InteropSelection
  hideDialog?: boolean
  showNetMintedValueColumn?: boolean
}) {
  return columnHelper.accessor('tokens', {
    header: 'Tokens\nby volume',
    meta: {
      headClassName: 'text-2xs',
      tooltip:
        'Tokens involved in transfers over the past 24 hours, ranked by total transfer volume. For each transfer, value is counted towards both the source and the destination token.',
    },
    cell: (ctx) => {
      if (ctx.row.original.tokens.items.length === 0) return EM_DASH
      return (
        <TopTokensCell
          topItems={ctx.row.original.tokens}
          type={opts.type}
          apiSelection={opts.apiSelection}
          hideDialog={opts.hideDialog}
          protocol={{
            id: ctx.row.original.id,
            name: ctx.row.original.name,
            slug: ctx.row.original.slug,
            iconUrl: ctx.row.original.iconUrl,
            bridgeTypes: ctx.row.original.bridgeTypes,
          }}
          showNetMintedValueColumn={opts.showNetMintedValueColumn}
        />
      )
    },
  })
}

const averageInFlightValueColumn = columnHelper.accessor(
  'averageValueInFlight',
  {
    header: 'Last 24h avg.\nin-flight value',
    invertSorting: true,
    meta: {
      align: 'right',
      headClassName: 'text-2xs',
      tooltip:
        'The average USD value of funds in transit at any given second over the past 24 hours.',
    },
    cell: (ctx) => {
      if (ctx.row.original.averageValueInFlight === undefined)
        return <InteropNoDataBadge />
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.averageValueInFlight, 'usd')}
        </span>
      )
    },
  },
)

export function getAllProtocolsColumns(
  type: KnownInteropBridgeType | undefined,
  apiSelection: InteropSelection,
  hideTypeColumn?: boolean,
  showAverageInFlightValueColumn?: boolean,
  showNetMintedValueColumn?: boolean,
  hideTokensColumn?: boolean,
  tokenId?: string,
  /**
   * Hides Category and Transfer types below md with CSS, for the
   * markup painted before the viewport is known. After that the table hides
   * them through its column visibility, which the Columns menu can turn back
   * on. See `AllProtocolsTable`.
   */
  hideCollapsedColumnsBeforeMount?: boolean,
) {
  return compact([
    columnHelper.accessor((_, index) => index + 1, {
      header: '#',
      cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
      sortDescFirst: false,
      meta: {
        align: 'right',
        headClassName: 'w-0',
      },
      size: 44,
    }),
    ...commonColumns,
    hideCollapsedColumnsBeforeMount
      ? makeCategoryColumn<ProtocolEntry>({ hideOnPhones: true })
      : categoryColumn,
    !hideTypeColumn &&
      columnHelper.accessor('bridgeTypes', {
        header: 'Transfer types',
        enableSorting: false,
        cell: (ctx) => {
          return (
            // One badge per line, so the column stays narrow and the figures
            // after it stay in view; side by side from 2xl, where there's room.
            <div
              className="flex flex-col items-start gap-1 py-1.5 2xl:flex-row 2xl:items-center"
              key={ctx.row.original.id}
            >
              {ctx.row.original.bridgeTypes.map((bridgeType) => (
                <BridgeTypeBadge
                  size="extraSmall"
                  key={bridgeType}
                  bridgeType={bridgeType}
                />
              ))}
            </div>
          )
        },
        meta: {
          headClassName: cn(
            'text-2xs',
            hideCollapsedColumnsBeforeMount && 'max-md:hidden',
          ),
          cellClassName: hideCollapsedColumnsBeforeMount
            ? 'max-md:hidden'
            : undefined,
        },
      }),
    last24hVolumeColumn,
    columnHelper.accessor((row) => row.transferCount, {
      header: 'Last 24h\ntransfers',
      cell: (ctx) => (
        <TransferCountCell
          transferCount={ctx.row.original.transferCount}
          snapshotTimestamp={ctx.row.original.snapshotTimestamp}
          type={type}
          tokenId={tokenId}
          protocol={{
            id: ctx.row.original.id,
            name: ctx.row.original.name,
            slug: ctx.row.original.slug,
            iconUrl: ctx.row.original.iconUrl,
          }}
        />
      ),
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The total number of token transfer transactions completed in the past 24 hours.',
      },
    }),
    columnHelper.accessor(
      (row) =>
        row.averageDuration?.type === 'unknown' || row.averageDuration === null
          ? undefined
          : row.averageDuration.type === 'single'
            ? row.averageDuration.duration
            : Math.min(
                ...row.averageDuration.splits
                  .filter((split) => split.duration !== null)
                  .map((split) => split.duration ?? Number.POSITIVE_INFINITY),
              ),
      {
        header: 'Last 24h avg.\ntransfer time',
        invertSorting: true,
        sortUndefined: 'last',
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
          tooltip:
            'The average time it takes for a transfer to be received on the destination chain, measured over the past 24 hours.',
        },
        cell: (ctx) => {
          if (ctx.row.original.averageDuration === null)
            return <InteropNoDataBadge />
          return (
            <AvgDurationCell
              averageDuration={ctx.row.original.averageDuration}
            />
          )
        },
      },
    ),
    averageValueColumn,
    showAverageInFlightValueColumn && averageInFlightValueColumn,
    showNetMintedValueColumn &&
      columnHelper.accessor('netMintedValue', {
        header: 'Last 24h net\nminted value',
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
          tooltip:
            "The USD value of tokens minted through the protocol minus the USD value of tokens that were bridged back, or burned. It represents the net USD value added to the protocol's total value locked.",
        },
        cell: (ctx) => {
          if (ctx.row.original.netMintedValue === undefined)
            return <InteropNoDataBadge />
          return (
            <span className="font-medium text-label-value-15">
              {formatNetFlow(ctx.row.original.netMintedValue)}
            </span>
          )
        },
      }),
    !hideTokensColumn &&
      makeTokensColumn({ type, apiSelection, showNetMintedValueColumn }),
  ])
}
