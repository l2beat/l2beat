import { type ReactNode, createContext, useContext, useState } from 'react'

interface TabsContextType {
  selectedTab: string | undefined
  setSelectedTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProviderProps {
  children: ReactNode
  defaultValue?: string
}

export function TabsProvider({ children, defaultValue }: TabsProviderProps) {
  const [selectedTab, setSelectedTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider')
  }
  return context
}
