import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { CombinedGrissiniCell } from '~/components/rosette/grissini/CombinedGrissiniCell'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TableLink } from '~/components/table/TableLink'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/getScalingDaEntries'

const columnHelper = createColumnHelper<ScalingDaEntry>()

export function getScalingDataAvailabilityColumns(hideProofSystem?: boolean) {
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
    columnHelper.display({
      header: 'DA Layer',
      meta: {
        tooltip:
          'The data availability layer where the data (transaction data or state diffs) is published.',
        cellClassName: 'pl-3',
        additionalRows: (ctx) => {
          return ctx.row.original.dataAvailability
            .slice(1)
            .map((da, i) => (
              <TableValueCell
                key={da.layer.value}
                value={da.layer}
                href={da.daHref?.summary}
              />
            ))
        },
      },
      cell: (ctx) => {
        const firstDa = ctx.row.original.dataAvailability[0]
        const firstDaHref = firstDa?.daHref
        return (
          <TableValueCell value={firstDa?.layer} href={firstDaHref?.summary} />
        )
      },
      sortDescFirst: true,
      sortUndefined: 'last',
    }),
    columnHelper.display({
      header: 'DA Bridge',
      meta: {
        tooltip:
          'The DA bridge used for informing Ethereum contracts if data has been made available.',
        additionalRows: (ctx) => {
          return ctx.row.original.dataAvailability
            .slice(1)
            .map((da, i) => (
              <TableValueCell
                key={da.layer.value}
                value={da.bridge}
                href={da.daHref?.risk}
              />
            ))
        },
      },
      cell: (ctx) => {
        const firstDa = ctx.row.original.dataAvailability[0]
        const firstDaHref = firstDa?.daHref
        return (
          <TableValueCell value={firstDa?.bridge} href={firstDaHref?.risk} />
        )
      },
      sortDescFirst: true,
      sortUndefined: 'last',
    }),
    columnHelper.display({
      header: 'Risks',
      cell: (ctx) => {
        const firstDaRisk = ctx.row.original.risks?.[0]
        if (!firstDaRisk) {
          return <NotApplicableBadge />
        }

        return (
          <TableLink href={firstDaRisk.daHref?.risk}>
            <CombinedGrissiniCell
              daLayerRisks={firstDaRisk.daLayer}
              daBridgeRisks={firstDaRisk.daBridge}
            />
          </TableLink>
        )
      },
      meta: {
        align: 'center',
        additionalRows: (ctx) => {
          return (
            ctx.row.original.risks?.slice(1).map((risk, i) => (
              <TableLink key={i} href={risk.daHref?.risk}>
                <CombinedGrissiniCell
                  daLayerRisks={risk.daLayer}
                  daBridgeRisks={risk.daBridge}
                />
              </TableLink>
            )) ?? []
          )
        },
      },
    }),
    columnHelper.display({
      header: 'Type of data',
      cell: (ctx) => {
        return (
          <TableValueCell value={ctx.row.original.dataAvailability[0]?.mode} />
        )
      },
      meta: {
        additionalRows: (ctx) => {
          return ctx.row.original.dataAvailability
            .slice(1)
            .map((da, i) => (
              <TableValueCell key={da.layer.value} value={da.mode} />
            ))
        },
      },
      sortUndefined: 'last',
    }),
  ])
}
