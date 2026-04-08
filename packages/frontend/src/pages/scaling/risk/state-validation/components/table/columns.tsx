import type { ProjectScalingProofSystem } from '@l2beat/config'
import { assertUnreachable, formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '~/components/badge/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import { CircleQuestionMarkIcon } from '~/icons/CircleQuestionMark'
import { UnverifiedIcon } from '~/icons/Unverified'
import { VerifiedIcon } from '~/icons/Verified'
import { TotalCellWithTvsBreakdown } from '~/pages/scaling/summary/components/table/TotalCellWithTvsBreakdown'
import { TrustedSetupCell } from '~/pages/zk-catalog/v2/components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import type {
  ScalingRiskStateValidationNoProofsEntry,
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationValidityEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import { cn } from '~/utils/cn'

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
  noProofsColumnHelper.accessor((e) => e.tvs?.breakdown?.total ?? 0, {
    id: 'total',
    header: 'Total value secured',
    cell: (ctx) => {
      const value = ctx.row.original.tvs
      return (
        <TotalCellWithTvsBreakdown
          href={`/scaling/tvs?highlight=${ctx.row.original.slug}`}
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
      align: 'right',
      cellClassName: 'pl-3',
      tooltip:
        'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens, shown together with a percentage change compared to 7D ago.',
    },
  }),
]

function OptimisticProofSystemCell({
  proofSystem,
  slug,
  zkCatalog,
}: ScalingRiskStateValidationOptimisticEntry) {
  return (
    <div className="flex h-full items-center gap-4">
      <ProofSystemCell proofSystem={proofSystem} slug={slug} hideType />
      <div className="flex items-center gap-1.5">
        {zkCatalog && (
          <a href={`/zk-catalog?highlight=${zkCatalog.id}`}>
            <Badge
              type={
                zkCatalog.hasSuccessful
                  ? 'green'
                  : zkCatalog.hasUnsuccessful
                    ? 'error'
                    : 'gray'
              }
              className={cn(
                'flex items-center gap-1',
                zkCatalog.hasSuccessful
                  ? null
                  : zkCatalog.hasUnsuccessful
                    ? 'border border-negative'
                    : 'border-divider! bg-surface-secondary! text-primary',
              )}
            >
              {zkCatalog.name}
              {zkCatalog.hasSuccessful && <VerifiedIcon className="size-4" />}
              {zkCatalog.hasNotVerified && (
                <CircleQuestionMarkIcon className="size-4" />
              )}
              {zkCatalog.hasUnsuccessful && (
                <UnverifiedIcon className="size-4" />
              )}
            </Badge>
          </a>
        )}
        {proofSystem?.challengeProtocol && (
          <Tooltip>
            <TooltipTrigger className="h-6">
              <Badge type="blue" className="block h-6">
                {proofSystem.challengeProtocol}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {challengeToDescription(proofSystem.challengeProtocol)}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

function challengeToDescription(
  challengeProtocol: NonNullable<
    ProjectScalingProofSystem['challengeProtocol']
  >,
) {
  switch (challengeProtocol) {
    case 'Single-step':
      return 'To dispute a proposed state transition, challengers submit a single transaction with the correct state together with a ZK (validity) proof.'
    case 'Interactive':
      return 'To dispute a proposed state transition, challengers and proposers participate in a multi-step interactive process to identify and re-execute a single contested instruction.'
    default:
      return assertUnreachable(challengeProtocol)
  }
}
