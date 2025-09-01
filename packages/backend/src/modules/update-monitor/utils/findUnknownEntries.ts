import type { ConfigReader, EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'

export function findUnknownEntries(
  name: string,
  entries: EntryParameters[],
  configReader: ConfigReader,
): EthereumAddress[] {
  const committed = configReader.readDiscovery(name)

  const unknownContracts = entries
    .filter((entry) => {
      return !committed.entries.find((c) => c.address === entry.address)
    })
    .map((entry) => ChainSpecificAddress.address(entry.address))

  return unknownContracts
}
