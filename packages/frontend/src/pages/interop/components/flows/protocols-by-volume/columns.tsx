import { createColumnHelper } from '@tanstack/react-table'
import type { BasicTableRow } from '~/components/table/BasicTable'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { TableLink } from '~/components/table/TableLink'
import { EM_DASH } from '~/consts/characters'
import { TopTokensCell } from '~/pages/interop/components/tokens/TopTokensCell'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropSelection } from '../../../utils/types'
import { BridgeTypeBadge } from '../../table/BridgeTypeBadge'
import { TopRouteCell } from './TopRouteCell'

export type ProtocolByVolumeRow = ProtocolEntry &
  BasicTableRow & { icon: string }

const columnHelper = createColumnHelper<ProtocolByVolumeRow>()

export function getProtocolsByVolumeColumns(apiSelection: InteropSelection) {
  return [
    columnHelper.accessor((_, index) => index + 1, {
      header: '#',
      cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
      sortDescFirst: false,
      meta: {
        headClassName: 'w-0',
      },
      size: 40,
      enableHiding: false,
    }),
    columnHelper.display({
      id: 'logo',
      cell: (ctx) => {
        return (
          <a href={`/interop/protocols/${ctx.row.original.slug}`}>
            <img
              className="min-h-[20px] min-w-[20px]"
              src={ctx.row.original.icon}
              width={20}
              height={20}
              fetchPriority="low"
              alt={`${ctx.row.original.name} logo`}
            />
          </a>
        )
      },
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
        <TableLink href={`/interop/protocols/${ctx.row.original.slug}`}>
          <span className="font-bold text-label-value-15">
            {ctx.row.original.name}
          </span>
        </TableLink>
      ),
      meta: {
        cellClassName: 'whitespace-normal md:pl-2!',
        headClassName: 'text-2xs md:pl-2!',
      },
    }),
    columnHelper.accessor('type', {
      header: 'Category',
      cell: (ctx) => (
        <div className="whitespace-nowrap font-medium text-xs capitalize leading-[15px] md:text-sm md:leading-[1.2]">
          {ctx.row.original.type}
        </div>
      ),
      meta: {
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor('bridgeTypes', {
      header: 'Transfer types',
      enableSorting: false,
      cell: (ctx) => {
        return (
          <div className="flex items-center gap-1" key={ctx.row.original.id}>
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
        headClassName: 'text-2xs',
      },
    }),
    columnHelper.accessor('volume', {
      header: 'Last 24h\nvolume',
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
        headClassName: 'text-2xs',
        tooltip:
          'The total USD value of all token transfers completed in the past 24 hours.',
      },
    }),
    columnHelper.accessor('transferCount', {
      header: 'Last 24h\ntransfers',
      cell: (ctx) => (
        <span className="font-medium text-label-value-15">
          {formatInteger(ctx.row.original.transferCount)}
        </span>
      ),
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip: 'The number of transfers completed in the past 24 hours.',
      },
    }),
    columnHelper.accessor('averageValue', {
      header: 'Last 24h avg.\ntransfer value',
      cell: (ctx) => {
        if (ctx.row.original.averageValue === null) return EM_DASH
        return (
          <span className="font-medium text-label-value-15">
            {formatCurrency(ctx.row.original.averageValue, 'usd')}
          </span>
        )
      },
      meta: {
        align: 'right',
        headClassName: 'text-2xs',
        tooltip:
          'The average USD value of a transfer completed in the past 24 hours.',
      },
    }),
    columnHelper.display({
      id: 'topRoute',
      header: 'Top route\nby volume',
      cell: (ctx) => <TopRouteCell route={ctx.row.original.topRoute} />,
      meta: {
        headClassName: 'text-2xs',
        tooltip:
          'The chain pair with the highest transfer volume for this protocol over the past 24 hours. Click to highlight it in the flows chart.',
      },
    }),
    columnHelper.display({
      id: 'tokens',
      header: 'Tokens\nby volume',
      cell: (ctx) => {
        const protocol = ctx.row.original
        return (
          <TopTokensCell
            topItems={protocol.tokens}
            type={undefined}
            apiSelection={apiSelection}
            protocol={{
              id: protocol.id,
              name: protocol.name,
              slug: protocol.slug,
              iconUrl: protocol.iconUrl,
            }}
          />
        )
      },
      meta: {
        cellClassName: '!pr-0',
        headClassName: 'text-2xs',
        tooltip:
          'Tokens involved in transfers over the past 24 hours, ranked by total transfer volume.',
      },
    }),
  ]
}
