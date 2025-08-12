import { createContext, useContext } from 'react'
import { bridgingTypeTvsChartMeta } from '~/components/chart/tvs/stacked/BridgingTypeTvsChart'
import { tokenCategoryTvsChartMeta } from '~/components/chart/tvs/stacked/TokenCategoryTvsChart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'

const ScalingTvsDataKeysContext = createContext<{
  bridgingTypeDataKeys: (keyof typeof bridgingTypeTvsChartMeta)[]
  tokenCategoryDataKeys: (keyof typeof tokenCategoryTvsChartMeta)[]
  bridgingTypeToggleDataKey: (dataKey: string) => void
  tokenCategoryToggleDataKey: (dataKey: string) => void
} | null>(null)

export function ScalingTvsDataKeysProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    dataKeys: bridgingTypeDataKeys,
    toggleDataKey: bridgingTypeToggleDataKey,
  } = useChartDataKeys(bridgingTypeTvsChartMeta)
  const {
    dataKeys: tokenCategoryDataKeys,
    toggleDataKey: tokenCategoryToggleDataKey,
  } = useChartDataKeys(tokenCategoryTvsChartMeta)

  return (
    <ScalingTvsDataKeysContext.Provider
      value={{
        bridgingTypeDataKeys,
        tokenCategoryDataKeys,
        bridgingTypeToggleDataKey,
        tokenCategoryToggleDataKey,
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
