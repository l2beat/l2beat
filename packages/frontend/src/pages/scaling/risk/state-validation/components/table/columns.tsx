import { createColumnHelper } from '@tanstack/react-table'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { TrustedSetupCell } from '~/pages/zk-catalog/v2/components/TrustedSetupCell'
import type {
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationZkEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'

const zkColumnHelper = createColumnHelper<ScalingRiskStateValidationZkEntry>()

export const scalingRiskStateValidationColumns = [
  ...getScalingCommonProjectColumns(
    zkColumnHelper,
    (row) => `/scaling/projects/${row.slug}#state-validation`,
  ),
  zkColumnHelper.accessor('proofSystem', {
    header: 'Proof system',
    cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
    meta: {
      tooltip:
        'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
    },
  }),
  zkColumnHelper.accessor('isa', {
    header: 'ISA',
    cell: (ctx) => (
      <TableValueCell
        value={
          ctx.row.original.isa
            ? {
                value: ctx.row.original.isa,
              }
            : undefined
        }
        emptyMode="n/a"
      />
    ),
  }),
  zkColumnHelper.accessor('trustedSetups', {
    header: 'Trusted setup',
    cell: (ctx) => {
      const trustedSetupEntries = Object.entries(
        ctx.row.original.trustedSetups ?? {},
      )

      if (trustedSetupEntries.length === 0) {
        return <TableValueCell value={undefined} emptyMode="n/a" />
      }
      return (
        <div className="flex flex-col gap-2 py-2">
          {trustedSetupEntries.map(([key, ts]) => (
            <TrustedSetupCell key={key} trustedSetup={{ trustedSetup: ts }} />
          ))}
        </div>
      )
    },
    meta: {
      tooltip:
        'Trusted setup information for the proof system used by this project',
    },
  }),
]

const optimisticColumnHelper =
  createColumnHelper<ScalingRiskStateValidationOptimisticEntry>()

export const scalingRiskStateValidationOptimisticColumns = [
  ...getScalingCommonProjectColumns(
    optimisticColumnHelper,
    (row) => `/scaling/projects/${row.slug}#state-validation`,
  ),
  optimisticColumnHelper.accessor('proofSystem', {
    header: 'Proof system',
    cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
    meta: {
      tooltip:
        'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
    },
  }),
]
