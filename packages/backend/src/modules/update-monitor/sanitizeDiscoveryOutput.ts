import { neuterErrors } from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'

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
