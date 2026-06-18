import { formatSeconds } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { BasicTable } from '~/components/table/BasicTable'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'
import { EM_DASH } from '~/consts/characters'
import { useTable } from '~/hooks/useTable'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { Last24HoursBadge } from '~/pages/interop/token-frameworks/components/Last24HoursBadge'
import type {
  IntentBridgeDominanceEntry,
  IntentBridgeTableEntry,
} from '~/server/features/scaling/interop/getIntentBridgesData'
import { useTRPC } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { InteropProjectNameTooltip } from '../../components/table/InteropProjectNameTooltip'
import type { InteropIntentBridge } from '../getInteropIntentBridgesData'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'
import { IntentBridgesTransferTrigger } from './IntentBridgesTransferTrigger'

type IntentBridgeRow = BasicTableRow &
  InteropIntentBridge & {
    activity: IntentBridgeDominanceEntry | undefined
    tableEntry: IntentBridgeTableEntry | undefined
  }

const columnHelper = createColumnHelper<IntentBridgeRow>()

export function IntentBridgeProtocolsTable({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useIntentBridgesSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  const rows = useMemo<IntentBridgeRow[]>(() => {
    if (isLoading) return []

    const activityById = new Map(
      data?.bridgeDominance.volume.entries.map((entry) => [entry.id, entry]) ??
        [],
    )
    const tableById = new Map(
      data?.bridgeTable.map((entry) => [entry.id, entry]) ?? [],
    )

    return intentBridges
      .map((bridge) => ({
        ...bridge,
        activity: activityById.get(bridge.id),
        tableEntry: tableById.get(bridge.id),
      }))
      .toSorted((a, b) => (b.activity?.volume ?? 0) - (a.activity?.volume ?? 0))
  }, [data, intentBridges, isLoading])

  const columns = useMemo(() => getColumns(), [])
  const table = useTable<IntentBridgeRow>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  return (
    <PrimaryCard className="overflow-hidden rounded-xl p-0 md:px-0 md:py-0">
      <div className="flex items-center gap-2 px-4 pt-4 md:px-5 md:pt-5">
        <h2 className="font-bold text-heading-20">Intent Bridge Comparison</h2>
        <Last24HoursBadge />
      </div>
      <p className="px-4 pt-1 pb-3 font-medium text-secondary text-xs leading-[1.2] md:px-5">
        Activity metrics come from indexed transfers. Intent mechanics are
        curated protocol properties.
      </p>
      <BasicTable
        table={table}
        isLoading={isLoading}
        skeletonCount={8}
        tableWrapperClassName="pb-0"
      />
    </PrimaryCard>
  )
}

function getColumns() {
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
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (ctx) => (
        <InteropProjectNameTooltip
          projectName={ctx.row.original.name}
          description={ctx.row.original.description}
        >
          <TableLink href={`/interop/protocols/${ctx.row.original.slug}`}>
            <TwoRowCell>
              <TwoRowCell.First className="flex items-center gap-2 pr-1 leading-none!">
                <div className="w-fit max-w-[112px] break-words font-bold text-label-value-15 md:leading-none">
                  {ctx.row.original.name}
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
        const transferCount = ctx.row.original.activity?.transferCount ?? 0
        if (transferCount === 0) return EM_DASH
        return (
          <IntentBridgesTransferTrigger
            protocol={{
              id: ctx.row.original.projectId,
              name: ctx.row.original.name,
              slug: ctx.row.original.slug,
              iconUrl: ctx.row.original.iconUrl,
            }}
            className="cursor-pointer font-medium text-label-value-15 text-primary hover:underline"
          >
            {formatInteger(transferCount)}
          </IntentBridgesTransferTrigger>
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
        id: 'averageDurationSeconds',
        header: 'Last 24h avg.\ntransfer time',
        invertSorting: true,
        sortUndefined: 'last',
        cell: (ctx) => {
          const averageDuration =
            ctx.row.original.activity?.averageDurationSeconds
          return averageDuration !== null && averageDuration !== undefined
            ? formatSeconds(averageDuration)
            : EM_DASH
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
    columnHelper.accessor(
      (row) => row.activity?.activeChainCount ?? undefined,
      {
        id: 'activeChainCount',
        header: 'Active\nchains',
        cell: (ctx) => (
          <CountCell value={ctx.row.original.activity?.activeChainCount} />
        ),
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
          tooltip:
            'The number of chains with observed transfers for the selected chain set in the past 24 hours.',
        },
      },
    ),
    columnHelper.accessor(
      (row) => row.activity?.activeTokenCount ?? undefined,
      {
        id: 'activeTokenCount',
        header: 'Active\ntokens',
        cell: (ctx) => (
          <CountCell value={ctx.row.original.activity?.activeTokenCount} />
        ),
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
          tooltip:
            'The number of tokens with observed transfers for the selected chain set in the past 24 hours.',
        },
      },
    ),
    columnHelper.display({
      id: 'topRoute',
      header: 'Top\npath',
      cell: (ctx) => {
        const topPath = ctx.row.original.tableEntry?.chainPaths[0]
        return topPath ? (
          <div className="flex items-center justify-end gap-1">
            <ChainIcon iconUrl={topPath.src.iconUrl} alt={topPath.src.id} />
            <ArrowRightIcon className="size-3 fill-brand" />
            <ChainIcon iconUrl={topPath.dst.iconUrl} alt={topPath.dst.id} />
          </div>
        ) : (
          EM_DASH
        )
      },
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The highest-volume source and destination chain path for this protocol in the selected chain set.',
      },
    }),
    columnHelper.accessor((row) => row.userRecovery.value, {
      id: 'userRecovery',
      header: 'User\nrecovery',
      cell: (ctx) => (
        <AttributeCell
          value={ctx.row.original.userRecovery.value}
          description={ctx.row.original.userRecovery.description}
        />
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor((row) => row.solverAccess.value, {
      id: 'solverAccess',
      header: 'Solver\naccess',
      cell: (ctx) => (
        <AttributeCell
          value={ctx.row.original.solverAccess.value}
          description={ctx.row.original.solverAccess.description}
        />
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor((row) => row.intentModel.value, {
      id: 'intentModel',
      header: 'Intent\nmodel',
      cell: (ctx) => (
        <AttributeCell
          value={ctx.row.original.intentModel.value}
          description={ctx.row.original.intentModel.description}
        />
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor((row) => row.settlement.value, {
      id: 'settlement',
      header: 'Settlement',
      cell: (ctx) => (
        <AttributeCell
          value={ctx.row.original.settlement.value}
          description={ctx.row.original.settlement.description}
        />
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

function ChainIcon({
  iconUrl,
  alt,
}: {
  iconUrl: string | undefined
  alt: string
}) {
  if (!iconUrl) {
    return <span className="size-4 rounded-sm bg-surface-secondary" />
  }
  return (
    <img src={iconUrl} alt={alt} className="size-4 rounded-sm object-contain" />
  )
}

function AttributeCell({
  value,
  description,
}: {
  value: string
  description: string | undefined
}) {
  const content = (
    <span className="inline-flex max-w-[150px] items-center rounded bg-surface-secondary px-2 py-1 font-medium text-label-value-13 leading-[1.15]">
      {value}
    </span>
  )

  if (!description) return content

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent className="max-w-[260px]">{description}</TooltipContent>
    </Tooltip>
  )
}
