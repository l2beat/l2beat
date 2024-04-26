import { EthereumAddress } from '../../utils/EthereumAddress'
import { ContractMetadata } from '../provider/DiscoveryProvider'
import { decodeEtherscanSource } from './sourceToEntries'

export interface ContractSource {
  files: Record<string, string>
  remappings: string[]
  solidityVersion: string
}

export function processSources(
  address: EthereumAddress,
  { name, source, isVerified, solidityVersion }: Omit<ContractMetadata, 'abi'>,
): ContractSource {
  let files: Record<string, string> = {}
  let remappings: string[] = []

  if (isVerified) {
    try {
      const decodedSource = decodeEtherscanSource(name, source)
      files = Object.fromEntries(decodedSource.sources)
      remappings = decodedSource.remappings
    } catch (e) {
      console.error(e)
      console.log(source)
    }
  }

  files['meta.txt'] = createMetaTxt(address, name, isVerified)

  return {
    files,
    remappings,
    solidityVersion,
  }
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
