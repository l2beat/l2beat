import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { Callout } from '~/components/Callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { UserIcon } from '~/icons/User'
import type { AnonymitySet } from '~/server/features/privacy/anonymitySet'
import { formatInteger } from '~/utils/number-format/formatInteger'

export function AnonymitySetCell({
  anonymitySet,
}: {
  anonymitySet: AnonymitySet | undefined
}) {
  if (anonymitySet === undefined) {
    return <NoDataBadge />
  }

  const displayValue =
    anonymitySet.setSize === null ? 'N/A' : formatInteger(anonymitySet.setSize)

  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex flex-col items-center justify-center"
        aria-label={displayValue}
      >
        <span className="font-medium text-sm">{displayValue}</span>
        {anonymitySet.bucket && (
          <span className="font-medium text-2xs text-secondary">
            {anonymitySet.bucket}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <span className="font-medium text-base">{displayValue}</span>
        <p className="mt-1 text-primary">{anonymitySet.description}</p>
        {anonymitySet.steps && anonymitySet.steps.length > 0 && (
          <AnonymitySetStepsPane
            setSize={anonymitySet.setSize}
            steps={anonymitySet.steps}
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function AnonymitySetStepsPane({
  setSize,
  steps,
}: {
  setSize: number | null
  steps: string[]
}) {
  return (
    <Callout
      className="mt-2 px-3 py-2"
      color="purple"
      icon={<UserIcon className="fill-purple-450" />}
      body={
        <div className="flex flex-col gap-2 text-primary">
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              {setSize === null
                ? 'How to mix:'
                : `How to mix with ${formatInteger(setSize)} users:`}
            </span>
            <ol className="ml-4 list-decimal space-y-1">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="border-purple-450/30 border-t pt-2">
            <AnonymitySetGeneralNote />
          </div>
        </div>
      }
    />
  )
}

function AnonymitySetGeneralNote() {
  return (
    <span>
      Practical privacy also depends on the timing of deposits and withdrawals,
      the underlying network and browser used to interact with the frontend (if
      used), and the RPC providers used to send transactions and query public
      blockchain state. Users are advised to research OPSEC best practice.
    </span>
  )
}
