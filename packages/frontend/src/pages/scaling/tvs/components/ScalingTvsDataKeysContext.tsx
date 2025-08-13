import { createContext, useContext } from 'react'
import { tokenCategoryTvsChartMeta } from '~/components/chart/tvs/stacked/TokenCategoryTvsChart'
import { tokenSourceTvsChartMeta } from '~/components/chart/tvs/stacked/TokenSourceTvsChart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'

const ScalingTvsDataKeysContext = createContext<{
  tokenSourceDataKeys: (keyof typeof tokenSourceTvsChartMeta)[]
  tokenCategoryDataKeys: (keyof typeof tokenCategoryTvsChartMeta)[]
  tokenSourceToggleDataKey: (dataKey: string) => void
  tokenCategoryToggleDataKey: (dataKey: string) => void
} | null>(null)

export function ScalingTvsDataKeysProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    dataKeys: tokenSourceDataKeys,
    toggleDataKey: tokenSourceToggleDataKey,
  } = useChartDataKeys(tokenSourceTvsChartMeta)
  const {
    dataKeys: tokenCategoryDataKeys,
    toggleDataKey: tokenCategoryToggleDataKey,
  } = useChartDataKeys(tokenCategoryTvsChartMeta)

  return (
    <ScalingTvsDataKeysContext.Provider
      value={{
        tokenSourceDataKeys,
        tokenCategoryDataKeys,
        tokenSourceToggleDataKey,
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
