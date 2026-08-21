import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@l2beat/frontend'

export function Open() {
  return (
    <TooltipProvider>
      <div className="flex justify-center py-10">
        <Tooltip defaultOpen>
          <TooltipTrigger className="font-bold text-primary underline">
            Value secured
          </TooltipTrigger>
          <TooltipContent side="bottom">
            The sum of canonically bridged, externally bridged and natively
            minted tokens, priced in USD at the time of the last sync.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export function FitContent() {
  return (
    <TooltipProvider>
      <div className="flex justify-center py-10">
        <Tooltip defaultOpen>
          <TooltipTrigger className="font-bold text-primary underline">
            Stage 1
          </TooltipTrigger>
          <TooltipContent side="bottom" fitContent>
            Limited training wheels
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
