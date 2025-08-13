import { createContext, useContext } from 'react'
import { assetCategoryTvsChartMeta } from '~/components/chart/tvs/stacked/AssetCategoryTvsChart'
import { bridgeTypeTvsChartMeta } from '~/components/chart/tvs/stacked/BridgeTypeTvsChart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'

const ScalingTvsDataKeysContext = createContext<{
  tokenBridgeTypeDataKeys: (keyof typeof bridgeTypeTvsChartMeta)[]
  assetCategoryDataKeys: (keyof typeof assetCategoryTvsChartMeta)[]
  tokenBridgeTypeToggleDataKey: (dataKey: string) => void
  assetCategoryToggleDataKey: (dataKey: string) => void
} | null>(null)

export function ScalingTvsDataKeysProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    dataKeys: tokenBridgeTypeDataKeys,
    toggleDataKey: tokenBridgeTypeToggleDataKey,
  } = useChartDataKeys(bridgeTypeTvsChartMeta)
  const {
    dataKeys: assetCategoryDataKeys,
    toggleDataKey: assetCategoryToggleDataKey,
  } = useChartDataKeys(assetCategoryTvsChartMeta)

  return (
    <ScalingTvsDataKeysContext.Provider
      value={{
        tokenBridgeTypeDataKeys,
        assetCategoryDataKeys,
        tokenBridgeTypeToggleDataKey,
        assetCategoryToggleDataKey,
      }}
    >
      {children}
    </ScalingTvsDataKeysContext.Provider>
  )
}

export function useScalingTvsDataKeys() {
  const context = useContext(ScalingTvsDataKeysContext)
  if (!context) {
    throw new Error(
      'useScalingTvsDataKeys must be used within a ScalingTvsDataKeysProvider',
    )
  }

  return context
}
