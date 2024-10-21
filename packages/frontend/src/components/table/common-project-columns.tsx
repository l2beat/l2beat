import { type ColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from './cells/index-cell'

interface BaseProject {
  slug: string
  name: string
}

export function getCommonProjectColumns<T extends BaseProject>(
  columnHelper: ColumnHelper<T>,
) {
  return [
    columnHelper.accessor((_, index) => index + 1, {
      header: '#',
      cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
      meta: {
        headClassName: 'w-0',
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
      },
      size: 28,
    }),
  ]
}
