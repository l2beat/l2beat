import { createContext, type ReactNode, useContext } from 'react'

/**
 * Identifies which interop overview dataset the surrounding page is showing.
 * The values map 1:1 to the tRPC procedures that back each dashboard.
 */
export type InteropDataset = 'intentBridges' | 'tokenFrameworks'

const InteropOverviewContext = createContext<InteropDataset | undefined>(
  undefined,
)

export function InteropOverviewProvider({
  children,
  dataset,
}: {
  children: ReactNode
  dataset: InteropDataset
}) {
  return (
    <InteropOverviewContext.Provider value={dataset}>
      {children}
    </InteropOverviewContext.Provider>
  )
}

export function useInteropDataset() {
  const dataset = useContext(InteropOverviewContext)
  if (!dataset) {
    throw new Error(
      'useInteropDataset must be used within InteropOverviewProvider',
    )
  }
  return dataset
}
