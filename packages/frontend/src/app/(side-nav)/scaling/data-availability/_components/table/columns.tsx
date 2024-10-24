import { createColumnHelper } from '@tanstack/react-table'
import { SentimentText } from '~/components/sentiment-text'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { sortByDacMembers } from '~/components/table/sorting/functions/sort-by-dac-members'
import {
  sortBySentiment,
  sortBySentimentAndAlphabetically,
} from '~/components/table/sorting/functions/sort-by-sentiment'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'

const columnHelper = createColumnHelper<ScalingDataAvailabilityEntry>()

export const columns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>
        {ctx.row.original.category}
      </TypeCell>
    ),
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
      sortBySentimentAndAlphabetically(
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
    sortingFn: (a, b) => {
      const bridgeA = a.original.dataAvailability.bridge
      const bridgeB = b.original.dataAvailability.bridge
      const sentimentResult = sortBySentiment(bridgeA, bridgeB)
      if (sentimentResult !== 0) {
        return sentimentResult
      }

      const dacMembersResult = sortByDacMembers(bridgeA, bridgeB)
      if (dacMembersResult !== 0) {
        return dacMembersResult
      }

      return (bridgeA?.value ?? '').localeCompare(bridgeB?.value ?? '')
    },
  }),
  columnHelper.accessor('dataAvailability.mode', {
    header: 'Type of data',
  }),
]
