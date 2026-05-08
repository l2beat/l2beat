import { formatSeconds } from '@l2beat/shared-pure'
import type { ColumnHelper } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '~/components/badge/Badge'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import { TotalCellWithTvsBreakdown } from '~/pages/scaling/summary/components/table/TotalCellWithTvsBreakdown'
import { TrustedSetupCell } from '~/pages/zk-catalog/v2/components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import type { CommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'
import type {
  ScalingRiskStateValidationNoProofsEntry,
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationValidityEntry,
  TvsData,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import { OptimisticProofSystemCell } from './OptimisticProofSystemCell'

function defenderAdvantageLine(
  da: ScalingRiskStateValidationOptimisticEntry['defenderAdvantage'],
): string | undefined {
  if (da === undefined || da === 'not-applicable' || da === 'not-assessed')
    return undefined
  if (da.shape === 'log') return 'Favors defender (log)'
  if (da.multiplier >= 1) return `Favors defender ${da.multiplier.toFixed(2)}×`
  return `Favors attacker ${(1 / da.multiplier).toFixed(2)}×`
}

function getTvsColumn<T extends CommonScalingEntry & { tvs: TvsData }>(
  columnHelper: ColumnHelper<T>,
) {
  return columnHelper.accessor((e) => e.tvs?.breakdown?.total ?? 0, {
    id: 'total',
    header: 'Total value secured',
    cell: (ctx) => {
      const value = ctx.row.original.tvs
      return (
        <TotalCellWithTvsBreakdown
          href={`/scaling/tvs?tab=${ctx.row.original.tab}&highlight=${ctx.row.original.slug}`}
          associatedTokens={value.associatedTokens}
          tvsWarnings={value.warnings}
          breakdown={value.breakdown}
          additionalTrustAssumptionsPercentage={
            value.additionalTrustAssumptionsPercentage
          }
          change={value.change?.total}
          syncWarning={value.syncWarning}
        />
      )
    },
    meta: {
      align: 'right' as const,
      cellClassName: 'pl-3',
      tooltip:
        'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens, shown together with a percentage change compared to 7D ago.',
    },
  })
}

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
        "Shows the number of different versions of onchain verifiers and whether they were independently checked by regenerating them from the proving system's source code. A green check indicates successful verification, while a red cross indicates a failure to regenerate.",
    },
  }),
  validityColumnHelper.accessor('executionDelay', {
    header: 'Execution Delay',
    cell: (ctx) => {
      const { executionDelay, executionDelayMode } = ctx.row.original
      return (
        <TableValueCell
          value={
            executionDelay !== undefined
              ? executionDelay <= 0
                ? { value: 'None' }
                : {
                    value: formatSeconds(executionDelay, { fullUnit: true }),
                    secondLine:
                      executionDelayMode === 'if-challenged'
                        ? 'only if challenged'
                        : 'always applied',
                  }
              : undefined
          }
          emptyMode="n/a"
        />
      )
    },
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
  getTvsColumn(validityColumnHelper),
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
    cell: (ctx) => <OptimisticProofSystemCell {...ctx.row.original} />,
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
    cell: (ctx) => {
      const { executionDelay, executionDelayMode } = ctx.row.original
      return (
        <TableValueCell
          value={
            executionDelay !== undefined
              ? executionDelay <= 0
                ? { value: 'None' }
                : {
                    value: formatSeconds(executionDelay, { fullUnit: true }),
                    secondLine:
                      executionDelayMode === 'if-challenged'
                        ? 'only if challenged'
                        : 'always applied',
                  }
              : undefined
          }
          emptyMode="n/a"
        />
      )
    },
  }),
  optimisticColumnHelper.accessor('initialBond', {
    header: 'Initial Bond',
    cell: (ctx) => {
      const { initialBond, initialBondToken, defenderAdvantage } =
        ctx.row.original
      return (
        <TableValueCell
          value={
            initialBond !== undefined
              ? {
                  value: initialBondToken
                    ? `${initialBond} ${initialBondToken}`
                    : 'Ξ' + initialBond,
                  secondLine: defenderAdvantageLine(defenderAdvantage),
                }
              : undefined
          }
          emptyMode="n/a"
        />
      )
    },
    meta: {
      tooltip:
        "Minimum bond required to propose or challenge a state root. When shown, the line below indicates how the bond economy favors one side in a resource-exhaustion attack: 'Favors defender N×' means an attacker needs N times the defender's funds to outlast them; 'Favors attacker N×' means defenders need N times the attacker's funds to keep up; 'Favors defender (log)' is a tournament-style protocol where defender funds grow only logarithmically. The line is omitted for whitelist-gated systems (where the bond is not an open economic barrier) and for protocols whose resource ratio has not yet been analyzed.",
    },
  }),
  getTvsColumn(optimisticColumnHelper),
]

const noProofsColumnHelper =
  createColumnHelper<ScalingRiskStateValidationNoProofsEntry>()

export const scalingRiskStateValidationNoProofsColumns = [
  ...getScalingCommonProjectColumns(
    noProofsColumnHelper,
    (row) => `/scaling/projects/${row.slug}#state-validation`,
  ),
  noProofsColumnHelper.display({
    id: 'proofSystem',
    header: 'Proof system',
    cell: () => (
      <Badge type="gray" size="small">
        No proofs
      </Badge>
    ),
  }),
  getTvsColumn(noProofsColumnHelper),
]
