import { getFirstTwoNonZeroPrecision } from '~/utils/getFirstTwoNonZeroPrecision'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

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
      <TooltipContent className="font-medium text-xs">
        {value.toFixed(precision)}
      </TooltipContent>
    </Tooltip>
  )
}
