import { getFirstTwoNonZeroPrecision } from '~/utils/get-first-two-non-zero-precision'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/tooltip'

interface Props {
  children: string
  value: number
}

export function DetailedOnHover({ children, value }: Props) {
  if (!children.startsWith('<')) {
    return children
  }

  const precision = getFirstTwoNonZeroPrecision(value)

  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent className="text-xs font-medium">
        {value.toFixed(precision)}
      </TooltipContent>
    </Tooltip>
  )
}
