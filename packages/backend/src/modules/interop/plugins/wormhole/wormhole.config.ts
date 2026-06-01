import type { Logger } from '@l2beat/backend-tools'
import type {
  CallParameters,
  HttpClient,
  IRpcClient,
  MulticallV3Response,
} from '@l2beat/shared'
import {
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
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

export function findWormholeChain(
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
  wormholeChainId: number,
): string {
  return (
    wormholeNetworks.find((n) => n.wormholeChainId === wormholeChainId)
      ?.chain ?? `Unknown_${wormholeChainId}`
  )
}

export function getWormholeCoreAddresses(
  networks: WormholeNetwork[],
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []
  for (const network of networks) {
    if (!network.coreContract) continue
    try {
      addresses.push(
        ChainSpecificAddress.fromLong(network.chain, network.coreContract),
      )
    } catch {
      // Chain not supported by ChainSpecificAddress, skip
    }
  }
  return addresses
}

const DOCS_URL =
  'https://wormhole.com/docs/products/reference/contract-addresses/'
const CHAIN_IDS_DOCS_URL =
  'https://wormhole.com/docs/products/reference/chain-ids/'

// Wormhole Standard Relayer — same address on all EVM chains (CREATE2 deployment).
// No longer listed on the Wormhole docs page, so we hardcode it.
const WORMHOLE_RELAYER = EthereumAddress(
  '0x27428DD2d3DD32A4D7f7C497eAaa23130d894911',
)

// Map our chain names to Wormhole docs chain names
const CHAIN_NAME_TO_DOCS: Record<string, string> = {
  bsc: 'bnb smart chain',
  polygonpos: 'polygon',
}

function normalizeDocsChainName(chainName: string): string {
  return chainName
    .toLowerCase()
    .replace(/\(.+?\)/g, '')
    .replace(/[^a-z0-9]/g, '')
}

const DOCS_CHAIN_NAME_TO_CHAIN = Object.fromEntries(
  Object.entries(CHAIN_NAME_TO_DOCS).map(([chain, docsChain]) => [
    normalizeDocsChainName(docsChain),
    chain,
  ]),
)

function toDocsChainName(chainName: string): string {
  return CHAIN_NAME_TO_DOCS[chainName] ?? chainName
}

function toChainNameFromDocs(chainName: string): string | undefined {
  const normalized = normalizeDocsChainName(chainName)
  return DOCS_CHAIN_NAME_TO_CHAIN[normalized] ?? normalized
}

export function parseWormholeChainIdNetworks(html: string): WormholeNetwork[] {
  const $ = cheerio.load(html)
  const table = $('table').first()
  const networks: WormholeNetwork[] = []

  table.find('tbody tr').each((_, row) => {
    const cells = $(row).find('td')
    if (cells.length < 2) return

    const chain = toChainNameFromDocs($(cells[0]).text().trim())
    const wormholeChainIdText =
      $(cells[1]).find('code').first().text().trim() ||
      $(cells[1]).text().trim()
    if (!/^\d+$/.test(wormholeChainIdText)) return

    const wormholeChainId = Number(wormholeChainIdText)
    if (!chain || !Number.isInteger(wormholeChainId)) return

    networks.push({
      chain,
      wormholeChainId,
    })
  })

  return networks
}

function mergeWormholeNetworks(
  chainIdNetworks: WormholeNetwork[],
  contractNetworks: WormholeNetwork[],
): WormholeNetwork[] {
  const byWormholeChainId = new Map<number, WormholeNetwork>()

  for (const network of chainIdNetworks) {
    byWormholeChainId.set(network.wormholeChainId, network)
  }

  for (const network of contractNetworks) {
    byWormholeChainId.set(network.wormholeChainId, {
      ...byWormholeChainId.get(network.wormholeChainId),
      ...network,
    })
  }

  return [...byWormholeChainId.values()].sort(
    (a, b) => a.wormholeChainId - b.wormholeChainId,
  )
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
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const latest = await this.getLatestNetworks()

    const previous = this.store.get(WormholeConfig)
    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
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
    const [response, chainIdsResponse] = await Promise.all([
      this.http.fetchRaw(DOCS_URL, { timeout: 10_000 }),
      this.http.fetchRaw(CHAIN_IDS_DOCS_URL, { timeout: 10_000 }),
    ])

    const [html, chainIdsHtml] = await Promise.all([
      response.text(),
      chainIdsResponse.text(),
    ])
    const $ = cheerio.load(html)
    const chainIdNetworks = parseWormholeChainIdNetworks(chainIdsHtml)

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
    const tokenBridgeByChain = new Map<string, EthereumAddress>()

    $('h2').each((_, h2) => {
      const headerText = $(h2).text()
      const table = $(h2).nextAll('div').find('table').first()

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
      input: Bytes.fromHex(data),
    }))

    const networkPromises = this.chains.map(async (chain) => {
      const rpc = this.rpcs.get(chain.name)
      if (!rpc) return undefined

      try {
        const block = await rpc.getBlock('latest', false)
        const results = await callWithOptionalMulticall(
          rpc,
          calls,
          block.number,
        )

        const validContracts: {
          wormholeChainId: number
          coreContract: EthereumAddress
        }[] = []

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

              validContracts.push({
                wormholeChainId: Number(decoded),
                coreContract: evmContracts[i],
              })
            }
          } catch {
            // Failed to decode, skip this contract
          }
        }

        // Filter out contracts that return chainId 0 (invalid/uninitialized)
        // Some contract addresses exist on multiple chains but return 0 if not the real wormhole core
        const validNonZero = validContracts.filter(
          (c) => c.wormholeChainId !== 0,
        )

        // Pick the first contract with a valid (non-zero) wormhole chain ID
        const selected = validNonZero[0]
        if (!selected) return undefined

        const docsChainName = toDocsChainName(chain.name.toLowerCase())
        return {
          chain: chain.name,
          chainId: chain.id,
          wormholeChainId: selected.wormholeChainId,
          coreContract: selected.coreContract,
          relayer: WORMHOLE_RELAYER,
          tokenBridge: tokenBridgeByChain.get(docsChainName),
        }
      } catch (error) {
        this.logger.debug('Failed to resolve Wormhole core for chain', {
          chain: chain.name,
          error,
        })
        return undefined
      }
    })

    const networksArrays = await Promise.all(networkPromises)
    const networks = networksArrays.filter((n) => n !== undefined)

    return mergeWormholeNetworks(chainIdNetworks, networks)
  }
}

export async function callWithOptionalMulticall(
  rpc: Pick<IRpcClient, 'call' | 'isMulticallDeployed' | 'multicall'>,
  calls: CallParameters[],
  blockNumber: number,
): Promise<MulticallV3Response[]> {
  if (rpc.isMulticallDeployed(blockNumber)) {
    return await rpc.multicall(calls, blockNumber)
  }

  const results: MulticallV3Response[] = []
  for (const call of calls) {
    try {
      const data = await rpc.call(call, blockNumber)
      results.push({ success: data.length !== 0, data })
    } catch (error) {
      if (!isCallRevertedError(error)) {
        throw error
      }
      results.push({ success: false, data: Bytes.EMPTY })
    }
  }
  return results
}

function isCallRevertedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()
  return message.includes('revert') || message.includes('call_exception')
}
