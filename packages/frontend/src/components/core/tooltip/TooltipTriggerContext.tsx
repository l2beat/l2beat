import { createContext, useContext } from 'react'
import type { TooltipController } from './tooltipController'

export type TooltipTriggerContextValue = TooltipController & {
  /** The popup's id, which describes the trigger while open. */
  contentId: string
  /** Present only when the tooltip opted into contentInHtml. */
  contentDescriptionId: string | undefined
}

const TooltipTriggerContext = createContext<TooltipTriggerContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
  value: TooltipTriggerContextValue
}

export function TooltipTriggerContextProvider({ children, value }: Props) {
  return (
    <TooltipTriggerContext.Provider value={value}>
      {children}
    </TooltipTriggerContext.Provider>
  )
}

export function useTooltipTriggerContext() {
  const context = useContext(TooltipTriggerContext)
  if (!context) {
    throw new Error(
      'useTooltipTriggerContext must be used within a TooltipTriggerContextProvider',
    )
  }
  return context
}
