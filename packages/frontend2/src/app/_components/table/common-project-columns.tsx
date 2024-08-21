import { ColumnHelper } from '@tanstack/react-table'
import { IndexCell } from './cells/index-cell'
import Image from 'next/image'
import { ProjectNameCell } from './cells/project-name-cell'

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
      size: 44.55,
    }),
    columnHelper.display({
      id: 'logo',
      cell: (ctx) => (
        <Image
          className="min-h-[18px] min-w-[18px]"
          src={`/icons/${ctx.row.original.slug}.png`}
          width={18}
          height={18}
          alt={`${ctx.row.original.name} logo`}
        />
      ),
      meta: {
        headClassName: 'w-0',
        cellClassName: 'lg:!pr-0',
      },
      size: 26,
    }),
  ]
}
