import { createColumnHelper } from '@tanstack/react-table'
import { SentimentText } from '~/components/sentiment-text'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { sortByDacMembers } from '~/components/table/sorting/functions/sort-by-dac-members'
import {
  sortBySentiment,
  sortBySentimentAndAlphabetically,
} from '~/components/table/sorting/functions/sort-by-sentiment'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'

const columnHelper = createColumnHelper<ScalingDataAvailabilityEntry>()

export const columns = [
  ...getScalingCommonProjectColumns(columnHelper),
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
  columnHelper.accessor('dataAvailability.layer.value', {
    header: 'DA Layer',
    meta: {
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is published.',
    },
    cell: (ctx) => {
      const data = ctx.row.original.dataAvailability.layer
      return (
        <SentimentText
          sentiment={data.sentiment}
          description={data.description}
        >
          {ctx.getValue()}
        </SentimentText>
      )
    },
    sortingFn: (a, b) =>
      sortBySentimentAndAlphabetically(
        a.original.dataAvailability.layer,
        b.original.dataAvailability.layer,
      ),
  }),
  columnHelper.accessor('dataAvailability.bridge.value', {
    header: 'DA Bridge',
    meta: {
      tooltip:
        'The DA bridge used for informing Ethereum contracts if data has been made available.',
    },
    cell: (ctx) => {
      const data = ctx.row.original.dataAvailability.bridge
      return (
        <SentimentText
          sentiment={data.sentiment}
          description={data.description}
        >
          {ctx.getValue()}
        </SentimentText>
      )
    },
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
