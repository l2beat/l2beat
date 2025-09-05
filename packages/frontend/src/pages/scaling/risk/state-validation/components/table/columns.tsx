import { formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { TrustedSetupCell } from '~/pages/zk-catalog/v2/components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import type {
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationValidityEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'

const validityColumnHelper =
  createColumnHelper<ScalingRiskStateValidationValidityEntry>()

export const scalingRiskStateValidationValidityColumns = [
  ...getScalingCommonProjectColumns(
    validityColumnHelper,
    (row) => `/scaling/projects/${row.slug}#state-validation`,
  ),
  validityColumnHelper.accessor('proofSystem', {
    header: 'Proof system',
    cell: (ctx) => <ProofSystemCell {...ctx.row.original} hideType />,
    meta: {
      tooltip:
        'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
    },
  }),
  validityColumnHelper.accessor('executionDelay', {
    header: 'Execution Delay',
    cell: (ctx) => (
      <TableValueCell
        value={
          ctx.row.original.executionDelay !== undefined
            ? {
                value: formatSeconds(ctx.row.original.executionDelay, {
                  fullUnit: true,
                }),
              }
            : undefined
        }
        emptyMode="n/a"
      />
    ),
  }),
  validityColumnHelper.accessor('isa', {
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
    meta: {
      tooltip:
        'Instruction Set Architecture (ISA) specifies the virtual machine or computational model that the proof system targets when generating proofs.',
    },
  }),
  validityColumnHelper.accessor('trustedSetupsByProofSystem', {
    header: 'Trusted setup',
    cell: (ctx) => {
      const trustedSetupEntries = Object.entries(
        ctx.row.original.trustedSetupsByProofSystem ?? {},
      )

      if (trustedSetupEntries.length === 0) {
        return <TableValueCell value={undefined} emptyMode="n/a" />
      }
      return (
        <div className="flex flex-col gap-2 py-2">
          {trustedSetupEntries.map(([key, ts]) => (
            <TrustedSetupCell key={key} trustedSetups={ts.trustedSetups} />
          ))}
        </div>
      )
    },
    meta: {
      tooltip:
        'Trusted setup information for the proof system used by this project',
    },
  }),
  validityColumnHelper.display({
    id: 'verifiers',
    header: 'Verifiers',
    cell: (ctx) => {
      const trustedSetupEntries = Object.entries(
        ctx.row.original.trustedSetupsByProofSystem ?? {},
      )

      if (trustedSetupEntries.length === 0) {
        return <TableValueCell value={undefined} emptyMode="n/a" />
      }
      return (
        <div className="flex flex-col gap-2 py-2">
          {trustedSetupEntries.map(([key, ts]) => (
            <VerifiedCountWithDetails key={key} data={ts.verifiers} />
          ))}
        </div>
      )
    },
    meta: {
      tooltip:
        'Shows the number of different versions of onchain verifiers and whether they were independently checked by regenerating them from the proving system’s source code. A green check indicates successful verification, while a red cross indicates a failure to regenerate.',
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
    cell: (ctx) => <ProofSystemCell {...ctx.row.original} hideType />,
    meta: {
      tooltip:
        'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
    },
  }),
  optimisticColumnHelper.accessor('challengePeriod', {
    header: 'Challenge Period',
    cell: (ctx) => (
      <TableValueCell
        value={
          ctx.row.original.challengePeriod !== undefined
            ? {
                value: formatSeconds(ctx.row.original.challengePeriod, {
                  fullUnit: true,
                }),
              }
            : undefined
        }
        emptyMode="n/a"
      />
    ),
  }),
  optimisticColumnHelper.accessor('executionDelay', {
    header: 'Execution Delay',
    cell: (ctx) => (
      <TableValueCell
        value={
          ctx.row.original.executionDelay !== undefined
            ? {
                value: formatSeconds(ctx.row.original.executionDelay, {
                  fullUnit: true,
                }),
              }
            : undefined
        }
        emptyMode="n/a"
      />
    ),
  }),
  optimisticColumnHelper.accessor('initialBond', {
    header: 'Initial Bond',
    cell: (ctx) => (
      <TableValueCell
        value={
          ctx.row.original.initialBond !== undefined
            ? {
                value: 'Ξ' + ctx.row.original.initialBond,
              }
            : undefined
        }
        emptyMode="n/a"
      />
    ),
  }),
]
