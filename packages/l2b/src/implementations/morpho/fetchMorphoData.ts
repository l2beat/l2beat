import { getChainConfig, getDiscoveryPaths } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { Contract, providers, utils } from 'ethers'
import { mkdirSync, writeFileSync } from 'fs'
import { posix } from 'path'

// Morpho Blue core (emits CreateMarket).
const MORPHO_BLUE = '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb'
// MetaMorpho vault factories (emit CreateMetaMorpho). Both v1.0 and v1.1.
const META_MORPHO_FACTORIES = [
  '0xA9c3D3a366466Fa809d1Ae982Fb2c46E5fC41101', // v1.0
  '0x1897A8997241C1cD4bD0698647e4EB7213535c24', // v1.1
]

const CREATE_MARKET_ABI =
  'event CreateMarket(bytes32 indexed id, (address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams)'
const CREATE_META_MORPHO_ABI =
  'event CreateMetaMorpho(address indexed metaMorpho, address indexed caller, address initialOwner, uint256 initialTimelock, address indexed asset, string name, string symbol, bytes32 salt)'
const META_MORPHO_QUEUE_ABI = [
  'function withdrawQueueLength() view returns (uint256)',
  'function withdrawQueue(uint256) view returns (bytes32)',
]

const BLOCK_CHUNK = 10_000

interface MorphoMarket {
  id: string
  synthAddress: string
  loanToken: string
  collateralToken: string
  oracle: string
  irm: string
  lltv: string
}

export interface MorphoData {
  /** Synthetic market node entries, merged into discovered.json. */
  entries: {
    address: string
    type: 'Contract'
    name: string
    values: Record<string, string>
  }[]
  /** Vault addresses created within the window. */
  vaults: string[]
  /** Per-vault list of synthetic market addresses (its withdraw queue). */
  vaultMarkets: Record<string, string[]>
}

/** Deterministic, domain-separated 20-byte address for a bytes32 market id. */
export function deriveMarketAddress(id: string): string {
  const hash = utils.keccak256(
    utils.solidityPack(['string', 'bytes32'], ['morpho-market', id]),
  )
  const address = utils.getAddress('0x' + hash.slice(-40))
  return ChainSpecificAddress.from('eth', address).toString()
}

function eth(address: string): string {
  return ChainSpecificAddress.from('eth', address).toString()
}

async function blockNumberAtOrBefore(
  provider: providers.JsonRpcProvider,
  targetTimestamp: number,
  latest: number,
): Promise<number> {
  let lo = 0
  let hi = latest
  let answer = 0
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const block = await provider.getBlock(mid)
    if (block.timestamp <= targetTimestamp) {
      answer = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return answer
}

async function getLogsChunked(
  provider: providers.JsonRpcProvider,
  address: string,
  topics: (string | null)[],
  fromBlock: number,
  toBlock: number,
): Promise<providers.Log[]> {
  const logs: providers.Log[] = []
  for (let from = fromBlock; from <= toBlock; from += BLOCK_CHUNK) {
    const to = Math.min(from + BLOCK_CHUNK - 1, toBlock)
    const chunk = await provider.getLogs({
      address,
      topics,
      fromBlock: from,
      toBlock: to,
    })
    logs.push(...chunk)
  }
  return logs
}

export async function fetchMorphoData(days: number): Promise<MorphoData> {
  const chain = getChainConfig('ethereum')
  const provider = new providers.StaticJsonRpcProvider(chain.rpcUrl, 1)

  const latest = await provider.getBlockNumber()
  const latestBlock = await provider.getBlock(latest)
  const cutoffTimestamp = latestBlock.timestamp - days * 86_400
  const cutoffBlock = await blockNumberAtOrBefore(
    provider,
    cutoffTimestamp,
    latest,
  )
  const fromBlock = cutoffBlock + 1
  console.log(
    `Window: blocks ${fromBlock}..${latest} (last ${days} days, since ${new Date(cutoffTimestamp * 1000).toISOString()})`,
  )

  // --- Markets (CreateMarket on the core) ---
  const marketIface = new utils.Interface([CREATE_MARKET_ABI])
  const createMarketTopic = marketIface.getEventTopic('CreateMarket')
  const marketLogs = await getLogsChunked(
    provider,
    MORPHO_BLUE,
    [createMarketTopic],
    fromBlock,
    latest,
  )
  const markets: MorphoMarket[] = marketLogs.map((log) => {
    const { args } = marketIface.parseLog(log)
    const params = args.marketParams
    const id = args.id as string
    return {
      id,
      synthAddress: deriveMarketAddress(id),
      loanToken: eth(params.loanToken),
      collateralToken: eth(params.collateralToken),
      oracle: eth(params.oracle),
      irm: eth(params.irm),
      lltv: params.lltv.toString(),
    }
  })
  const marketBySynth = new Map(markets.map((m) => [m.synthAddress, m]))
  console.log(`Markets created in window: ${markets.length}`)

  // --- Vaults (CreateMetaMorpho on the factories) ---
  const vaultIface = new utils.Interface([CREATE_META_MORPHO_ABI])
  const createVaultTopic = vaultIface.getEventTopic('CreateMetaMorpho')
  const vaults: string[] = []
  for (const factory of META_MORPHO_FACTORIES) {
    const vaultLogs = await getLogsChunked(
      provider,
      factory,
      [createVaultTopic],
      fromBlock,
      latest,
    )
    for (const log of vaultLogs) {
      const { args } = vaultIface.parseLog(log)
      vaults.push(eth(args.metaMorpho))
    }
  }
  console.log(`Vaults created in window: ${vaults.length}`)

  // --- Vault -> markets (from each vault's withdraw queue) ---
  const vaultMarkets: Record<string, string[]> = {}
  for (const vault of vaults) {
    const rawVault = ChainSpecificAddress.address(
      ChainSpecificAddress(vault),
    ).toString()
    const contract = new Contract(rawVault, META_MORPHO_QUEUE_ABI, provider)
    try {
      const length: number = (await contract.withdrawQueueLength()).toNumber()
      const ids: string[] = await Promise.all(
        Array.from({ length }, (_, i) => contract.withdrawQueue(i)),
      )
      // Keep only markets that are in our window (so vault->market edges resolve
      // to existing synthetic market nodes).
      const synthAddrs = ids
        .map((id) => deriveMarketAddress(id))
        .filter((synth) => marketBySynth.has(synth))
      if (synthAddrs.length > 0) {
        vaultMarkets[vault] = synthAddrs
      }
    } catch (error) {
      console.warn(
        `Failed to read withdraw queue for ${vault}: ${String(error)}`,
      )
    }
  }

  const entries: MorphoData['entries'] = markets.map((m) => ({
    address: m.synthAddress,
    type: 'Contract',
    name: `Morpho Market ${m.id.slice(0, 10)}…`,
    values: {
      id: m.id,
      loanToken: m.loanToken,
      collateralToken: m.collateralToken,
      oracle: m.oracle,
      irm: m.irm,
      lltv: m.lltv,
    },
  }))

  return { entries, vaults, vaultMarkets }
}

export function writeMorphoData(data: MorphoData): string {
  const dir = posix.join(getDiscoveryPaths().discovery, 'morpho')
  mkdirSync(dir, { recursive: true })
  const outPath = posix.join(dir, 'morphoData.json')
  writeFileSync(outPath, JSON.stringify(data, null, 2))
  return outPath
}
