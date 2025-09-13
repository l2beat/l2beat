import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { CombinedGrissiniCell } from '~/components/rosette/grissini/CombinedGrissiniCell'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type { ScalingRiskDaEntry } from '~/server/features/scaling/risks/data-availability/getScalingRiskDaEntries'

const columnHelper = createColumnHelper<ScalingRiskDaEntry>()

export function getScalingRiskDataAvailabilityColumns(
  hideProofSystem?: boolean,
) {
  return compact([
    ...getScalingCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}`,
    ),
    !hideProofSystem &&
      columnHelper.accessor('proofSystem', {
        header: 'Proof system',
        cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
        meta: {
          tooltip:
            'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
        },
      }),
    columnHelper.accessor((e) => adjustTableValue(e.dataAvailability.layer), {
      header: 'DA Layer',
      meta: {
        tooltip:
          'The data availability layer where the data (transaction data or state diffs) is published.',
      },
      cell: (ctx) => (
        <TableValueCell
          value={ctx.row.original.dataAvailability.layer}
          href={ctx.row.original.daHref?.summary}
        />
      ),
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(
          a.original.dataAvailability.layer,
          b.original.dataAvailability.layer,
        ),
    }),
    columnHelper.accessor((e) => adjustTableValue(e.dataAvailability.bridge), {
      header: 'DA Bridge',
      meta: {
        tooltip:
          'The DA bridge used for informing Ethereum contracts if data has been made available.',
      },
      cell: (ctx) => (
        <TableValueCell
          value={ctx.row.original.dataAvailability.bridge}
          href={ctx.row.original.daHref?.risk}
        />
      ),
      sortDescFirst: true,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(
          a.original.dataAvailability.bridge,
          b.original.dataAvailability.bridge,
        ),
    }),
    columnHelper.display({
      header: 'Risks',
      cell: (ctx) => {
        if (!ctx.row.original.risks) {
          return <NotApplicableBadge />
        }

        return (
          <TableLink href={ctx.row.original.daHref?.risk}>
            <CombinedGrissiniCell
              daLayerRisks={ctx.row.original.risks.daLayer}
              daBridgeRisks={ctx.row.original.risks.daBridge}
            />
          </TableLink>
        )
      },
      meta: {
        align: 'center',
      },
    }),
    columnHelper.accessor((e) => adjustTableValue(e.dataAvailability.mode), {
      header: 'Type of data',
      cell: (ctx) => (
        <TableValueCell value={ctx.row.original.dataAvailability.mode} />
      ),
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortTableValues(
          a.original.dataAvailability.mode,
          b.original.dataAvailability.mode,
        ),
    }),
  ])
}
