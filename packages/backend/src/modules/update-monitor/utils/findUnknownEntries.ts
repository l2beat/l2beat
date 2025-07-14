import type { ConfigReader, EntryParameters } from '@l2beat/discovery'
import { type EthereumAddress, rawAddress } from '@l2beat/shared-pure'

export function findUnknownEntries(
  name: string,
  entries: EntryParameters[],
  configReader: ConfigReader,
  chain: string,
): EthereumAddress[] {
  const committed = configReader.readDiscovery(name, chain)

  const unknownContracts = entries
    .filter((entry) => {
      return !committed.entries.find((c) => c.address === entry.address)
    })
    .map((entry) => rawAddress(entry.address))

  return unknownContracts
}
