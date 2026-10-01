/**
 * Source bundles with real flattening hashes, so tests that write shapes
 * exercise the same hashing V1 matches on instead of a stubbed hash.
 */
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { contractFlatteningHash } from '../../../flatten/utils'
import type { ContractSource } from '../../../utils/IEtherscanClient'
import type {
  ContractSources,
  PerContractSource,
} from '../../source/SourceCodeService'

export function bundle(
  name: string,
  address: string,
  body = '',
): PerContractSource {
  const source: ContractSource = {
    name,
    rootFile: `${name}.sol`,
    isVerified: true,
    abi: [],
    solidityVersion: 'v0.8.24+commit.e11b9ed9',
    constructorArguments: '',
    files: { [`${name}.sol`]: `contract ${name} {\n${body}\n}\n` },
    remappings: [],
    libraries: {},
  }
  return {
    name,
    address: ChainSpecificAddress(address),
    hash: contractFlatteningHash(source),
    source,
  }
}

export function contractSources(
  bundles: PerContractSource[],
  abi: string[] = [],
): ContractSources {
  const last = bundles.at(-1)
  return {
    name: last?.name ?? '',
    isVerified: true,
    abi,
    abis: {},
    sources: bundles,
  }
}
