import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { Badge } from '~/components/badge/Badge'
import { CombinedGrissiniCell } from '~/components/rosette/grissini/CombinedGrissiniCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import {
  TypeExplanationTooltip,
  TypeInfo,
} from '~/components/table/cells/TypeInfo'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/getScalingDaEntries'

const columnHelper = createColumnHelper<ScalingDaEntry>()

export function getScalingDataAvailabilityColumns(hideType?: boolean) {
  return compact([
    ...getScalingCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}`,
    ),
    !hideType &&
      columnHelper.accessor('category', {
        header: 'Type',
        meta: {
          tooltip: <TypeExplanationTooltip />,
        },
        cell: (ctx) => (
          <TypeInfo stacks={ctx.row.original.stacks}>{ctx.getValue()}</TypeInfo>
        ),
        sortingFn: (a, b) => {
          const categoryCompare = a.original.category.localeCompare(
            b.original.category,
          )
          if (categoryCompare !== 0) {
            return categoryCompare
          }

          const stackCompare = (a.original.stacks?.[0] ?? '').localeCompare(
            b.original.stacks?.[0] ?? '',
          )
          return stackCompare
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
          return <Badge type="gray">N/A</Badge>
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
