import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { type DaSummaryEntryBridge } from '~/server/features/data-availability/utils/get-da-bridge'
import ShieldIcon from '~/icons/shield.svg'

export function DaBridgeCell({ daBridge }: { daBridge: DaSummaryEntryBridge }) {
  if (!daBridge.warning && !daBridge.redWarning) {
    return daBridge.name
  }

  return (
    <div>
      <span>{daBridge.name}</span>
      {daBridge.warning && (
        <span className="pl-1.5">
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative top-px size-4 fill-yellow-700 dark:fill-yellow-300" />
            </TooltipTrigger>
            <TooltipContent>{daBridge.warning}</TooltipContent>
          </Tooltip>
        </span>
      )}
      {daBridge.redWarning && (
        <span className="pl-1.5">
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative top-px size-4 fill-red-300" />
            </TooltipTrigger>
            <TooltipContent>{daBridge.redWarning}</TooltipContent>
          </Tooltip>
        </span>
      )}
    </div>
  )
}
