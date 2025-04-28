import type { Analysis } from './AddressAnalyzer'

export function interpolateString(
  description: string,
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
): string {
  return description.replace(/\{\{\s*((\$\.?)?\w+)\s*\}\}/g, (_match, key) => {
    const value = key === '$.address' ? analysis.address : analysis.values[key]
    if (value === undefined) {
      throw new Error(
        `Value for variable "{{ ${key} }}" in contract field not found in contract analysis`,
      )
    }
    return String(value)
  })
}
