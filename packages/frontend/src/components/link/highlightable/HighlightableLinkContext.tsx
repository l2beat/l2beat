import { createContext, useContext, useState } from 'react'

type HighlightableLinkContextValue = {
  current: string | undefined
  setCurrent: React.Dispatch<React.SetStateAction<string | undefined>>
}

const HighlightableLinkContext =
  createContext<HighlightableLinkContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function HighlightableLinkContextProvider({ children }: Props) {
  const [current, setCurrent] = useState<string | undefined>()

  return (
    <HighlightableLinkContext.Provider
      value={{
        current,
        setCurrent,
      }}
    >
      {children}
    </HighlightableLinkContext.Provider>
  )
}

export function useHiglightableLinkContext() {
  const context = useContext(HighlightableLinkContext)
  if (!context) {
    throw new Error(
      'useHiglightableLinkContext must be used within HiglightableLinkContextProvider',
    )
  }

  return context
}
