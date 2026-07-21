import { createContext, useContext } from 'react'
import { assetCategoryTvsChartMeta } from '~/components/chart/tvs/stacked/AssetCategoryTvsChart'
import { bridgeTypeTvsChartMeta } from '~/components/chart/tvs/stacked/BridgeTypeTvsChart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'

const Layer2sTvsDataKeysContext = createContext<{
  tokenBridgeTypeDataKeys: (keyof typeof bridgeTypeTvsChartMeta)[]
  assetCategoryDataKeys: (keyof typeof assetCategoryTvsChartMeta)[]
  tokenBridgeTypeToggleDataKey: (dataKey: string) => void
  assetCategoryToggleDataKey: (dataKey: string) => void
} | null>(null)

export function Layer2sTvsDataKeysProvider({
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
    <Layer2sTvsDataKeysContext.Provider
      value={{
        tokenBridgeTypeDataKeys,
        assetCategoryDataKeys,
        tokenBridgeTypeToggleDataKey,
        assetCategoryToggleDataKey,
      }}
    >
      {children}
    </Layer2sTvsDataKeysContext.Provider>
  )
}

export function useLayer2sTvsDataKeys() {
  const context = useContext(Layer2sTvsDataKeysContext)
  if (!context) {
    throw new Error(
      'useLayer2sTvsDataKeys must be used within a Layer2sTvsDataKeysProvider',
    )
  }

  return context
}
