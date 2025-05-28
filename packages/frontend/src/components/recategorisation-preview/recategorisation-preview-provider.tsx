import { usePathname } from 'next/navigation'
import { createContext, useContext, useState } from 'react'
import { setCookie } from '~/utils/cookies/client'

type RecategorisationPreviewContextValue = {
  checked: boolean
  setChecked: (checked: boolean) => void
  isScalingMainPage: boolean
}

const RecategorisationPreviewContext =
  createContext<RecategorisationPreviewContextValue | null>(null)

interface Props {
  children: React.ReactNode
  defaultChecked?: boolean
}

export function RecategorisationPreviewContextProvider({
  children,
  defaultChecked,
}: Props) {
  const pathname = usePathname()
  const [checked, setChecked] = useState(defaultChecked ?? false)

  const onChange = (checked: boolean) => {
    setChecked(checked)
    setCookie('recategorisationPreview', checked)
  }

  const isScalingMainPage =
    pathname.startsWith('/scaling') && !pathname.startsWith('/scaling/projects')
  return (
    <RecategorisationPreviewContext.Provider
      value={{
        checked,
        setChecked: onChange,
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
