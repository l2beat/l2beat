import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { getCommonProjectColumns } from '~/app/_components/table/common-project-columns'
import { sortSentiments } from '~/app/_components/table/sorting/functions/sentiment-sorting'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'

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
    cell: (ctx) => (
      <ProjectNameCell
        className="!pl-0"
        project={{
          ...ctx.row.original,
          name: ctx.getValue().name,
          shortName: undefined,
        }}
      />
    ),
  }),
  columnHelper.accessor('risks.economicSecurity', {
    header: 'Economic security',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.economicSecurity,
        rowB.original.risks.economicSecurity,
      ),
  }),
  columnHelper.accessor('risks.fraudDetection', {
    header: 'Fraud detection',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.fraudDetection,
        rowB.original.risks.fraudDetection,
      ),
  }),
  columnHelper.accessor('risks.attestations', {
    header: 'Attestation security',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.attestations,
        rowB.original.risks.attestations,
      ),
  }),
  columnHelper.accessor('risks.exitWindow', {
    header: 'Exit window',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.exitWindow,
        rowB.original.risks.exitWindow,
      ),
  }),
  columnHelper.accessor('risks.accessibility', {
    header: 'Accessibility',
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (rowA, rowB) =>
      sortSentiments(
        rowA.original.risks.accessibility,
        rowB.original.risks.accessibility,
      ),
  }),
]
