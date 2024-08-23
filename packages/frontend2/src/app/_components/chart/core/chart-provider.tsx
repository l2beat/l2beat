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
  ChartLoadingContextProviderParams,
} from './chart-loading-context'
import { ChartRectContextProvider } from './chart-rect-context'

export interface ChartProviderProps<T>
  extends ChartContextProviderParams<T>,
    ChartHoverContextProviderParams<T>,
    ChartLoadingContextProviderParams {}

export function ChartProvider<T>({
  children,
  renderHoverContents,
  isLoading,
  ...rest
}: ChartProviderProps<T>) {
  return (
    <ChartContextProvider {...rest}>
      <ChartLoadingContextProvider isLoading={isLoading}>
        <ChartHoverContextProvider renderHoverContents={renderHoverContents}>
          <ChartRectContextProvider>{children}</ChartRectContextProvider>
        </ChartHoverContextProvider>
      </ChartLoadingContextProvider>
    </ChartContextProvider>
  )
}
