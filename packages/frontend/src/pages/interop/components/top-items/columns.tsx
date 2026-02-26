import { assertUnreachable } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { EM_DASH } from '~/consts/characters'
import type { AverageDuration } from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { AvgDurationCell } from '../table/AvgDurationCell'

export type TopItem = {
  id?: string
  displayName: string
  issuer?: string | null
  iconUrl: string
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
  minTransferValueUsd?: number
  maxTransferValueUsd?: number
  netMintedValue?: number
}
export type TopItemType = 'tokens' | 'chains'

export type TopItemRow = TopItem & BasicTableRow
const columnHelper = createColumnHelper<TopItemRow>()

export const getTopItemsColumns = (
  itemType: TopItemType,
  showNetMintedValueColumn?: boolean,
) =>
  compact([
    columnHelper.display({
      id: 'icon',
      cell: (ctx) => (
        <img
          className="min-h-[20px] min-w-[20px] rounded-full bg-white shadow"
          src={ctx.row.original.iconUrl}
          width={20}
          height={20}
          alt={`${ctx.row.original.displayName} icon`}
        />
      ),
      meta: {
        headClassName: 'w-[32px] pr-0!',
        cellClassName: 'pr-0!',
      },
      size: 28,
      enableHiding: false,
    }),
    columnHelper.accessor('displayName', {
      header: itemTypeToHeader(itemType),
      cell: (ctx) => (
        <TwoRowCell>
          <TwoRowCell.First className="font-bold leading-none!">
            {ctx.row.original.displayName}
          </TwoRowCell.First>
          {ctx.row.original.issuer && (
            <TwoRowCell.Second>
              Issued by{' '}
              <span className="capitalize">{ctx.row.original.issuer}</span>
            </TwoRowCell.Second>
          )}
        </TwoRowCell>
      ),
    }),
    columnHelper.accessor('volume', {
      header: 'Last 24h\nVolume',
      cell: (ctx) => {
        if (ctx.row.original.volume === null) return EM_DASH
        return (
          <span className="font-medium text-label-value-15">
            {formatCurrency(ctx.row.original.volume, 'usd')}
          </span>
        )
      },
      meta: {
        align: 'right',
      },
    }),
    columnHelper.accessor('transferCount', {
      header: 'Last 24h\ntransfer count',
      cell: (ctx) => (
        <div className="font-medium text-label-value-15">
          {ctx.row.original.transferCount}
        </div>
      ),
      meta: {
        align: 'right',
      },
    }),
    columnHelper.accessor(
      (row) =>
        row.avgDuration?.type === 'unknown' || row.avgDuration === null
          ? undefined
          : row.avgDuration.type === 'single'
            ? row.avgDuration.duration
            : (row.avgDuration.in.duration ??
              row.avgDuration.out.duration ??
              Number.POSITIVE_INFINITY),
      {
        header: 'Last 24h avg.\ntransfer time',
        cell: (ctx) => {
          if (ctx.row.original.avgDuration === null) return EM_DASH
          return (
            <AvgDurationCell
              averageDuration={ctx.row.original.avgDuration}
              disableTooltip
            />
          )
        },
        meta: {
          align: 'right',
        },
      },
    ),
    columnHelper.accessor('avgValue', {
      header: 'Last 24h avg.\ntransfer value',
      cell: (ctx) => {
        if (ctx.row.original.avgValue === null) return EM_DASH

        const averageValue = formatCurrency(ctx.row.original.avgValue, 'usd')
        const minValue =
          ctx.row.original.minTransferValueUsd !== undefined
            ? formatCurrency(ctx.row.original.minTransferValueUsd, 'usd')
            : EM_DASH
        const maxValue =
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
            <TooltipPortal>
              <TooltipContent className="z-[1000] min-w-[200px]">
                <div className="font-medium text-label-value-14 text-secondary">
                  Transfer value
                </div>
                <HorizontalSeparator className="my-1" />
                <div className="flex items-center justify-between gap-x-6">
                  <span className="font-medium text-label-value-14">
                    Minimum
                  </span>
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {minValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-x-6">
                  <span className="font-medium text-label-value-14">
                    Average
                  </span>
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {averageValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-x-6">
                  <span className="font-medium text-label-value-14">
                    Maximum
                  </span>
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {maxValue}
                  </span>
                </div>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )
      },
    }),
    showNetMintedValueColumn &&
      columnHelper.accessor('netMintedValue', {
        header: 'Last 24h net\nminted value',
        meta: {
          align: 'right',
          headClassName: 'text-2xs',
        },
        cell: (ctx) => {
          if (ctx.row.original.netMintedValue === undefined) return EM_DASH
          return (
            <span className="font-medium text-label-value-15">
              {formatCurrency(ctx.row.original.netMintedValue, 'usd')}
            </span>
          )
        },
      }),
  ])

const itemTypeToHeader = (itemType: TopItemType) => {
  switch (itemType) {
    case 'tokens':
      return 'Symbol'
    case 'chains':
      return 'Chain'
    default:
      assertUnreachable(itemType)
  }
}
