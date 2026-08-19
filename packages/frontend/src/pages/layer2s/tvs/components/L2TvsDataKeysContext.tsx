import { createContext, useContext } from 'react'
import { assetCategoryTvsChartMeta } from '~/components/chart/tvs/stacked/AssetCategoryTvsChart'
import { bridgeTypeTvsChartMeta } from '~/components/chart/tvs/stacked/BridgeTypeTvsChart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'

const L2TvsDataKeysContext = createContext<{
  tokenBridgeTypeDataKeys: (keyof typeof bridgeTypeTvsChartMeta)[]
  assetCategoryDataKeys: (keyof typeof assetCategoryTvsChartMeta)[]
  tokenBridgeTypeToggleDataKey: (dataKey: string) => void
  assetCategoryToggleDataKey: (dataKey: string) => void
} | null>(null)

export function L2TvsDataKeysProvider({
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
    <L2TvsDataKeysContext.Provider
      value={{
        tokenBridgeTypeDataKeys,
        assetCategoryDataKeys,
        tokenBridgeTypeToggleDataKey,
        assetCategoryToggleDataKey,
      }}
    >
      {children}
    </L2TvsDataKeysContext.Provider>
  )
}

export function useL2TvsDataKeys() {
  const context = useContext(L2TvsDataKeysContext)
  if (!context) {
    throw new Error(
      'useL2TvsDataKeys must be used within a L2TvsDataKeysProvider',
    )
  }

  return context
}
