import { EthereumAddress } from '../../utils/EthereumAddress'
import { ContractMetadata } from '../provider/DiscoveryProvider'
import { decodeEtherscanSource } from './sourceToEntries'

export function processSources(
  address: EthereumAddress,
  { name, source, isVerified }: Omit<ContractMetadata, 'abi'>,
): Record<string, string> {
  let result: Record<string, string> = {}

  if (isVerified) {
    try {
      result = parseSource(name, source)
    } catch (e) {
      console.error(e)
      console.log(source)
    }
  }

  result['meta.txt'] = createMetaTxt(address, name, isVerified)
  return result
}

export function getRemappings({
  name,
  source,
  isVerified,
}: Omit<ContractMetadata, 'abi'>): string[] {
  if (!isVerified) {
    return []
  }

  return decodeEtherscanSource(name, source).remappings
}

function parseSource(name: string, source: string): Record<string, string> {
  const decodedSource = decodeEtherscanSource(name, source)
  const entries = decodedSource.sources

  return Object.fromEntries(entries)
}

export function createMetaTxt(
  address: EthereumAddress,
  name: string,
  isVerified: boolean,
): string {
  if (!isVerified) {
    return `Address: ${address.toString()}\nSource code not verified!`
  }
  return `Address: ${address.toString()}\nContract: ${name}\n`
}
