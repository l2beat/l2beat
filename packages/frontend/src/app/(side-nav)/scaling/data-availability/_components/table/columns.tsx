import { createColumnHelper } from '@tanstack/react-table'
import { SentimentText } from '~/components/sentiment-text'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { sortSentiments } from '~/components/table/sorting/functions/sentiment-sorting'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'

const columnHelper = createColumnHelper<ScalingDataAvailabilityEntry>()

export const columns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('stateValidation', {
    header: 'Proof system',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} colorful={false} />,
    enableSorting: false,
  }),
  columnHelper.accessor('dataAvailability.layer', {
    header: 'DA Layer',
    meta: {
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is published.',
    },
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
    meta: {
      tooltip:
        'The DA bridge used for informing Ethereum contracts if data has been made available.',
    },
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
