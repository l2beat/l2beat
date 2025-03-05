import type { ColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { LinkWithOnHoverPrefetch } from '~/components/link/link-with-on-hover-prefetch'
import { EM_DASH } from '~/consts/characters'
import { IndexCell } from '../../cells/index-cell'

export interface CommonProjectColumnsEntry {
  slug: string
  name: string
}

export interface CommonProjectColumnsOptions {
  activity?: boolean
}

export function getCommonProjectColumns<T extends CommonProjectColumnsEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    columnHelper.accessor((_, index) => index + 1, {
      header: '#',
      cell: (ctx) => (
        <IndexCell>
          {opts?.activity
            ? ctx.row.index === 0
              ? EM_DASH
              : ctx.row.index
            : ctx.row.index + 1}
        </IndexCell>
      ),
      sortDescFirst: false,
      meta: {
        headClassName: 'w-0',
      },
      size: 44,
    }),
    columnHelper.display({
      id: 'logo',
      cell: (ctx) => (
        <LinkWithOnHoverPrefetch href={getHref(ctx.row.original)}>
          <Image
            className="min-h-[20px] min-w-[20px]"
            src={`/icons/${ctx.row.original.slug}.png`}
            width={20}
            height={20}
            alt={`${ctx.row.original.name} logo`}
          />
        </LinkWithOnHoverPrefetch>
      ),
      meta: {
        headClassName: 'w-0',
        cellClassName: 'lg:!pr-1.5',
      },
      size: 28,
    }),
  ] as const
}
