import { type ColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { EM_DASH } from '~/consts/characters'
import { IndexCell } from '../cells/index-cell'

interface BaseProject {
  slug: string
  name: string
}

export interface CommonProjectColumnsOptions {
  customActivityIndexing?: boolean
}

export function getCommonProjectColumns<T extends BaseProject>(
  columnHelper: ColumnHelper<T>,
  opts?: CommonProjectColumnsOptions,
) {
  return [
    columnHelper.accessor((_, index) => index + 1, {
      header: '#',
      cell: (ctx) => (
        <IndexCell>
          {opts?.customActivityIndexing
            ? ctx.row.index === 0
              ? EM_DASH
              : ctx.row.index
            : ctx.row.index + 1}
        </IndexCell>
      ),
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
