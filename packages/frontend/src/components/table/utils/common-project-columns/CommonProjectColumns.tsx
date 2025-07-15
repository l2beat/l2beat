import type { ColumnHelper } from '@tanstack/react-table'
import { EM_DASH } from '~/consts/characters'
import { IndexCell } from '../../cells/IndexCell'

export interface CommonProjectColumnsEntry {
  slug: string
  name: string
  icon: string
}

export interface CommonProjectColumnsOptions {
  activity?: boolean
  ignoreUnderReviewIcon?: boolean
}

export function getCommonProjectColumns<T extends CommonProjectColumnsEntry>(
  columnHelper: ColumnHelper<T>,
  getHref: (row: T) => string | undefined,
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
      cell: (ctx) => {
        const image = (
          <img
            className="min-h-[20px] min-w-[20px]"
            src={ctx.row.original.icon}
            width={20}
            height={20}
            alt={`${ctx.row.original.name} logo`}
          />
        )
        const href = getHref(ctx.row.original)
        if (!href) return image

        return <a href={href}>{image}</a>
      },
      meta: {
        headClassName: 'w-0',
        cellClassName: 'lg:pr-1.5!',
      },
      size: 28,
    }),
  ] as const
}
