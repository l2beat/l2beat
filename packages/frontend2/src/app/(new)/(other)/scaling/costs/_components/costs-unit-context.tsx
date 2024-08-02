'use client'

import { createContext, useContext } from 'react'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type CostsUnit } from '~/server/features/scaling/get-scaling-costs-entries'

type CostsUnitContextValue = {
  unit: CostsUnit
  setUnit: React.Dispatch<React.SetStateAction<CostsUnit>>
}

const CostsUnitContext = createContext<CostsUnitContextValue | null>(null)

interface Props {
  children: React.ReactNode
  tag: string
}

export function CostsUnitContextProvider({ children, tag }: Props) {
  const [unit, setUnit] = useLocalStorage<CostsUnit>(`${tag}-unit`, 'usd')
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
