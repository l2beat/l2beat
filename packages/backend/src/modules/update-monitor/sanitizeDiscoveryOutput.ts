import { type DiscoveryOutput, neuterErrors } from '@l2beat/discovery'

export function sanitizeDiscoveryOutput(discovery: DiscoveryOutput) {
  const sanitizedContracts = discovery.contracts.map((c) => {
    if (c.errors !== undefined) {
      c.errors = neuterErrors(c.errors)
    }

    return c
  })

  return {
    ...discovery,
    contracts: sanitizedContracts,
  }
}
