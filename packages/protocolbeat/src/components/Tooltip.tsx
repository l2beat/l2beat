import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '../utils/cn'

export function TooltipProvider({
  delayDuration = 0,
  ...props
}: RadixTooltip.TooltipProviderProps) {
  return <RadixTooltip.Provider delayDuration={delayDuration} {...props} />
}

export function Tooltip(props: RadixTooltip.TooltipProps) {
  return (
    <TooltipProvider>
      <RadixTooltip.Root {...props}>{props.children}</RadixTooltip.Root>
    </TooltipProvider>
  )
}

export function TooltipTrigger(props: RadixTooltip.TooltipTriggerProps) {
  return (
    <RadixTooltip.Trigger {...props}>{props.children}</RadixTooltip.Trigger>
  )
}

export function TooltipContent({
  sideOffset = 4,
  className,
  ...props
}: RadixTooltip.TooltipContentProps) {
  return (
    <RadixTooltip.Content
      sideOffset={sideOffset}
      className={cn(
        'z-[100] h-fit max-h-80 w-fit max-w-80 origin-(--radix-tooltip-content-transform-origin) overflow-y-auto whitespace-pre-wrap border border-coffee-400 bg-coffee-900 px-3 py-1.5 text-coffee-400 text-xs',
        className,
      )}
      {...props}
    >
      {props.children}
      <RadixTooltip.Arrow className="border-coffee-400 fill-coffee-800 stroke-2 stroke-coffee-400" />
    </RadixTooltip.Content>
  )
}
