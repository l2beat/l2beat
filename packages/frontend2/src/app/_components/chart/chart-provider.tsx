import {
  ChartContextProvider,
  type ChartContextProviderParams,
} from './chart-context'
import {
  ChartHoverContextProvider,
  type ChartHoverContextProviderParams,
} from './chart-hover-context'

export interface ChartProviderProps<T>
  extends ChartContextProviderParams<T>,
    ChartHoverContextProviderParams<T> {}

export function ChartProvider<T>({
  children,
  renderHoverContents,
  ...rest
}: ChartProviderProps<T>) {
  return (
    <ChartContextProvider {...rest}>
      <ChartHoverContextProvider renderHoverContents={renderHoverContents}>
        {children}
      </ChartHoverContextProvider>
    </ChartContextProvider>
  )
}
