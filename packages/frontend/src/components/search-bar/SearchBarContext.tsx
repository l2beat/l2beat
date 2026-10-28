import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useEventListener } from '~/hooks/useEventListener'
import { useGlobalShortcut } from '~/hooks/useGlobalShortcut'
import { useWhenIdle } from '~/hooks/useWhenIdle'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import type { SearchBarDialog as SearchBarDialogComponent } from './SearchBarDialog'

type SearchBarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  preload: () => void
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

interface Props {
  children: React.ReactNode
  recentlyAddedProjects: SearchBarProject[]
}

export function SearchBarContextProvider({
  children,
  recentlyAddedProjects,
}: Props) {
  const [open, setOpen] = useState(false)
  const [SearchBarDialog, setSearchBarDialog] =
    useState<typeof SearchBarDialogComponent>()
  // What the user types between opening the search and its chunk arriving,
  // handed to the dialog's input so no keypress is lost.
  const [typedWhileLoading, setTypedWhileLoading] = useState('')

  const preload = useCallback(() => {
    loadSearchBarDialog().then(
      (dialog) => setSearchBarDialog(() => dialog),
      (error) => {
        console.error(error)
        setOpen(false)
      },
    )
  }, [])

  useWhenIdle(preload)
  useEffect(() => {
    if (open) preload()
  }, [open, preload])

  // Opens, never toggles: while the chunk loads there is no dialog in the page
  // to turn the shortcut off, and a second "/" belongs in the query.
  useGlobalShortcut('/', () => setOpen(true))

  // Until the dialog arrives, keys belong to the search, not the page: Enter
  // would follow the focused link, and "f" would open a table's filter. In the
  // capture phase, so that it runs before the page's listeners and doesn't
  // take the key that opens the search for one typed into it. Keys with Ctrl,
  // Meta or Alt are left to the browser.
  useEventListener(
    'keydown',
    (event) => {
      if (!open || SearchBarDialog) return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      event.preventDefault()
      event.stopPropagation()
      if (event.key === 'Escape') {
        setOpen(false)
        setTypedWhileLoading('')
      } else if (event.key === 'Backspace') {
        setTypedWhileLoading((value) => value.slice(0, -1))
      } else if (event.key.length === 1) {
        setTypedWhileLoading((value) => value + event.key)
      }
    },
    undefined,
    true,
  )

  return (
    <SearchBarContext.Provider value={{ open, setOpen, preload }}>
      {SearchBarDialog && (
        <SearchBarDialog
          recentlyAdded={recentlyAddedProjects}
          initialValue={typedWhileLoading}
        />
      )}
      {children}
    </SearchBarContext.Provider>
  )
}

export function useSearchBarContext() {
  const context = useContext(SearchBarContext)
  if (!context) {
    throw new Error(
      'useSearchBarContext must be used within a SearchBarContextProvider',
    )
  }
  return context
}

// The dialog and cmdk are in a chunk of their own, so pages don't load them
// before they render. It is fetched once the page is idle, or sooner when the
// search is hovered, focused or opened.
let dialogModule: Promise<typeof SearchBarDialogComponent> | undefined
function loadSearchBarDialog() {
  dialogModule ??= import('./SearchBarDialog').then(
    (module) => module.SearchBarDialog,
    (error) => {
      dialogModule = undefined
      throw error
    },
  )
  return dialogModule
}
