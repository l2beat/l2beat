import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Skeleton } from '~/components/core/Skeleton'
import { DisplayControls } from '~/components/table/display/DisplayControls'
import { useIsClient } from '~/hooks/useIsClient'
import {
  COMPARE_TVS_BRIDGE_TYPES,
  type CompareTvsBridgeType,
  type CompareTvsFilter,
  type CompareTvsUnit,
} from '../../utils/compareChartState'
import type { CompareMetricControlsProps } from '../types'

const TVS_BRIDGE_TYPE_LABELS: Record<CompareTvsBridgeType, string> = {
  canonical: 'Canonical',
  native: 'Native',
  external: 'External',
}

export function TvsCompareControls({
  state,
  setState,
}: CompareMetricControlsProps) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[264px]" />
  }
  return (
    <div className="flex items-center gap-1">
      <Select
        value={state.tvsFilter}
        onValueChange={(value) =>
          setState((prev) => ({
            ...prev,
            tvsFilter: value as CompareTvsFilter,
          }))
        }
      >
        <SelectTrigger className="h-9" aria-label="Filter the compared value">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="all">All</SelectItem>
          <SelectGroup>
            <SelectLabel className="pl-2.5 text-secondary">
              Bridge type
            </SelectLabel>
            {COMPARE_TVS_BRIDGE_TYPES.map((bridgeType) => (
              <SelectItem key={bridgeType} value={bridgeType}>
                {TVS_BRIDGE_TYPE_LABELS[bridgeType]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
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
