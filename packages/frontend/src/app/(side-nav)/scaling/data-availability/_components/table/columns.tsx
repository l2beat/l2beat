import { createColumnHelper } from '@tanstack/react-table'
import { SentimentText } from '~/components/sentiment-text'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import {
  TypeCell,
  TypeExplanationTooltip,
  providerMap,
} from '~/components/table/cells/type-cell'
import { sortByDacMembers } from '~/components/table/sorting/functions/sort-by-dac-members'
import { sortBySentiment } from '~/components/table/sorting/functions/sort-by-sentiment'
import { sortTwoRowCell } from '~/components/table/sorting/functions/sort-two-row-cell'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { type ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'

const columnHelper = createColumnHelper<ScalingDaEntry>()

export const columns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.accessor('category', {
    header: 'Type',
    meta: {
      tooltip: <TypeExplanationTooltip />,
    },
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
    sortingFn: ({ original: a }, { original: b }) =>
      sortTwoRowCell(
        {
          value: a.category ?? '',
          secondLine: a.provider && providerMap[a.provider]?.text,
        },
        {
          value: b.category ?? '',
          secondLine: b.provider && providerMap[b.provider]?.text,
        },
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
        <TwoRowCell>
          <TwoRowCell.First>
            <SentimentText
              sentiment={data.sentiment}
              description={data.description}
            >
              {ctx.getValue()}
            </SentimentText>
          </TwoRowCell.First>
          {data.secondLine && (
            <TwoRowCell.Second>{data.secondLine}</TwoRowCell.Second>
          )}
        </TwoRowCell>
      )
    },
    sortDescFirst: true,
    sortingFn: (a, b) => {
      const sentimentResult = sortBySentiment(
        a.original.dataAvailability.layer,
        b.original.dataAvailability.layer,
      )
      if (sentimentResult !== 0) {
        return sentimentResult
      }

      return sortTwoRowCell(
        a.original.dataAvailability.layer,
        b.original.dataAvailability.layer,
      )
    },
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
    sortDescFirst: true,
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
  columnHelper.accessor('dataAvailability.mode.value', {
    header: 'Type of data',
    cell: (ctx) => {
      return (
        <TwoRowCell>
          <TwoRowCell.First>
            {ctx.row.original.dataAvailability.mode.value}
          </TwoRowCell.First>
          {ctx.row.original.dataAvailability.mode.secondLine && (
            <TwoRowCell.Second>
              {ctx.row.original.dataAvailability.mode.secondLine}
            </TwoRowCell.Second>
          )}
        </TwoRowCell>
      )
    },
    sortingFn: (a, b) =>
      sortTwoRowCell(
        a.original.dataAvailability.mode,
        b.original.dataAvailability.mode,
      ),
  }),
]
