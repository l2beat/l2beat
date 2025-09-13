import { createContext, useContext } from 'react'
import type { WhatsNewWidget } from './WhatsNewWidget'

const WhatsNewContext = createContext<WhatsNewWidget | undefined | null>(null)

interface Props {
  whatsNew: WhatsNewWidget | undefined
  children: React.ReactNode
}

export function WhatsNewContextProvider({ children, whatsNew }: Props) {
  return (
    <WhatsNewContext.Provider value={whatsNew}>
      {children}
    </WhatsNewContext.Provider>
  )
}

export function useWhatsNewContext() {
  const context = useContext(WhatsNewContext)
  if (context === null) {
    throw new Error(
      'useWhatsNewContext must be used within a WhatsNewContextProvider',
    )
  }
  return context
}
