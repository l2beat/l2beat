import { Checkbox } from '~/components/core/Checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import {
  DISPLAY_OPTIONS,
  type DisplayOption,
  type DisplayOptionsKey,
} from '~/components/table/display/displayOptions'
import { useIsClient } from '~/hooks/useIsClient'
import { InfoIcon } from '~/icons/Info'
import {
  COMPARE_TVS_ASSET_CATEGORIES,
  COMPARE_TVS_BRIDGE_TYPES,
  type CompareTvsAssetCategory,
  type CompareTvsBridgeType,
  type CompareTvsFilter,
  type CompareTvsUnit,
  effectiveExcludeRwaRestrictedTokens,
} from '../../utils/compareChartState'
import type { CompareMetricControlsProps } from '../types'

const TVS_BRIDGE_TYPE_LABELS: Record<CompareTvsBridgeType, string> = {
  canonical: 'Canonical',
  native: 'Native',
  external: 'External',
}

// Same labels as the TVS page's "By asset category" chart.
const TVS_ASSET_CATEGORY_LABELS: Record<CompareTvsAssetCategory, string> = {
  ether: 'ETH & derivatives',
  stablecoin: 'Stablecoins',
  btc: 'BTC & derivatives',
  rwaPublic: 'Public RWAs',
  rwaRestricted: 'Restricted RWAs',
  other: 'Other',
}

export function TvsCompareControls({
  state,
  setState,
}: CompareMetricControlsProps) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[264px]" />
  }
  const restrictedRwaFilterActive = state.tvsFilter === 'rwaRestricted'
  return (
    <div className="flex flex-wrap items-center gap-1">
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
      <Select
        value={state.tvsFilter}
        onValueChange={(value) =>
          setState((prev) => ({
            ...prev,
            tvsFilter: value as CompareTvsFilter,
          }))
        }
      >
        <SelectTrigger
          className="h-9 primary-card:bg-surface-secondary"
          aria-label="Filter the compared value"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="end"
          // Sized to the viewport instead of the default cap so the whole
          // list is visible without scrolling wherever it fits.
          className="max-h-(--radix-select-content-available-height)"
        >
          <SelectItem value="all">All</SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Bridge type</SelectLabel>
            {COMPARE_TVS_BRIDGE_TYPES.map((bridgeType) => (
              <SelectItem key={bridgeType} value={bridgeType}>
                {TVS_BRIDGE_TYPE_LABELS[bridgeType]}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asset category</SelectLabel>
            {COMPARE_TVS_ASSET_CATEGORIES.map((assetCategory) => (
              <SelectItem key={assetCategory} value={assetCategory}>
                {TVS_ASSET_CATEGORY_LABELS[assetCategory]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <DisplayCheckbox
        optionKey="excludeRwaRestrictedTokens"
        // Show the effective value: the toggle is overridden to false while
        // the Restricted RWAs filter is active, because excluding restricted
        // RWAs while comparing them would zero the chart.
        checked={effectiveExcludeRwaRestrictedTokens(state)}
        disabledReason={
          restrictedRwaFilterActive
            ? 'Unavailable while comparing restricted RWAs - it would exclude the very tokens being compared.'
            : undefined
        }
        onCheckedChange={(excludeRwaRestrictedTokens) =>
          setState((prev) => ({ ...prev, excludeRwaRestrictedTokens }))
        }
      />
      <DisplayCheckbox
        optionKey="excludeAssociatedTokens"
        checked={state.excludeAssociatedTokens}
        onCheckedChange={(excludeAssociatedTokens) =>
          setState((prev) => ({ ...prev, excludeAssociatedTokens }))
        }
      />
    </div>
  )
}

function DisplayCheckbox({
  optionKey,
  checked,
  disabledReason,
  onCheckedChange,
}: {
  optionKey: DisplayOptionsKey
  checked: boolean
  disabledReason?: string
  onCheckedChange: (checked: boolean) => void
}) {
  const option: DisplayOption = DISPLAY_OPTIONS[optionKey]
  const tooltip = disabledReason ?? option.tooltip
  return (
    <Checkbox
      name={`compareTvs-${optionKey}`}
      checked={checked}
      disabled={disabledReason !== undefined}
      onCheckedChange={(checked) => onCheckedChange(!!checked)}
      className="h-9"
    >
      <div className="flex items-center gap-1">
        {option.label}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </Checkbox>
  )
}
