import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { SentimentText } from '~/app/_components/sentiment-text'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
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
      cellClassName: '!pr-0',
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
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>
        {ctx.row.original.category}
      </TypeCell>
    ),
  }),
  columnHelper.accessor('dataAvailability.layer', {
    header: 'DA Layer',
    cell: (ctx) => {
      const layer = ctx.getValue()
      return (
        <SentimentText
          sentiment={layer.sentiment}
          description={layer.description}
        >
          {layer.value}
        </SentimentText>
      )
    },
    sortingFn: (a, b) =>
      sortSentiments(
        a.original.dataAvailability.layer,
        b.original.dataAvailability.layer,
      ),
  }),
  columnHelper.accessor('dataAvailability.bridge', {
    header: 'DA Bridge',
    cell: (ctx) => (
      <SentimentText
        sentiment={ctx.row.original.dataAvailability.bridge.sentiment}
        description={ctx.row.original.dataAvailability.bridge.description}
      >
        {ctx.row.original.dataAvailability.bridge.value}
      </SentimentText>
    ),
    sortingFn: (a, b) =>
      sortSentiments(
        a.original.dataAvailability.bridge,
        b.original.dataAvailability.bridge,
      ),
  }),
  columnHelper.accessor('dataAvailability.mode', {
    header: 'Type of data',
  }),
]
