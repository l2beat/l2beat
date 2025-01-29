import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { sortBySentimentAndAlphabetically } from '~/components/table/sorting/functions/sort-by-sentiment'
import { getBridgesCommonProjectColumns } from '~/components/table/utils/common-project-columns/bridges-common-project-columns'
import { type BridgesRiskEntry } from '~/server/features/bridges/get-bridges-risk-entries'

const columnHelper = createColumnHelper<BridgesRiskEntry>()

export const bridgesRisksColumns = [
  ...getBridgesCommonProjectColumns(columnHelper),
  columnHelper.accessor('destination', {
    header: 'Destination',
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    sortingFn: (a, b) => {
      const sentimentResult = sortBySentimentAndAlphabetically(
        a.original.destination,
        b.original.destination,
      )
      if (sentimentResult !== 0) {
        return sentimentResult
      }
      return (
        (a.original.destination.description?.split(',').length ?? 0) -
        (b.original.destination.description?.split(',').length ?? 0)
      )
    },
    meta: {
      tooltip: 'What chains can you get to using this bridge?',
    },
  }),
  columnHelper.accessor('riskView.validatedBy', {
    header: 'Validated by',
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    meta: {
      tooltip: 'How are the messages sent via this bridge checked?',
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortBySentimentAndAlphabetically(
        a.original.riskView.validatedBy,
        b.original.riskView.validatedBy,
      ),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (ctx) => <TypeCell>{ctx.getValue()}</TypeCell>,
    meta: {
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
    },
  }),
  columnHelper.accessor('riskView.sourceUpgradeability', {
    header: 'Source\nUpgradeability',
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    meta: {
      tooltip:
        'Are the Ethereum contracts upgradeable? Note that the delay itself might not be enough to ensure that users can withdraw their funds in the case of a malicious and censoring operator.',
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortBySentimentAndAlphabetically(
        a.original.riskView.sourceUpgradeability,
        b.original.riskView.sourceUpgradeability,
      ),
  }),
  columnHelper.accessor('riskView.destinationToken', {
    header: 'Destination Token',
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    meta: {
      tooltip: 'What is the token that you receive from this bridge?',
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortBySentimentAndAlphabetically(
        a.original.riskView.destinationToken,
        b.original.riskView.destinationToken,
      ),
  }),
]
