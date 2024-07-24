import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { SentimentText } from '~/app/_components/sentiment-text'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import {
  TypeCell,
  TypeColumnTooltip,
} from '~/app/_components/table/cells/type-cell'
import { sortSentiments } from '~/app/_components/table/sorting/functions/sentiment-sorting'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/types'

const columnHelper = createColumnHelper<ScalingDataAvailabilityEntry>()

export const columns = [
  // TODO: Make sure this is centered
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'flex items-center',
    },
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-w-[18px] min-h-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: '!pr-0 md:pl-1',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
      />
    ),
  }),
]
