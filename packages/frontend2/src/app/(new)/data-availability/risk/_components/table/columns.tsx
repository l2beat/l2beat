import { createColumnHelper } from '@tanstack/react-table'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { type DaRiskEntry } from '~/server/features/data-availability/get-da-risk-entries'
import { DaBridgeCell } from '../../../summary/_components/table/da-bridge-cell'
import { sortSentiments } from '~/app/_components/table/sorting/functions/sentiment-sorting'

const columnHelper = createColumnHelper<DaRiskEntry>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => ctx.row.index + 1,
  }),
  columnHelper.accessor('daLayer', {
    header: 'DA Layer',
  }),
  columnHelper.accessor('daBridge', {
    header: 'DA Bridge',
    cell: (ctx) => <DaBridgeCell daBridge={ctx.getValue()} />,
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
