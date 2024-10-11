import { useIsClient } from '~/hooks/use-is-client'
import {
  ChartContextProvider,
  type ChartContextProviderParams,
} from './chart-context'
import {
  ChartHoverContextProvider,
  type ChartHoverContextProviderParams,
} from './chart-hover-context'
import {
  ChartLoadingContextProvider,
  type ChartLoadingContextProviderParams,
} from './chart-loading-context'
import { ChartRectContextProvider } from './chart-rect-context'

export interface ChartProviderProps<T extends { timestamp: number }>
  extends ChartContextProviderParams<T>,
    ChartHoverContextProviderParams<T>,
    ChartLoadingContextProviderParams {}

export function ChartProvider<T extends { timestamp: number }>({
  children,
  renderHoverContents,
  isLoading,
  ...rest
}: ChartProviderProps<T>) {
  const isClient = useIsClient()
  return (
    <ChartContextProvider {...rest}>
      <ChartLoadingContextProvider isLoading={isLoading || !isClient}>
        <ChartHoverContextProvider renderHoverContents={renderHoverContents}>
          <ChartRectContextProvider>{children}</ChartRectContextProvider>
        </ChartHoverContextProvider>
      </ChartLoadingContextProvider>
    </ChartContextProvider>
  )
}
