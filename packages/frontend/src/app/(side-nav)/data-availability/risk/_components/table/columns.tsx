import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { sortSentiments } from '~/components/table/sorting/functions/sentiment-sorting'
import { ChevronIcon } from '~/icons/chevron'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { cn } from '~/utils/cn'

const columnHelper = createColumnHelper<DaRiskEntry>()

export const columns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    header: 'DA Layer',
    cell: (ctx) => (
      <ProjectNameCell
        project={{
          name: ctx.getValue(),
        }}
      />
    ),
    meta: {
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is posted.',
    },
  }),
  columnHelper.accessor('daBridge', {
    header: 'DA Bridge',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (value === 'multiple') {
        return (
          <button
            className="flex flex-row items-center gap-4 italic text-gray-500 dark:text-gray-400"
            onClick={(e) => {
              e.preventDefault()
              ctx.row.toggleExpanded()
            }}
          >
            Multiple bridges
            <ChevronIcon
              className={cn(
                'fill-black transition-transform dark:fill-white',
                ctx.row.getIsExpanded() && 'rotate-180',
              )}
            />
          </button>
        )
      }
      return (
        <ProjectNameCell
          className="!pl-0"
          project={{
            ...ctx.row.original,
            name: value.name,
            shortName: undefined,
          }}
        />
      )
    },
    meta: {
      cellClassName: 'pl-8',
      headClassName: 'pl-8',
      tooltip:
        'The DA bridge through which Ethereum is informed that data has been made available. There might be multiple options for each layer, and L2s can choose which one to use, if any.',
    },
  }),
  columnHelper.accessor('risks.economicSecurity', {
    header: 'Economic security',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.economicSecurity,
        rowB.original.risks.economicSecurity,
      ),
    meta: {
      tooltip:
        'Shows if there are any onchain (staked assets) or offchain (reputation) guarantees that would prevent a committee from deceiving the DA bridge.',
    },
  }),
  columnHelper.accessor('risks.fraudDetection', {
    header: 'Fraud detection',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.fraudDetection,
        rowB.original.risks.fraudDetection,
      ),
    meta: {
      tooltip:
        'Shows if there are any mechanism for users to protect themselves against a malicious majority of committee members, such as validators, and recover from data withholding attack.',
    },
  }),
  columnHelper.accessor('risks.attestations', {
    header: 'Attestation security',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    enableSorting: false,
    meta: {
      tooltip:
        'Shows if the DA bridge can securely confirm that the data availability attestations are backed by the DA layer’s economic security, meaning that the signatures from the DA layer are accurately verified and tracked on-chain.',
    },
  }),
  columnHelper.accessor('risks.exitWindow', {
    header: 'Exit window',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    enableSorting: false,
    meta: {
      tooltip:
        'Shows if the DA bridge can be upgraded, and if yes - if there’s a mechanism in place for withdrawals, and the time allowed for users to exit in case of an upgrade. ',
    },
  }),
  columnHelper.accessor('risks.accessibility', {
    header: 'Accessibility',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    enableSorting: false,
    meta: {
      tooltip:
        'Shows if there is an additional trust assumption on the majority of committee members. It distinguishes between DA solutions that are integrated into the Ethereum protocol (enshrined) and those that are external, thus requiring an additional trust assumption.',
    },
  }),
]
