import { createColumnHelper } from '@tanstack/react-table'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'
import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import {
  type InteropTransferDefaults,
  InteropTransferTrigger,
} from '../../../components/InteropTransferTrigger'
import { AvgDurationCell } from '../../../components/table/AvgDurationCell'
import { InteropProjectNameTooltip } from '../../../components/table/InteropProjectNameTooltip'
import type { IntentBridgeRow } from '../../utils/buildIntentBridgeRows'

const columnHelper = createColumnHelper<IntentBridgeRow>()

export function getIntentBridgeColumns(transfer: InteropTransferDefaults) {
  return [
    columnHelper.accessor((_, index) => index + 1, {
      id: '#',
      header: '#',
      cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
      sortDescFirst: false,
      meta: {
        align: 'right',
        headClassName: 'w-0',
      },
      size: 44,
    }),
    columnHelper.display({
      id: 'logo',
      cell: (ctx) => (
        <img
          className="min-h-[20px] min-w-[20px] rounded-full"
          src={ctx.row.original.bridge.iconUrl}
          width={20}
          height={20}
          alt={`${ctx.row.original.bridge.name} logo`}
        />
      ),
      meta: {
        headClassName: 'w-0',
        cellClassName: 'lg:pr-1.5!',
      },
      size: 28,
      enableHiding: false,
    }),
    columnHelper.accessor((row) => row.bridge.name, {
      id: 'name',
      header: 'Name',
      cell: (ctx) => (
        <InteropProjectNameTooltip
          projectName={ctx.row.original.bridge.name}
          description={ctx.row.original.bridge.description}
        >
          <TableLink
            href={`/interop/protocols/${ctx.row.original.bridge.slug}`}
          >
            <TwoRowCell>
              <TwoRowCell.First className="flex items-center gap-2 pr-1 leading-none!">
                <div className="w-fit max-w-[112px] break-words font-bold text-label-value-15 md:leading-none">
                  {ctx.row.original.bridge.name}
                </div>
              </TwoRowCell.First>
            </TwoRowCell>
          </TableLink>
        </InteropProjectNameTooltip>
      ),
      meta: {
        cellClassName: 'whitespace-normal',
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor((row) => row.activity?.volume ?? 0, {
      id: 'volume',
      header: 'Last 24h\nVolume',
      cell: (ctx) => {
        const volume = ctx.row.original.activity?.volume
        if (!volume) return EM_DASH
        return (
          <span className="font-medium text-label-value-15">
            {formatCurrency(volume, 'usd')}
          </span>
        )
      },
      meta: {
        align: 'right',
        headClassName: 'text-2xs text-right',
        tooltip:
          'The total USD value of all intent bridge transfers completed in the past 24 hours.',
      },
    }),
    columnHelper.accessor((row) => row.activity?.transferCount ?? 0, {
      id: 'transferCount',
      header: 'Last 24h\ntransfers',
      cell: (ctx) => {
        const bridge = ctx.row.original.bridge
        const transferCount = ctx.row.original.activity?.transferCount ?? 0
        if (transferCount === 0) return EM_DASH
        return (
          <InteropTransferTrigger
            protocol={{
              id: bridge.id,
              name: bridge.name,
              slug: bridge.slug,
              iconUrl: bridge.iconUrl,
            }}
            selection={transfer.selection}
            snapshotTimestamp={transfer.snapshotTimestamp}
            className="cursor-pointer font-medium text-label-value-15 text-primary hover:underline"
          >
            {formatInteger(transferCount)}
          </InteropTransferTrigger>
        )
      },
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The total number of intent bridge transfer transactions completed in the past 24 hours.',
      },
    }),
    columnHelper.accessor(
      (row) => row.activity?.averageDurationSeconds ?? undefined,
      {
        id: 'averageDuration',
        header: 'Last 24h avg.\ntransfer time',
        invertSorting: true,
        sortUndefined: 'last',
        cell: (ctx) => {
          const averageDuration = ctx.row.original.activity?.averageDuration
          if (!averageDuration) return EM_DASH
          return <AvgDurationCell averageDuration={averageDuration} />
        },
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
          tooltip:
            'The average time it takes for a transfer to be received on the destination chain, measured over the past 24 hours.',
        },
      },
    ),
    columnHelper.accessor((row) => row.activity?.averageValue ?? undefined, {
      id: 'averageValue',
      header: 'Last 24h avg.\ntransfer value',
      cell: (ctx) => {
        const averageValue = ctx.row.original.activity?.averageValue
        if (!averageValue) return EM_DASH
        return (
          <span className="font-medium text-label-value-15">
            {formatCurrency(averageValue, 'usd')}
          </span>
        )
      },
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The average USD value per intent bridge transfer completed in the past 24 hours.',
      },
    }),
    columnHelper.accessor((row) => row.activeChainCount ?? undefined, {
      id: 'activeChainCount',
      header: 'Active\nchains',
      cell: (ctx) => <CountCell value={ctx.row.original.activeChainCount} />,
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The number of chains with observed transfers for the selected chain set in the past 24 hours.',
      },
    }),
    columnHelper.accessor((row) => row.activeTokenCount ?? undefined, {
      id: 'activeTokenCount',
      header: 'Active\ntokens',
      cell: (ctx) => <CountCell value={ctx.row.original.activeTokenCount} />,
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The number of tokens with observed transfers for the selected chain set in the past 24 hours.',
      },
    }),
    columnHelper.display({
      id: 'topRoute',
      header: 'Top\npath',
      cell: (ctx) => {
        const topRoute = ctx.row.original.topRoute
        if (!topRoute) return EM_DASH
        return (
          <div className="flex items-center justify-end gap-1">
            <img
              src={topRoute.srcChain.iconUrl}
              alt={topRoute.srcChain.name}
              className="size-4 rounded-sm object-contain"
            />
            <ArrowRightIcon className="size-3 fill-brand" />
            <img
              src={topRoute.dstChain.iconUrl}
              alt={topRoute.dstChain.name}
              className="size-4 rounded-sm object-contain"
            />
          </div>
        )
      },
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The highest-volume source and destination chain path for this protocol in the selected chain set.',
      },
    }),
    columnHelper.accessor((row) => row.bridge.userRecovery.value, {
      id: 'userRecovery',
      header: 'User\nrecovery',
      cell: (ctx) => (
        <TableValueCell value={ctx.row.original.bridge.userRecovery} />
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor((row) => row.bridge.solverAccess.value, {
      id: 'solverAccess',
      header: 'Solver\naccess',
      cell: (ctx) => (
        <TableValueCell value={ctx.row.original.bridge.solverAccess} />
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor((row) => row.bridge.intentModel.value, {
      id: 'intentModel',
      header: 'Intent\nmodel',
      cell: (ctx) => (
        <TableValueCell value={ctx.row.original.bridge.intentModel} />
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor((row) => row.bridge.settlement.value, {
      id: 'settlement',
      header: 'Settlement',
      cell: (ctx) => (
        <TableValueCell value={ctx.row.original.bridge.settlement} />
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
  ]
}

function CountCell({ value }: { value: number | undefined }) {
  if (!value) return EM_DASH
  return (
    <span className="font-medium text-label-value-15">
      {formatInteger(value)}
    </span>
  )
}
