import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import type { CompareCostsUnit } from '../../utils/compareChartState'
import type { CompareMetricControlsProps } from '../types'

export function CostsCompareControls({
  state,
  setState,
}: CompareMetricControlsProps) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[132px]" />
  }
  return (
    <RadioGroup
      name="compareCostsUnit"
      value={state.costsUnit}
      onValueChange={(value) =>
        setState((prev) => ({ ...prev, costsUnit: value as CompareCostsUnit }))
      }
      variant="highlighted"
      className="h-9"
    >
      <RadioGroupItem value="usd" className="h-full px-2 text-sm">
        USD
      </RadioGroupItem>
      <RadioGroupItem value="eth" className="h-full px-2 text-sm">
        ETH
      </RadioGroupItem>
      <RadioGroupItem value="gas" className="h-full px-2 text-sm">
        GAS
      </RadioGroupItem>
    </RadioGroup>
  )
}
