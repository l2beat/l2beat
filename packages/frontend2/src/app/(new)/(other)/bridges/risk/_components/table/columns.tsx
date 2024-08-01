import { type Row, createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { NoInfoCell } from '~/app/_components/table/cells/no-info-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { sortSentiments } from '~/app/_components/table/sorting/functions/sentiment-sorting'
import { type BridgesRiskEntry } from '~/server/features/bridges/types'

const sortBridgeRisks =
  (key: 'validatedBy' | 'sourceUpgradeability' | 'destinationToken') =>
  (a: Row<BridgesRiskEntry>, b: Row<BridgesRiskEntry>) => {
    return !a.original[key] || !b.original[key]
      ? -1
      : sortSentiments(a.original[key], b.original[key])
  }

const columnHelper = createColumnHelper<BridgesRiskEntry>()

export const bridgesRisksColumns = [
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
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    size: 26,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:!pr-0 pl-2',
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
