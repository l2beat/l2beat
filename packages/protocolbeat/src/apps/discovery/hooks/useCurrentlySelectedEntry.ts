import { useMemo } from 'react'
import type { ApiAddressEntry, ApiProjectContract } from '../../../api/types'
import { useProjectData } from './useProjectData'

export function useCurrentlySelectedEntry() {
  const { selectedAddress, selected, isPending, isError } = useProjectData()

  const fields = useMemo(() => {
    return selected ? getFields(selected) : []
  }, [selected])

  return {
    isPending: isPending,
    isError: isError,
    address: selectedAddress ?? '',
    entry: selected,
    fields,
  }
}

export function getFields(entry: ApiProjectContract | ApiAddressEntry) {
  return 'fields' in entry ? entry.fields : []
}
