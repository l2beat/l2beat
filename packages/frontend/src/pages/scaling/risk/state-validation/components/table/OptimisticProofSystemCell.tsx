import type { ProjectScalingProofSystem } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { CircleQuestionMarkIcon } from '~/icons/CircleQuestionMark'
import { UnverifiedIcon } from '~/icons/Unverified'
import { VerifiedIcon } from '~/icons/Verified'
import type { ScalingRiskStateValidationOptimisticEntry } from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import { cn } from '~/utils/cn'

export function OptimisticProofSystemCell({
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
