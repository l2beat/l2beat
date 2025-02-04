import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { TypeInfo } from '~/components/table/cells/type-info'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sort-table-values'
import { getBridgesCommonProjectColumns } from '~/components/table/utils/common-project-columns/bridges-common-project-columns'
import type { BridgesRiskEntry } from '~/server/features/bridges/get-bridges-risk-entries'

const columnHelper = createColumnHelper<BridgesRiskEntry>()

export const bridgesRisksColumns = [
  ...getBridgesCommonProjectColumns(columnHelper),
  columnHelper.accessor((e) => adjustTableValue(e.destination), {
    header: 'Destination',
    meta: {
      tooltip: 'What chains can you get to using this bridge?',
    },
    cell: (ctx) => <TableValueCell value={ctx.row.original.destination} />,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.destination, b.original.destination),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.riskView.validatedBy), {
    header: 'Validated by',
    meta: {
      tooltip: 'How are the messages sent via this bridge checked?',
    },
    cell: (ctx) => (
      <TableValueCell value={ctx.row.original.riskView.validatedBy} />
    ),
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.riskView.validatedBy,
        b.original.riskView.validatedBy,
      ),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    meta: {
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
    },
    cell: (ctx) => <TypeInfo>{ctx.getValue()}</TypeInfo>,
  }),
  columnHelper.accessor(
    (e) => adjustTableValue(e.riskView.sourceUpgradeability),
    {
      header: 'Source\nUpgradeability',
      meta: {
        tooltip:
          'Are the Ethereum contracts upgradeable? Note that the delay itself might not be enough to ensure that users can withdraw their funds in the case of a malicious and censoring operator.',
      },
      cell: (ctx) => (
        <TableValueCell
          value={ctx.row.original.riskView.sourceUpgradeability}
        />
      ),
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(
          a.original.riskView.sourceUpgradeability,
          b.original.riskView.sourceUpgradeability,
        ),
    },
  ),
  columnHelper.accessor((e) => adjustTableValue(e.riskView.destinationToken), {
    header: 'Destination Token',
    meta: {
      tooltip: 'What is the token that you receive from this bridge?',
    },
    cell: (ctx) => (
      <TableValueCell value={ctx.row.original.riskView.destinationToken} />
    ),
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.riskView.destinationToken,
        b.original.riskView.destinationToken,
      ),
  }),
]
