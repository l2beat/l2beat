import type { ContractParameters, EoaParameters } from '../output/types'
import type { ContractValue } from '../output/types'

export function interpolateModelTemplate(
  content: string,
  values: Record<string, ContractValue | undefined>,
  addressToNameMap: Record<string, string>,
) {
  const withSelfReplaced = content.replace(
    /@self/g,
    tryCastingToName(String(values['$.address']), addressToNameMap, false),
  )
  const withValuesReplaced = withSelfReplaced.replace(
    /#([a-zA-Z0-9_$.]+)(:raw)?(\|lower)?/g,
    (_match, key, raw, lower) => {
      const leaveRaw = raw !== undefined
      const toLower = lower !== undefined
      const value = values[key]
      if (value === undefined) {
        throw new Error(
          `Field "${key}" not found in contract ${values['$.name']}`,
        )
      }
      if (Array.isArray(value)) {
        return `(${value
          .map((v) => tryCastingToName(String(v), addressToNameMap, leaveRaw))
          .map((v) => (toLower ? v.toLowerCase() : v))
          .join('; ')})`
      }
      const processedValue = toLower
        ? String(value).toLowerCase()
        : String(value)
      return tryCastingToName(processedValue, addressToNameMap, leaveRaw)
    },
  )
  return withValuesReplaced
}

export function tryCastingToName(
  value: string,
  addressToNameMap: Record<string, string>,
  leaveRaw: boolean,
): string {
  if (leaveRaw) {
    return value
  }
  const name = addressToNameMap[value.toLowerCase()]
  return name ? normalizeId(name) : value
}

// Clingo ids need to start with a lowercase letter
// and should not contain any special characters
export function normalizeId(s: string) {
  return (s.charAt(0).toLowerCase() + s.slice(1)).replaceAll(
    /[^a-zA-Z0-9]/g,
    '_',
  )
}

export function contractValuesForInterpolation(
  chain: string,
  contract: ContractParameters | EoaParameters,
): Record<string, ContractValue | undefined> {
  const values = 'values' in contract ? (contract.values ?? {}) : {}
  return {
    '$.chain': chain,
    '$.address': contract.address.toLowerCase(),
    '$.name': contract.name ?? '',
    '$.description': contract.description,
    ...values,
  }
}
