import type { ProjectScalingProofSystem } from '@l2beat/config'
import { assertUnreachable, pluralize } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import { Callout } from '~/components/Callout'
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
  const hasSuccessful = zkCatalog && zkCatalog.successful.count > 0
  const hasUnsuccessful = zkCatalog && zkCatalog.unsuccessful.count > 0
  const hasNotVerified = zkCatalog && zkCatalog.notVerified.count > 0
  const isMixed =
    (hasSuccessful && hasUnsuccessful) ||
    (hasSuccessful && hasNotVerified) ||
    (hasUnsuccessful && hasNotVerified)

  return (
    <div className="flex h-full items-center gap-4">
      <ProofSystemCell proofSystem={proofSystem} slug={slug} hideType />
      <div className="flex items-center gap-1.5">
        {zkCatalog && (
          <Tooltip>
            <TooltipTrigger>
              <a href={`/zk-catalog?highlight=${zkCatalog.id}`}>
                <Badge
                  type={
                    isMixed || hasNotVerified
                      ? 'gray'
                      : hasSuccessful
                        ? 'green'
                        : hasUnsuccessful
                          ? 'error'
                          : null
                  }
                  className={cn(
                    'flex items-center gap-1',
                    isMixed || hasNotVerified
                      ? 'border-divider! bg-surface-secondary! text-primary'
                      : hasUnsuccessful
                        ? 'border border-negative'
                        : null,
                  )}
                >
                  {zkCatalog.name}
                  {hasSuccessful && <VerifiedIcon className="size-4" />}
                  {hasNotVerified && (
                    <CircleQuestionMarkIcon className="size-4" />
                  )}
                  {hasUnsuccessful && <UnverifiedIcon className="size-4" />}
                </Badge>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-label-value-15 md:text-label-value-16">
                The project uses {zkCatalog.name} prover.
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {hasSuccessful && (
                  <Callout
                    color="green"
                    small
                    icon={<VerifiedIcon className="mt-px size-4" />}
                    className="p-2"
                    body={getSuccessfulText(zkCatalog.successful)}
                  />
                )}
                {hasNotVerified && (
                  <Callout
                    color="gray"
                    small
                    className="p-2"
                    icon={<CircleQuestionMarkIcon className="mt-px size-4" />}
                    body={getNotVerifiedText(zkCatalog.notVerified)}
                  />
                )}
                {hasUnsuccessful && (
                  <Callout
                    color="red"
                    small
                    className="p-2"
                    icon={<UnverifiedIcon className="mt-px size-4" />}
                    body={getUnsuccessfulText(zkCatalog.unsuccessful)}
                  />
                )}
              </div>
              <p className="mt-2 text-label-value-13 text-secondary">
                Click to view details
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        {proofSystem?.challengeProtocol && (
          <Tooltip>
            <TooltipTrigger>
              <Badge type="blue" className="block h-5 md:h-6">
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

interface VerifierStatus {
  count: number
  attesters: string[]
}

function getSuccessfulText({ count, attesters }: VerifierStatus) {
  const by = attesters.length > 0 ? ` by ${attesters.join(', ')}` : ''
  return `${count} ${pluralize(count, 'verifier')} ${count === 1 ? 'was' : 'were'} successfully regenerated${by}`
}

function getNotVerifiedText({ count }: VerifierStatus) {
  return `Regeneration of ${count} ${pluralize(count, 'verifier')} ${count === 1 ? 'has' : 'have'} not been attempted yet`
}

function getUnsuccessfulText({ count, attesters }: VerifierStatus) {
  const by = attesters.length > 0 ? ` by ${attesters.join(', ')}` : ''
  return `${count} ${pluralize(count, 'verifier')} could not be regenerated${by}`
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
