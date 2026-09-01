import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import {
  assert,
  type EthereumAddress,
  type Hash256,
  type UnixTime,
} from '@l2beat/shared-pure'
import { BlockscoutClient } from './BlockscoutClient'
import { EtherscanClient } from './EtherscanClient'
import type {
  ContractSource,
  ExplorerConfig,
  IEtherscanClient,
  Transaction,
} from './IEtherscanClient'
import { RoutescanClient } from './RoutescanClient'
import { SourcifyClient } from './SourcifyClient'

export class CombiningEtherscanClient implements IEtherscanClient {
  private clients: IEtherscanClient[]

  constructor(
    httpClient: HttpClient,
    configs: ExplorerConfig[],
    logger: Logger = Logger.SILENT,
  ) {
    assert(configs.length > 0, 'We need at least one explorer configured')

    this.clients = configs.map((config) => {
      switch (config.type) {
        case 'etherscan-v1': {
          return EtherscanClient.createForDiscovery(
            httpClient,
            logger,
            config.url,
            config.apiKey,
            config.unsupported,
          )
        }
        case 'etherscan': {
          return EtherscanClient.createForDiscovery(
            httpClient,
            logger,
            config.url,
            config.apiKey,
            config.unsupported,
            { chainId: config.chainId.toString() },
          )
        }
        case 'routescan': {
          return RoutescanClient.createForDiscovery(
            httpClient,
            logger,
            config.url,
            '',
            config.unsupported,
          )
        }
        case 'blockscout': {
          return new BlockscoutClient(
            httpClient,
            config.url,
            config.unsupported,
          )
        }
        case 'sourcify': {
          return new SourcifyClient(httpClient, config.chainId)
        }
        default: {
          throw new Error('Unknown explorer type')
        }
      }
    })
  }

  private async tryClients<T>(
    fn: (client: IEtherscanClient) => Promise<T | undefined>,
  ): Promise<T | undefined> {
    for (const client of this.clients) {
      try {
        const result = await fn(client)
        if (result !== undefined) {
          return result
        }
      } catch {}
    }

    return undefined
  }

  private async tryClientsOrThrow<T>(
    label: string,
    fn: (client: IEtherscanClient) => Promise<T | undefined>,
  ): Promise<T> {
    const result = await this.tryClients(fn)
    if (result === undefined) {
      throw new Error(`No client could fetch ${label}`)
    }
    return result
  }

  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    return this.tryClientsOrThrow('block number at or before', (c) =>
      c.getBlockNumberAtOrBefore(timestamp),
    )
  }

  async getContractSource(address: EthereumAddress): Promise<ContractSource> {
    let lastUnverified: ContractSource | undefined
    for (const client of this.clients) {
      try {
        const source = await client.getContractSource(address)
        if (source.isVerified) {
          return source
        }
        lastUnverified = source
      } catch {}
    }

    if (lastUnverified !== undefined) {
      return lastUnverified
    }
    throw new Error('No client could fetch contract source')
  }

  getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined> {
    return this.tryClients((c) => c.getContractDeploymentTx(address))
  }

  getFirstTxTimestamp(address: EthereumAddress): Promise<UnixTime> {
    return this.tryClientsOrThrow('first tx timestamp', (c) =>
      c.getFirstTxTimestamp(address),
    )
  }

  getAtMost10RecentOutgoingTxs(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Transaction[]> {
    return this.tryClientsOrThrow('recent outgoing txs', (c) =>
      c.getAtMost10RecentOutgoingTxs(address, blockNumber),
    )
  }
}
