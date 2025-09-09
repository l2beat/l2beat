import { createContext, useContext, useState } from 'react'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'

type SelectedTokenContextValue = {
  selectedToken: ProjectToken | undefined
  setSelectedToken: React.Dispatch<
    React.SetStateAction<ProjectToken | undefined>
  >
}

const SelectedTokenContext = createContext<SelectedTokenContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function SelectedTokenContextProvider({ children }: Props) {
  const [selectedToken, setSelectedToken] = useState<ProjectToken>()

  return (
    <SelectedTokenContext.Provider
      value={{
        selectedToken,
        setSelectedToken,
      }}
    >
      {children}
    </SelectedTokenContext.Provider>
  )
}

export function useSelectedTokenContext() {
  const context = useContext(SelectedTokenContext)
  if (!context) {
    throw new Error(
      'SelectedTokenContext must be used within a SelectedTokenContextProvider',
    )
  }
  return context
}
