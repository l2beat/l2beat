import { type CellContext, type ColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from './cells/index-cell'

interface BaseProject {
  slug: string
  name: string
}

export function getCommonProjectColumns<T extends BaseProject>(
  columnHelper: ColumnHelper<T>,
  shouldShowEmpty?: (ctx: CellContext<T, unknown>) => boolean,
) {
  return [
    columnHelper.accessor((_, index) => index + 1, {
      header: '#',
      cell: (ctx) => {
        if (shouldShowEmpty && !shouldShowEmpty(ctx)) return null
        return <IndexCell>{ctx.row.index + 1}</IndexCell>
      },
      meta: {
        headClassName: 'w-0',
      },
      size: 44,
    }),
    columnHelper.display({
      id: 'logo',
      cell: (ctx) => {
        if (shouldShowEmpty && !shouldShowEmpty(ctx)) return null
        return (
          <Image
            className="min-h-[18px] min-w-[18px]"
            src={`/icons/${ctx.row.original.slug}.png`}
            width={18}
            height={18}
            alt={`${ctx.row.original.name} logo`}
          />
        )
      },
      meta: {
        headClassName: 'w-0',
        cellClassName: 'lg:!pr-1.5',
      },
      size: 26,
    }),
  ]
}
