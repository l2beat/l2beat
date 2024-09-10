import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { sortSentiments } from '~/components/table/sorting/functions/sentiment-sorting'
import ChevronDown from '~/icons/chevron.svg'
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
              e.stopPropagation()
              ctx.row.toggleExpanded()
            }}
          >
            Multiple bridges
            <ChevronDown
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
  }),
  columnHelper.accessor('risks.fraudDetection', {
    header: 'Fraud detection',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.fraudDetection,
        rowB.original.risks.fraudDetection,
      ),
  }),
  columnHelper.accessor('risks.attestations', {
    header: 'Attestation security',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    enableSorting: false,
  }),
  columnHelper.accessor('risks.exitWindow', {
    header: 'Exit window',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    enableSorting: false,
  }),
  columnHelper.accessor('risks.accessibility', {
    header: 'Accessibility',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} emptyMode="em-dash" />,
    enableSorting: false,
  }),
]
