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
import { DisplayOptionCheckbox } from '~/components/table/display/DisplayOptionCheckbox'
import { useIsClient } from '~/hooks/useIsClient'
import {
  COMPARE_TVS_ASSET_CATEGORIES,
  COMPARE_TVS_BRIDGE_TYPES,
  type CompareTvsAssetCategory,
  type CompareTvsBridgeType,
  type CompareTvsFilter,
  type CompareTvsUnit,
} from '../../utils/compareChartState'
import type { CompareMetricControlsProps } from '../types'
import { effectiveExcludeRwaRestrictedTokens } from './tvsCompareMetric'

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
  config,
  setConfig,
}: CompareMetricControlsProps) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[264px]" />
  }
  const restrictedRwaFilterActive = config.tvsFilter === 'rwaRestricted'
  return (
    <div className="flex flex-wrap items-center gap-1">
      <RadioGroup
        name="compareTvsUnit"
        value={config.tvsUnit}
        onValueChange={(value) =>
          setConfig((prev) => ({ ...prev, tvsUnit: value as CompareTvsUnit }))
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
        value={config.tvsFilter}
        onValueChange={(value) =>
          setConfig((prev) => ({
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
      <DisplayOptionCheckbox
        optionKey="excludeRwaRestrictedTokens"
        name="compareTvs-excludeRwaRestrictedTokens"
        className="h-9"
        // Show the effective value: the toggle is overridden to false while
        // the Restricted RWAs filter is active, because excluding restricted
        // RWAs while comparing them would zero the chart.
        checked={effectiveExcludeRwaRestrictedTokens(config)}
        disabledReason={
          restrictedRwaFilterActive
            ? 'Unavailable while comparing restricted RWAs - it would exclude the very tokens being compared.'
            : undefined
        }
        onCheckedChange={(excludeRwaRestrictedTokens) =>
          setConfig((prev) => ({ ...prev, excludeRwaRestrictedTokens }))
        }
      />
      <DisplayOptionCheckbox
        optionKey="excludeAssociatedTokens"
        name="compareTvs-excludeAssociatedTokens"
        className="h-9"
        checked={config.excludeAssociatedTokens}
        onCheckedChange={(excludeAssociatedTokens) =>
          setConfig((prev) => ({ ...prev, excludeAssociatedTokens }))
        }
      />
    </div>
  )
}
