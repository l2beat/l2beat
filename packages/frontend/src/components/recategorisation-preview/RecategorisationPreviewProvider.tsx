import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'
import { UnixTime } from '@l2beat/shared-pure'
import { createContext, useContext } from 'react'
import { usePathname } from '~/hooks/usePathname'
import { useQueryParam } from '~/hooks/useQueryParam'

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
    {
      replaceState: true,
    },
  )

  const onChange = (checked: boolean) => {
    setChecked(checked.toString())
  }

  const isScalingMainPage =
    pathname.startsWith('/scaling') && !pathname.startsWith('/scaling/projects')
  return (
    <RecategorisationPreviewContext.Provider
      value={{
        checked:
          PROJECT_COUNTDOWNS.otherMigration > UnixTime.now()
            ? checked === 'true'
            : false,
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
