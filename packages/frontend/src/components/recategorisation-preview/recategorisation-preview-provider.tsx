'use client'

import { usePathname } from 'next/navigation'
import { createContext, useContext, useState } from 'react'

type RecategorisationPreviewContextValue = {
  checked: boolean
  setChecked: (checked: boolean) => void
  isScalingMainPage: boolean
}

const RecategorisationPreviewContext =
  createContext<RecategorisationPreviewContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function RecategorisationPreviewContextProvider({ children }: Props) {
  const pathname = usePathname()
  const [checked, setChecked] = useState<boolean>(false)
  const isScalingMainPage =
    pathname.startsWith('/scaling') && !pathname.startsWith('/scaling/projects')
  return (
    <RecategorisationPreviewContext.Provider
      value={{
        checked,
        setChecked,
        isScalingMainPage,
      }}
    >
      {children}
    </RecategorisationPreviewContext.Provider>
  )
}

export function useRecategorisationPreviewContext() {
  const context = useContext(RecategorisationPreviewContext)
  if (!context) {
    throw new Error(
      'RecategorisationPreviewContext must be used within a RecategorisationPreviewContextProvider',
    )
  }
  return context
}
