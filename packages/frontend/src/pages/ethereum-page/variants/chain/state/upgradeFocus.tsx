import { createContext, type ReactNode, use, useMemo, useState } from 'react'

interface UpgradeFocus {
  /** The upgrade the reader is pointing at on the timeline, marked on every history chart */
  focused: string | undefined
  focus: (name: string | undefined) => void
}

const UpgradeFocusContext = createContext<UpgradeFocus>({
  focused: undefined,
  focus: () => {},
})

export function UpgradeFocusProvider({ children }: { children: ReactNode }) {
  const [focused, focus] = useState<string>()
  const value = useMemo(() => ({ focused, focus }), [focused])
  return <UpgradeFocusContext value={value}>{children}</UpgradeFocusContext>
}

export function useUpgradeFocus() {
  return use(UpgradeFocusContext)
}
