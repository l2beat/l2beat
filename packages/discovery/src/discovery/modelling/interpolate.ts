import type { ContractParameters } from '@l2beat/discovery-types'

export function interpolateModelFile(
  content: string,
  contract: ContractParameters,
  addressToNameMap: Record<string, string>,
) {
  const withSelfReplaced = content.replace(
    /@self/g,
    tryCastingToName(contract.address, addressToNameMap),
  )
  const withValuesReplaced = withSelfReplaced.replace(
    /#([a-zA-Z0-9_$.]+)/g,
    (_match, key) => {
      const value = contract.values?.[key]
      if (value === undefined) {
        throw new Error(
          `Field "#${key}" not found in contract ${contract.name}`,
        )
      }
      if (Array.isArray(value)) {
        return `(${value
          .map((v) => tryCastingToName(String(v), addressToNameMap))
          .join('; ')})`
      }
      return tryCastingToName(String(value), addressToNameMap)
    },
  )
  return withValuesReplaced
}

export function tryCastingToName(
  value: string,
  addressToNameMap: Record<string, string>,
): string {
  const name = addressToNameMap[value.toLowerCase()]
  return name ? normalizeId(name) : value
}

export function normalizeId(s: string) {
  return (s.charAt(0).toLowerCase() + s.slice(1)).replaceAll(
    /[^a-zA-Z0-9]/g,
    '_',
  )
}
