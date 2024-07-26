import { DiscoveryOutput } from '@l2beat/discovery-types'

export function sanitizeDiscoveryOutput(discovery: DiscoveryOutput) {
  const sanitizedContracts = discovery.contracts.map((c) => {
    if (c.errors !== undefined) {
      c.errors = Object.keys(c.errors).reduce<Record<string, string>>(
        (acc, key) => {
          // Set all error messages to a generic error message
          acc[key] = 'Processing error occurred.'
          return acc
        },
        {},
      )
    }

    return c
  })

  return {
    ...discovery,
    contracts: sanitizedContracts,
  }
}
