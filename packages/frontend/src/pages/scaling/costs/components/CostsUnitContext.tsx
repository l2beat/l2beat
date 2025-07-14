import { createContext, useContext } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import type { CostsUnit } from '~/server/features/scaling/costs/types'

type CostsUnitContextValue = {
  unit: CostsUnit
  setUnit: React.Dispatch<React.SetStateAction<CostsUnit>>
}

const CostsUnitContext = createContext<CostsUnitContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function CostsUnitContextProvider({ children }: Props) {
  const [unit, setUnit] = useLocalStorage<CostsUnit>('costs-unit', 'usd')
  return (
    <CostsUnitContext.Provider
      value={{
        unit,
        setUnit,
      }}
    >
      {children}
    </CostsUnitContext.Provider>
  )
}

export function useCostsUnitContext() {
  const context = useContext(CostsUnitContext)
  if (!context) {
    throw new Error(
      'CostsUnitContext must be used within a CostsUnitContextProvider',
    )
  }
  return context
}
