import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { DisplayControls } from '~/components/table/display/DisplayControls'
import { useIsClient } from '~/hooks/useIsClient'
import type { CompareTvsUnit } from '../../utils/compareChartState'
import type { CompareMetricControlsProps } from '../types'

export function TvsCompareControls({
  state,
  setState,
}: CompareMetricControlsProps) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[196px]" />
  }
  return (
    <div className="flex items-center gap-1">
      <RadioGroup
        name="compareTvsUnit"
        value={state.tvsUnit}
        onValueChange={(value) =>
          setState((prev) => ({ ...prev, tvsUnit: value as CompareTvsUnit }))
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
      </RadioGroup>
      <DisplayControls
        display={{
          excludeRwaRestrictedTokens: state.excludeRwaRestrictedTokens,
          excludeAssociatedTokens: state.excludeAssociatedTokens,
        }}
        setDisplay={(key, value) =>
          setState((prev) => ({ ...prev, [key]: value }))
        }
      />
    </div>
  )
}
