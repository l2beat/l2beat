import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  asStructured,
  codeIsEOA,
  flattenBytecodeEquivalentStartingFrom,
  getChainConfigs,
  getChainFullName,
  getDiscoveryPaths,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import type { ContractSource } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { HttpClient } from '@l2beat/shared'
import { ChainSpecificAddress, formatJson } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

export type FlatSource =
  | { kind: 'eoa'; name: string; flat: string }
  | { kind: 'unverified'; name: string; flat: string }
  | { kind: 'non-solidity'; name: string; flat: string }
  | { kind: 'flat'; name: string; flat: string; constructorArguments: string }

export class FlatSourceClient {
  private cache = new Map<string, FlatSource>()
  private httpClient = new HttpClient()
  private allProviders: AllProviders

  constructor() {
    const paths = getDiscoveryPaths()
    const cache = new SQLiteCache(paths.cache)
    this.allProviders = new AllProviders(
      getChainConfigs(),
      this.httpClient,
      cache,
      Logger.SILENT,
    )
  }

  async getFlat(address: ChainSpecificAddress): Promise<FlatSource> {
    const cacheKey = address.toString()
    const cached = this.cache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    const provider = await this.getProvider(ChainSpecificAddress.chain(address))

    const code = await provider.getBytecode(address)
    if (codeIsEOA(code)) {
      const result: FlatSource = {
        kind: 'eoa',
        name: 'EOA',
        flat: '// NOTE: Address is an EOA, does not have source code',
      }
      this.cache.set(cacheKey, result)
      return result
    }

    const source = await provider.getSource(address)
    const name = source.name.length > 0 ? source.name : 'Unknown'

    if (!source.isVerified) {
      return {
        kind: 'unverified',
        name,
        flat: '// NOTE: Source code for this address has not been verified',
      }
    }

    const input = Object.entries(source.files)
      .map(([fileName, content]) => ({ path: fileName, content }))
      .filter((e) => e.path.endsWith('.sol'))

    if (input.length === 0) {
      const result: FlatSource = {
        kind: 'non-solidity',
        name,
        flat: '// NOTE: DIFFOVERY currently does not support non-solidity contracts',
      }
      this.cache.set(cacheKey, result)
      return result
    }

    const flat = flattenBytecodeEquivalentStartingFrom(
      source.name,
      source.rootFile,
      input,
      source.remappings,
      { includeAll: true },
    )
    const result: FlatSource = {
      kind: 'flat',
      name,
      flat,
      constructorArguments: decodeConstructorArguments(source),
    }
    this.cache.set(cacheKey, result)
    return result
  }

  private async getProvider(shortChain: string): Promise<IProvider> {
    const chain = getChainFullName(shortChain)
    const blockNumber = await this.allProviders.getLatestBlockNumber(chain)
    return this.allProviders.getByBlockNumber(chain, blockNumber)
  }
}

function decodeConstructorArguments(source: ContractSource): string {
  if (source.constructorArguments.length === 0) {
    return 'No constructor arguments'
  }

  try {
    const abi = new utils.Interface(source.abi)
    const fragment = abi.fragments.find((x) => x.type === 'constructor')
    if (!fragment) {
      return 'Constructor arguments present but no constructor found in ABI'
    }

    const decoded = toReadable(
      utils.defaultAbiCoder.decode(
        fragment.inputs,
        '0x' + source.constructorArguments,
      ),
    )
    const rawResult = normalizeDecodedConstructorArguments(
      decoded,
      fragment.inputs.length,
    )

    const structured = asStructured(rawResult, fragment.inputs)

    return formatJson(structured).trim()
  } catch {
    return 'Error during decoding constructor arguments'
  }
}

function normalizeDecodedConstructorArguments(
  decoded: Readable,
  inputLength: number,
): Readable {
  if (inputLength !== 1 || !Array.isArray(decoded)) {
    return decoded
  }
  return decoded[0] ?? decoded
}

export type Readable = string | number | boolean | Readable[]

function toReadable(value: utils.Result): Readable {
  if (Array.isArray(value)) {
    return value.map(toReadable)
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  if (BigNumber.isBigNumber(value)) {
    if (
      value.gt(Number.MAX_SAFE_INTEGER.toString()) ||
      value.lt(Number.MIN_SAFE_INTEGER.toString())
    ) {
      return value.toString()
    }
    return value.toNumber()
  }
  return `${value}`
}
