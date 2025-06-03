import type { Dispatch, SetStateAction } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useTracking } from '~/hooks/useTracking'
import type { FilterableValueId } from './filterableValue'

type TableFilterInternalContextValue = {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  selectedId: FilterableValueId | undefined
  setSelectedId: Dispatch<SetStateAction<FilterableValueId | undefined>>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onEscapeKeyDown: (e: KeyboardEvent) => void
}

const TableFilterInternalContext =
  createContext<TableFilterInternalContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function TableFilterInternalContextProvider({ children }: Props) {
  const { track } = useTracking()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<FilterableValueId | undefined>(
    undefined,
  )

  useEffect(() => {
    if (open) {
      track('filtersOpened')
    }
  }, [open, track])

  // Reset search and selectedId when the filter is opened
  useEffect(() => {
    if (open) {
      setSelectedId(undefined)
      setSearch('')
    }
  }, [open])

  const onEscapeKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (search) {
        e.preventDefault()
        setSearch('')
        return
      }
      if (selectedId) {
        e.preventDefault()
        setSelectedId(undefined)
      }
    },
    [search, selectedId],
  )

  return (
    <TableFilterInternalContext.Provider
      value={{
        search,
        setSearch,
        selectedId,
        setSelectedId,
        open,
        setOpen,
        onEscapeKeyDown,
      }}
    >
      {children}
    </TableFilterInternalContext.Provider>
  )
}

export function useTableFilterInternalContext() {
  const context = useContext(TableFilterInternalContext)
  if (!context) {
    throw new Error(
      'useTableFilterInternalContext must be used within a TableFilterInternalContextProvider',
    )
  }
  return context
}
