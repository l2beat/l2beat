import type {
  ContractParameters,
  ContractValue,
  EoaParameters,
} from '@l2beat/discovery-types'

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
    /#([a-zA-Z0-9_$.]+)(:raw)?/g,
    (_match, key, raw) => {
      const isRaw = raw !== undefined
      const value = values[key]
      if (value === undefined) {
        throw new Error(
          `Field "${key}" not found in contract ${values['$.name']}`,
        )
      }
      if (Array.isArray(value)) {
        return `(${value
          .map((v) => tryCastingToName(String(v), addressToNameMap, isRaw))
          .join('; ')})`
      }
      return tryCastingToName(String(value), addressToNameMap, isRaw)
    },
  )
  return withValuesReplaced
}

export function tryCastingToName(
  value: string,
  addressToNameMap: Record<string, string>,
  isRaw: boolean,
): string {
  if (isRaw) {
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
  contract: ContractParameters | EoaParameters,
): Record<string, ContractValue | undefined> {
  const values = isContract(contract) ? contract.values : {}
  return {
    '$.address': contract.address.toLowerCase(),
    '$.name': contract.name ?? '',
    '$.description': contract.description,
    ...values,
  }
}

export function isContract(
  contractOrEoa: ContractParameters | EoaParameters,
): contractOrEoa is ContractParameters {
  return 'values' in contractOrEoa
}
