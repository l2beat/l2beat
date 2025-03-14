import { type DiscoveryOutput, neuterErrors } from '@l2beat/discovery'

export function sanitizeDiscoveryOutput(discovery: DiscoveryOutput) {
  const sanitizedEntries = discovery.entries.map((c) => {
    if (c.errors !== undefined) {
      c.errors = neuterErrors(c.errors)
    }

    return c
  })

  return {
    ...discovery,
    entries: sanitizedEntries,
  }
}
