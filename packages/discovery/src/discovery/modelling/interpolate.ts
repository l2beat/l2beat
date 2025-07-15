import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue, EntryParameters } from '../output/types'

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
    /&([a-zA-Z0-9_$.]+)(:raw)?(\|lower)?(\|quote)?(\|orNil)?/g,
    (_match, key, raw, lower, _quote, _orNil) => {
      const leaveRaw = raw !== undefined
      const toLower = lower !== undefined
      const quote = _quote !== undefined
      const orNil = _orNil !== undefined
      const value = values[key]
      if (value === undefined) {
        if (orNil) {
          return 'nil'
        }
        throw new Error(
          `Field "${key}" not found in contract ${values['$.name']}`,
        )
      }
      if (Array.isArray(value)) {
        return `(${value
          .map((v) => tryCastingToName(String(v), addressToNameMap, leaveRaw))
          .map((v) => (toLower ? v.toLowerCase() : v))
          .map((v) => (quote ? `"${v}"` : v))
          .join('; ')})`
      }
      const processedValue = toLower
        ? String(value).toLowerCase()
        : String(value)
      const casted = tryCastingToName(
        processedValue,
        addressToNameMap,
        leaveRaw,
      )
      const quoted = quote ? `"${casted}"` : casted
      return quoted
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
  return name ? normalizeId(name) : quoteEthereumAddress(value)
}

export function quoteEthereumAddress(value: string) {
  return ChainSpecificAddress.check(value) ? `"${value.toLowerCase()}"` : value
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
  entry: EntryParameters,
): Record<string, ContractValue | undefined> {
  const values = entry.values
  return {
    '$.chain': chain,
    '$.address': entry.address.toLowerCase(),
    '$.name': entry.name ?? '',
    '$.description': entry.description,
    ...values,
  }
}
