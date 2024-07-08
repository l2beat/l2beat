'use client'

import { createContext, useContext, useState } from 'react'
import { type RosetteValue } from './types'

interface ContentState {
  risk: RosetteValue
  side: 'top' | 'bottom'
  sideOffset: number
}

type RosetteTooltipContextValue = {
  content: ContentState | undefined
  setContent: React.Dispatch<React.SetStateAction<ContentState | undefined>>
}

const RosetteTooltipContext = createContext<RosetteTooltipContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function RosetteTooltipContextProvider({ children }: Props) {
  const [content, setContent] = useState<ContentState | undefined>()

  return (
    <RosetteTooltipContext.Provider
      value={{
        content,
        setContent,
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
