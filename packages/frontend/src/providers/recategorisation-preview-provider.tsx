'use client'

import { createContext, useContext, useState } from 'react'

type RecategorisationPreviewContextValue = {
  checked: boolean
  setChecked: (checked: boolean) => void
}

const RecategorisationPreviewContext =
  createContext<RecategorisationPreviewContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function RecategorisationPreviewContextProvider({ children }: Props) {
  const [checked, setChecked] = useState<boolean>(false)
  return (
    <RecategorisationPreviewContext.Provider
      value={{
        checked,
        setChecked,
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
