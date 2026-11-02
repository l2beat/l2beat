import { createContext, useContext } from 'react'
import { useQueryState } from '~/hooks/useQueryState'
import type { CostsUnit } from '~/server/features/layer2s/costs/types'
import { oneOfCodec } from '~/utils/queryParamCodecs'

const UNIT_CODEC = oneOfCodec<CostsUnit>(['usd', 'eth', 'gas'], 'usd')

type CostsUnitContextValue = {
  unit: CostsUnit
  setUnit: React.Dispatch<React.SetStateAction<CostsUnit>>
}

const CostsUnitContext = createContext<CostsUnitContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function CostsUnitContextProvider({ children }: Props) {
  const [unit, setUnit] = useQueryState('unit', UNIT_CODEC)
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
