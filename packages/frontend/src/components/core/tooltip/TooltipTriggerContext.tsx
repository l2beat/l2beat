import { createContext, useContext } from 'react'

type TooltipTriggerContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  /** Present only when the tooltip opted into a hidden description. */
  hiddenDescriptionId: string | undefined
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
