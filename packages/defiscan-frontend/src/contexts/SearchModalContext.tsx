import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { SearchModal } from '../components/SearchModal'

interface SearchModalContextValue {
  openSearchModal: (initialQuery?: string) => void
}

const SearchModalContext = createContext<SearchModalContextValue | null>(null)

export function useSearchModal() {
  const ctx = useContext(SearchModalContext)
  if (!ctx) throw new Error('useSearchModal must be used within SearchModalProvider')
  return ctx
}

export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')

  const openSearchModal = useCallback((query = '') => {
    setInitialQuery(query)
    setIsOpen(true)
  }, [])

  const closeSearchModal = useCallback(() => {
    setIsOpen(false)
    setInitialQuery('')
  }, [])

  return (
    <SearchModalContext.Provider value={{ openSearchModal }}>
      {children}
      {isOpen && (
        <SearchModal
          initialQuery={initialQuery}
          onClose={closeSearchModal}
        />
      )}
    </SearchModalContext.Provider>
  )
}
