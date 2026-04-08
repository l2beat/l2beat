import { Badge } from '~/components/badge/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'

const TOOLTIP_TEXT =
  'This prover is designed to remain secure against attacks from quantum computers.'

export function QuantumResistanceTag() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Badge
            size="small"
            className="w-max border border-positive/30 bg-positive/15 px-1.5 py-0.5 text-[11px] text-positive uppercase"
          >
            Quantum resistant
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent>{TOOLTIP_TEXT}</TooltipContent>
    </Tooltip>
  )
}
