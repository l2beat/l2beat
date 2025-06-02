import { createContext, useContext } from 'react'

type TooltipTriggerContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
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
