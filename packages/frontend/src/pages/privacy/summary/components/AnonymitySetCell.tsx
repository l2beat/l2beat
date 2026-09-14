import { formatInteger } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { Callout } from '~/components/Callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { UserIcon } from '~/icons/User'
import type { PrivacyAnonymitySetSummary } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSummaries'
import {
  getAnonymitySetDescription,
  getAnonymitySetSteps,
  getAnonymitySetSyncingNote,
} from './anonymitySetTooltip'

interface Props {
  anonymitySet: PrivacyAnonymitySetSummary
  projectName: string
}

export function AnonymitySetCell({ anonymitySet, projectName }: Props) {
  if (anonymitySet.status === 'syncing') {
    return (
      <Badge type="gray" size="small">
        Syncing
      </Badge>
    )
  }
  if (anonymitySet.status === 'unavailable') {
    return <NoDataBadge />
  }
  if (anonymitySet.status === 'not-applicable') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <NotApplicableBadge />
        </TooltipTrigger>
        <TooltipContent className="max-w-[320px]">
          {anonymitySet.description}
        </TooltipContent>
      </Tooltip>
    )
  }

  const displayValue = formatInteger(anonymitySet.value)
  const steps = getAnonymitySetSteps(anonymitySet, projectName)
  const syncingNote = getAnonymitySetSyncingNote(anonymitySet)
  const isUpdating = syncingNote !== undefined

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex flex-col items-end justify-center text-right"
          aria-label={`${displayValue}, ${anonymitySet.label}${isUpdating ? ', updating' : ''}`}
        >
          <span className="font-medium text-xs leading-[15px] md:text-sm md:leading-[1.2]">
            {displayValue}
          </span>
          <span className="whitespace-pre-line text-[13px] text-secondary leading-[14px] md:text-xs md:leading-[15px]">
            {anonymitySet.label}
            {isUpdating && ' · updating'}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[380px]">
        <span className="font-medium text-base">{displayValue}</span>
        <p className="mt-1 text-primary">
          {getAnonymitySetDescription(anonymitySet)}
        </p>
        {syncingNote !== undefined && (
          <p className="mt-2 text-secondary">{syncingNote}</p>
        )}
        <Callout
          className="mt-2 px-3 py-2"
          color="purple"
          icon={<UserIcon className="fill-purple-450" />}
          body={
            <div className="flex flex-col gap-2 text-primary">
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  How to mix with {displayValue} users:
                </span>
                <ol className="ml-4 list-decimal space-y-1">
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <p className="border-purple-450/30 border-t pt-2">
                Practical privacy also depends on the timing of deposits and
                withdrawals, the underlying network and browser used to interact
                with the frontend (if used), and the RPC providers used to send
                transactions and query public blockchain state. Users are
                advised to research OPSEC best practices.
              </p>
            </div>
          }
        />
      </TooltipContent>
    </Tooltip>
  )
}
