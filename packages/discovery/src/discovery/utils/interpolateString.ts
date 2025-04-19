import type { StructureEntry } from '../output/types'

export function interpolateString(
  description: string | undefined,
  structure: StructureEntry,
): string | undefined {
  if (description === undefined) {
    return undefined
  }

  return description.replace(/\{\{\s*((\$\.?)?\w+)\s*\}\}/g, (_match, key) => {
    const value =
      key === '$.address' ? structure.address : structure.values?.[key]
    if (value === undefined) {
      throw new Error(
        `Value for variable "{{ ${key} }}" in contract field not found in contract analysis`,
      )
    }
    return String(value)
  })
}
