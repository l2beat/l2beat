import { interpolateWithFields } from '../models/utils'
import { useCurrentlySelectedEntry } from './useCurrentlySelectedEntry'

export function useModelUtils() {
  const { address, fields } = useCurrentlySelectedEntry()

  const interpolateDescription = (content: string | undefined) => {
    return interpolateWithFields(content, address, fields)
  }

  return {
    interpolateDescription,
  }
}
