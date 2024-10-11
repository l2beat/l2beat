import { type Row, createColumnHelper } from '@tanstack/react-table'
import { NoInfoCell } from '~/components/table/cells/no-info-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { sortSentiments } from '~/components/table/sorting/functions/sentiment-sorting'
import { type BridgesRiskEntry } from '~/server/features/bridges/get-bridges-risk-entries'

const sortBridgeRisks =
  (key: 'validatedBy' | 'sourceUpgradeability' | 'destinationToken') =>
  (a: Row<BridgesRiskEntry>, b: Row<BridgesRiskEntry>) => {
    return !a.original[key] || !b.original[key]
      ? -1
      : sortSentiments(a.original[key], b.original[key])
  }

const columnHelper = createColumnHelper<BridgesRiskEntry>()

export const bridgesRisksColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('destination', {
    header: 'Destination',
    cell: (ctx) => {
      const destination = ctx.getValue()

      return destination ? <RiskCell risk={destination} /> : <NoInfoCell />
    },
    meta: {
      tooltip: 'What chains can you get to using this bridge?',
    },
  }),
  columnHelper.accessor('validatedBy', {
    header: 'Validated by',
    cell: (ctx) => {
      const validatedBy = ctx.getValue()

      return validatedBy ? <RiskCell risk={validatedBy} /> : <NoInfoCell />
    },
    meta: {
      tooltip: 'How are the messages sent via this bridge checked?',
    },
    sortUndefined: 'last',
    sortingFn: sortBridgeRisks('validatedBy'),
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => {
      return <TypeCell>{ctx.row.original.category}</TypeCell>
    },
    meta: {
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
    },
  }),
  columnHelper.accessor('sourceUpgradeability', {
    header: 'Source\nUpgradeability',
    cell: (ctx) => {
      const sourceUpgradeability = ctx.getValue()

      return sourceUpgradeability ? (
        <RiskCell risk={sourceUpgradeability} />
      ) : (
        <NoInfoCell />
      )
    },
    meta: {
      tooltip:
        'Are the Ethereum contracts upgradeable? Note that the delay itself might not be enough to ensure that users can withdraw their funds in the case of a malicious and censoring operator.',
    },
    sortUndefined: 'last',
    sortingFn: sortBridgeRisks('sourceUpgradeability'),
  }),
  columnHelper.accessor('destinationToken', {
    header: 'Destination Token',
    cell: (ctx) => {
      const destinationToken = ctx.getValue()

      return destinationToken ? (
        <RiskCell risk={destinationToken} />
      ) : (
        <NoInfoCell />
      )
    },
    meta: {
      tooltip: 'What is the token that you receive from this bridge?',
    },
    sortUndefined: 'last',
    sortingFn: sortBridgeRisks('destinationToken'),
  }),
]
