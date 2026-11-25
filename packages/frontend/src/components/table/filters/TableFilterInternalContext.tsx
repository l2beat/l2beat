import type { Dispatch, SetStateAction } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import { useTracking } from '~/hooks/useTracking'
import type { FilterableValueId } from './filterableValue'

type TableFilterInternalContextValue = {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  selectedId: FilterableValueId | undefined
  setSelectedId: Dispatch<SetStateAction<FilterableValueId | undefined>>
  open: boolean
  setOpen: (open: boolean) => void
  onEscapeKeyDown: (e: KeyboardEvent) => void
}

const TableFilterInternalContext =
  createContext<TableFilterInternalContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function TableFilterInternalContextProvider({ children }: Props) {
  const { track } = useTracking()
  const [open, setOpenState] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<FilterableValueId | undefined>(
    undefined,
  )

  // Every opening starts from the top of a clean menu.
  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen && !open) {
        setSelectedId(undefined)
        setSearch('')
        track('filtersOpened')
      }
      setOpenState(nextOpen)
    },
    [open, track],
  )

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
