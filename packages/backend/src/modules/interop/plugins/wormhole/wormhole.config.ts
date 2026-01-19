import type { Logger } from '@l2beat/backend-tools'
import type { CallParameters, HttpClient, IRpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import * as cheerio from 'cheerio'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../../engine/config/InteropConfigStore'
import { reconcileNetworks } from '../../engine/config/reconcileNetworks'

export interface WormholeNetwork {
  chain: string
  chainId?: number
  wormholeChainId: number
  coreContract?: EthereumAddress
  relayer?: EthereumAddress
  tokenBridge?: EthereumAddress
}

export const WormholeConfig = defineConfig<WormholeNetwork[]>('wormhole')

const DOCS_URL =
  'https://wormhole.com/docs/products/reference/contract-addresses/'

const OVERRIDES: WormholeNetwork[] = [
  {
    chain: 'bsc',
    chainId: 56,
    wormholeChainId: 4,
  },
  {
    chain: 'solana',
    wormholeChainId: 1,
  },
]

// Map our chain names to Wormhole docs chain names
const CHAIN_NAME_TO_DOCS: Record<string, string> = {
  polygonpos: 'polygon',
}

function toDocsChainName(chainName: string): string {
  return CHAIN_NAME_TO_DOCS[chainName] ?? chainName
}

export class WormholeConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [WormholeConfig]

  constructor(
    private chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    private rpcs: Map<string, IRpcClient>,
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this)
  }

  async run() {
    const latest = await this.getLatestNetworks()

    const previous = this.store.get(WormholeConfig)
    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.error('Networks removed', {
        plugin: WormholeConfig.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: WormholeConfig.key,
      })
      this.store.set(WormholeConfig, reconciled.updated)
    }
  }

  async getLatestNetworks(): Promise<WormholeNetwork[]> {
    const response = await this.http.fetchRaw(DOCS_URL, { timeout: 10_000 })

    const html = await response.text()
    const $ = cheerio.load(html)

    // Parse Core Contracts (first tabbed-block, first table = mainnet)
    const coreContractsTable = $('.tabbed-block').first().find('table').first()

    const evmContracts: EthereumAddress[] = []

    coreContractsTable.find('tbody tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length === 2) {
        const chain = $(cells[0]).text().trim()
        const address = $(cells[1]).find('code').text().trim()

        if (
          chain &&
          address &&
          address.startsWith('0x') &&
          address.length === 42
        ) {
          evmContracts.push(EthereumAddress(address))
        }
      }
    })

    // Parse addresses from sections by finding h2 headers and the tables after them
    const relayerByChain = new Map<string, EthereumAddress>()
    const tokenBridgeByChain = new Map<string, EthereumAddress>()

    $('h2').each((_, h2) => {
      const headerText = $(h2).text()
      const table = $(h2).nextAll('div').find('table').first()

      // Parse Wormhole Relayer addresses
      if (headerText.includes('Wormhole Relayer')) {
        table.find('tbody tr').each((__, row) => {
          const cells = $(row).find('td')
          if (cells.length === 2) {
            const chain = $(cells[0]).text().trim().toLowerCase()
            const address = $(cells[1]).find('code').text().trim()

            if (
              chain &&
              address &&
              address.startsWith('0x') &&
              address.length === 42
            ) {
              relayerByChain.set(chain, EthereumAddress(address))
            }
          }
        })
      }

      // Parse Token Bridge (WTT) addresses
      if (headerText.includes('Wrapped Token Transfers')) {
        table.find('tbody tr').each((__, row) => {
          const cells = $(row).find('td')
          if (cells.length === 2) {
            const chain = $(cells[0]).text().trim().toLowerCase()
            const address = $(cells[1]).find('code').text().trim()

            if (
              chain &&
              address &&
              address.startsWith('0x') &&
              address.length === 42
            ) {
              tokenBridgeByChain.set(chain, EthereumAddress(address))
            }
          }
        })
      }
    })

    const abi = parseAbi(['function chainId() view returns (uint16)'])
    const data = encodeFunctionData({
      abi,
      functionName: 'chainId',
    })
    const calls: CallParameters[] = evmContracts.map((address) => ({
      to: address,
      data: Bytes.fromHex(data),
    }))

    const networkPromises = this.chains.map(async (chain) => {
      const rpc = this.rpcs.get(chain.name)
      if (!rpc) return undefined

      try {
        const block = await rpc.getBlock('latest', false)
        const results = await rpc.multicall(calls, block.number)

        for (let i = 0; i < results.length; i++) {
          const result = results[i]
          if (!result || result.success === false) continue

          try {
            if (result.data.toString() !== '0x') {
              const decoded = decodeFunctionResult({
                abi,
                functionName: 'chainId',
                data: result.data.toString() as Hex,
              })

              const docsChainName = toDocsChainName(chain.name.toLowerCase())
              return {
                chain: chain.name,
                chainId: chain.id,
                wormholeChainId: Number(decoded),
                coreContract: evmContracts[i],
                relayer: relayerByChain.get(docsChainName),
                tokenBridge: tokenBridgeByChain.get(docsChainName),
              }
            }
          } catch {
            // Failed to decode, skip this contract
          }
        }
      } catch (error) {
        this.logger.debug('Failed to multicall for chain', {
          chain: chain.name,
          error,
        })
        return undefined
      }
    })

    const networksArrays = await Promise.all(networkPromises)
    const networks = networksArrays.filter((n) => n !== undefined)

    return [...networks, ...OVERRIDES]
  }
}
