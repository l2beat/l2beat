import { useState } from 'react'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'

export function useTableSearch() {
  const [searchValue, setSearchValue] = useState('')
  const trimmedSearchValue = searchValue.trim()
  const globalFilter = useDebouncedValue(trimmedSearchValue, 300)

  return {
    globalFilter,
    isSearchPending: trimmedSearchValue !== globalFilter,
    searchValue,
    setSearchValue,
  }
}
