import { Logger } from '@l2beat/backend-tools'
import { BlockscoutV2Client, type HttpClient } from '@l2beat/shared'
import { EthereumAddress, Hash256, type UnixTime } from '@l2beat/shared-pure'
import type { ContractSource, IEtherscanClient } from './IEtherscanClient'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

export class BlockscoutV2SourceClient implements IEtherscanClient {
  private readonly client: BlockscoutV2Client

  constructor(httpClient: HttpClient, url: string, logger = Logger.SILENT) {
    this.client = new BlockscoutV2Client(httpClient, url, logger)
  }

  async getContractSource(address: EthereumAddress): Promise<ContractSource> {
    const result = await this.client.getSmartContract(address)

    if (result === undefined || !result.is_verified) {
      return unverifiedContractSource()
    }

    if (result.source_code === undefined || result.source_code === null) {
      throw new Error(
        `Blockscout V2 returned a verified contract without source code for ${address.toString()}`,
      )
    }

    const name = result.name?.trim() ?? ''
    const extension = result.language?.toLowerCase() === 'vyper' ? 'vy' : 'sol'
    const rootFile = result.file_path ?? `${name || 'Contract'}.${extension}`
    const files: Record<string, string> = {
      [rootFile]: result.source_code,
    }
    for (const source of result.additional_sources ?? []) {
      files[source.file_path] = source.source_code
    }

    const settings = result.compiler_settings ?? undefined
    const optimizer =
      settings?.optimizer ??
      (result.optimization_enabled !== undefined
        ? {
            enabled: result.optimization_enabled,
            runs:
              result.optimization_runs ??
              result.optimizations_runs ??
              undefined,
          }
        : undefined)

    return {
      name,
      rootFile,
      isVerified: true,
      abi: parseAbi(result.abi),
      solidityVersion: result.compiler_version ?? '',
      constructorArguments: strip0x(result.constructor_args ?? ''),
      remappings: settings?.remappings ?? [],
      files,
      libraries: parseLibraries(
        settings?.libraries,
        result.external_libraries ?? [],
      ),
      compilerSettings: {
        optimizer,
        evmVersion: settings?.evmVersion ?? result.evm_version ?? undefined,
        viaIR: settings?.viaIR,
        metadata: settings?.metadata,
        debug:
          settings?.debug?.revertStrings !== undefined
            ? {
                revertStrings: settings.debug.revertStrings,
                debugInfo: settings.debug.debugInfo,
              }
            : undefined,
      },
    }
  }

  async getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined> {
    const result = await this.client.getAddress(address)
    return result.creation_transaction_hash === undefined ||
      result.creation_transaction_hash === null
      ? undefined
      : Hash256(result.creation_transaction_hash)
  }

  getFirstTxTimestamp(_address: EthereumAddress): Promise<UnixTime> {
    throw new Error(notImplementedMessage('getFirstTxTimestamp'))
  }

  getAtMost10RecentOutgoingTxs(
    _address: EthereumAddress,
    _blockNumber: number,
  ): Promise<{ input: string; to: EthereumAddress; hash: Hash256 }[]> {
    throw new Error(notImplementedMessage('getAtMost10RecentOutgoingTxs'))
  }

  getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    throw new Error(notImplementedMessage('getBlockNumberAtOrBefore'))
  }
}

function unverifiedContractSource(): ContractSource {
  return {
    name: '',
    rootFile: undefined,
    isVerified: false,
    abi: [],
    solidityVersion: '',
    constructorArguments: '',
    remappings: [],
    files: {},
    libraries: {},
  }
}

function parseAbi(abi: string | unknown[] | null | undefined): string[] {
  if (abi === undefined || abi === null) {
    return []
  }
  return jsonToHumanReadableAbi(
    typeof abi === 'string' ? abi : JSON.stringify(abi),
  )
}

function parseLibraries(
  compilerLibraries: unknown,
  externalLibraries: { name: string; address_hash: string }[],
): Record<string, EthereumAddress> {
  const result: Record<string, EthereumAddress> = {}

  if (isRecord(compilerLibraries)) {
    for (const [nameOrFile, value] of Object.entries(compilerLibraries)) {
      if (typeof value === 'string') {
        result[nameOrFile] = EthereumAddress(value)
      } else if (isRecord(value)) {
        for (const [name, address] of Object.entries(value)) {
          if (typeof address === 'string') {
            result[name] = EthereumAddress(address)
          }
        }
      }
    }
  }

  for (const library of externalLibraries) {
    result[library.name] = EthereumAddress(library.address_hash)
  }

  return result
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function strip0x(value: string): string {
  return value.startsWith('0x') ? value.slice(2) : value
}

function notImplementedMessage(feature: string) {
  return `Blockscout V2 feature not implemented: only source code and contract deployment fetching are supported. ${feature} is not supported by this explorer.`
}
