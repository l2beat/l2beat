import { createContext, useContext, useState } from 'react'
import type { RosetteValue } from './types'

type RosetteTooltipContextValue = {
  selectedRisk: RosetteValue | undefined
  setSelectedRisk: React.Dispatch<
    React.SetStateAction<RosetteValue | undefined>
  >
}

const RosetteTooltipContext = createContext<RosetteTooltipContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function RosetteTooltipContextProvider({ children }: Props) {
  const [selectedRisk, setSelectedRisk] = useState<RosetteValue | undefined>()
  return (
    <RosetteTooltipContext.Provider
      value={{
        selectedRisk,
        setSelectedRisk,
      }}
    >
      {children}
    </RosetteTooltipContext.Provider>
  )
}

export function useRosetteTooltipContext() {
  const context = useContext(RosetteTooltipContext)

  return context
}
