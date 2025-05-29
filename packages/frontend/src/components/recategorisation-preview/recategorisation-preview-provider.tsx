import { createContext, useContext } from 'react'
import { usePathname } from '~/hooks/usePathname'
import useQueryParam from '~/hooks/useQueryParam'

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
  const [checked, setChecked] = useQueryParam(
    'recategorisationPreview',
    'false',
  )

  const onChange = (checked: boolean) => {
    setChecked(checked.toString())
  }

  const isScalingMainPage =
    pathname.startsWith('/scaling') && !pathname.startsWith('/scaling/projects')
  return (
    <RecategorisationPreviewContext.Provider
      value={{
        checked: checked === 'true',
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
