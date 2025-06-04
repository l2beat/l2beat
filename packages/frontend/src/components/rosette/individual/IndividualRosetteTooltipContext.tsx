import { createContext, useContext, useState } from 'react'
import type { RosetteValue } from '../types'

interface IndividualContentState {
  innerProjectName: string
  outerProjectName: string
  inner: RosetteValue
  outer: RosetteValue
  side: 'top' | 'bottom'
  sideOffset: number
}

type IndividualRosetteTooltipContextValue = {
  content: IndividualContentState | undefined
  setContent: React.Dispatch<
    React.SetStateAction<IndividualContentState | undefined>
  >
}

const IndividualRosetteTooltipContext =
  createContext<IndividualRosetteTooltipContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function IndividualRosetteTooltipContextProvider({ children }: Props) {
  const [content, setContent] = useState<IndividualContentState | undefined>()

  return (
    <IndividualRosetteTooltipContext.Provider
      value={{
        content,
        setContent,
      }}
    >
      {children}
    </IndividualRosetteTooltipContext.Provider>
  )
}

export function useIndividualRosetteTooltipContext() {
  const context = useContext(IndividualRosetteTooltipContext)

  return context
}
