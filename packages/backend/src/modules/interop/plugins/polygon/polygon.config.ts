import type { Logger } from '@l2beat/backend-tools'
import type { EVMLog, IRpcClient } from '@l2beat/shared'
import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { isEqual } from 'earl'
import { decodeEventLog, encodeEventTopics, type Hex, parseAbi } from 'viem'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../../engine/config/InteropConfigStore'

export interface PolygonInteropConfig {
  lastSyncedBlock: number
  predicates: EthereumAddress[]
  rootToChild: Record<Address32, Address32>
  childToRoot: Record<Address32, Address32>
  rootTokens: Address32[]
  childTokens: Address32[]
}

export const PolygonConfig = defineConfig<PolygonInteropConfig>('polygon')

const ROOT_CHAIN_MANAGER = EthereumAddress(
  '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
)
const REGISTRY = EthereumAddress('0x33a02E6cC863D393d6Bf231B697b82F6e499cA71')

const ROOT_CHAIN_MANAGER_MIN_BLOCK = 10735430
const REGISTRY_MIN_BLOCK = 10167710

const predicateRegisteredLog =
  'event PredicateRegistered(bytes32 indexed tokenType, address indexed predicateAddress)'
const rootTokenMappedLog =
  'event TokenMapped(address indexed rootToken, address indexed childToken, bytes32 indexed tokenType)'
const registryTokenMappedLog =
  'event TokenMapped(address indexed rootToken, address indexed childToken)'

const predicateRegisteredAbi = parseAbi([predicateRegisteredLog])
const rootTokenMappedAbi = parseAbi([rootTokenMappedLog])
const registryTokenMappedAbi = parseAbi([registryTokenMappedLog])

const predicateRegisteredTopic0 = encodeEventTopics({
  abi: predicateRegisteredAbi,
  eventName: 'PredicateRegistered',
} as never)[0]
const rootTokenMappedTopic0 = encodeEventTopics({
  abi: rootTokenMappedAbi,
  eventName: 'TokenMapped',
} as never)[0]
const registryTokenMappedTopic0 = encodeEventTopics({
  abi: registryTokenMappedAbi,
  eventName: 'TokenMapped',
} as never)[0]

if (!predicateRegisteredTopic0) {
  throw new Error('Missing PredicateRegistered topic')
}
if (!rootTokenMappedTopic0) {
  throw new Error('Missing RootChainManager TokenMapped topic')
}
if (!registryTokenMappedTopic0) {
  throw new Error('Missing Registry TokenMapped topic')
}

type ConfigLogEntry =
  | {
      kind: 'predicate'
      blockNumber: number
      logIndex: number
      predicate: EthereumAddress
    }
  | {
      kind: 'tokenMapping'
      blockNumber: number
      logIndex: number
      rootToken: Address32
      childToken: Address32
    }

export class PolygonConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [PolygonConfig]

  constructor(
    private store: InteropConfigStore,
    protected logger: Logger,
    private rpcs: Map<string, IRpcClient>,
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this).tag({ tag: PolygonConfig.key })
  }

  async run() {
    try {
      const latest = await this.getLatestConfig()
      if (!latest) {
        return
      }

      const previous = this.store.get(PolygonConfig)
      if (!previous || !isEqual(previous, latest)) {
        this.logger.info('Config updated', { plugin: PolygonConfig.key })
        this.store.set(PolygonConfig, latest)
      }
    } catch (error) {
      this.logger.error('Failed to update config', { error })
    }
  }

  private async getLatestConfig(): Promise<PolygonInteropConfig | undefined> {
    const ethereumRpc = this.rpcs.get('ethereum')
    if (!ethereumRpc) {
      throw new Error('Missing RPC client for ethereum')
    }

    const previous = this.store.get(PolygonConfig)
    const rootToChild = new Map<Address32, Address32>()
    const predicateSet = new Map<string, EthereumAddress>()

    if (previous) {
      for (const [rootToken, childToken] of Object.entries(
        previous.rootToChild,
      )) {
        rootToChild.set(Address32.from(rootToken), Address32.from(childToken))
      }

      for (const predicate of previous.predicates) {
        const normalized = EthereumAddress(predicate)
        predicateSet.set(normalized, normalized)
      }
    }

    const latestBlock = await ethereumRpc.getLatestBlockNumber()
    const baseFromBlock = previous
      ? previous.lastSyncedBlock + 1
      : Math.min(ROOT_CHAIN_MANAGER_MIN_BLOCK, REGISTRY_MIN_BLOCK)

    const rootChainFromBlock = Math.max(
      baseFromBlock,
      ROOT_CHAIN_MANAGER_MIN_BLOCK,
    )
    const registryFromBlock = Math.max(baseFromBlock, REGISTRY_MIN_BLOCK)

    const entries: ConfigLogEntry[] = []

    if (rootChainFromBlock <= latestBlock) {
      const predicateLogs = await ethereumRpc.getLogs(
        rootChainFromBlock,
        latestBlock,
        [ROOT_CHAIN_MANAGER],
        [predicateRegisteredTopic0],
      )

      for (const log of predicateLogs) {
        const entry = parsePredicateRegistered(log)
        if (entry) entries.push(entry)
      }

      const tokenMappedLogs = await ethereumRpc.getLogs(
        rootChainFromBlock,
        latestBlock,
        [ROOT_CHAIN_MANAGER],
        [rootTokenMappedTopic0],
      )

      for (const log of tokenMappedLogs) {
        const entry = parseRootTokenMapped(log)
        if (entry) entries.push(entry)
      }
    }

    if (registryFromBlock <= latestBlock) {
      const registryLogs = await ethereumRpc.getLogs(
        registryFromBlock,
        latestBlock,
        [REGISTRY],
        [registryTokenMappedTopic0],
      )

      for (const log of registryLogs) {
        const entry = parseRegistryTokenMapped(log)
        if (entry) entries.push(entry)
      }
    }

    entries.sort((a, b) => {
      if (a.blockNumber !== b.blockNumber) {
        return a.blockNumber - b.blockNumber
      }
      return a.logIndex - b.logIndex
    })

    for (const entry of entries) {
      if (entry.kind === 'predicate') {
        predicateSet.set(entry.predicate, entry.predicate)
        continue
      }

      rootToChild.set(entry.rootToken, entry.childToken)
    }

    const childToRoot: Record<Address32, Address32> = {}
    for (const [rootToken, childToken] of rootToChild.entries()) {
      childToRoot[childToken] = rootToken
    }

    const rootToChildRecord: Record<Address32, Address32> = {}
    for (const [rootToken, childToken] of rootToChild.entries()) {
      rootToChildRecord[rootToken] = childToken
    }

    const predicates = [...predicateSet.values()].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    )

    const rootTokens = [...rootToChild.keys()].sort((a, b) =>
      a.localeCompare(b),
    )
    const childTokens = [...new Set(rootToChild.values())].sort((a, b) =>
      a.localeCompare(b),
    )

    return {
      lastSyncedBlock: latestBlock,
      predicates,
      rootToChild: rootToChildRecord,
      childToRoot,
      rootTokens,
      childTokens,
    }
  }
}

function parsePredicateRegistered(log: EVMLog): ConfigLogEntry | undefined {
  if (log.topics[0] !== predicateRegisteredTopic0) return

  try {
    const decoded = decodeEventLog({
      abi: predicateRegisteredAbi,
      eventName: 'PredicateRegistered',
      data: log.data as Hex,
      topics: log.topics as [Hex, ...Hex[]],
    })

    const predicateAddress = (
      decoded.args as {
        predicateAddress: `0x${string}`
      }
    ).predicateAddress

    return {
      kind: 'predicate',
      blockNumber: log.blockNumber,
      logIndex: log.logIndex,
      predicate: EthereumAddress(predicateAddress),
    }
  } catch {
    return
  }
}

function parseRootTokenMapped(log: EVMLog): ConfigLogEntry | undefined {
  if (log.topics[0] !== rootTokenMappedTopic0) return

  try {
    const decoded = decodeEventLog({
      abi: rootTokenMappedAbi,
      eventName: 'TokenMapped',
      data: log.data as Hex,
      topics: log.topics as [Hex, ...Hex[]],
    })

    const { rootToken, childToken } = decoded.args as {
      rootToken: `0x${string}`
      childToken: `0x${string}`
    }

    return {
      kind: 'tokenMapping',
      blockNumber: log.blockNumber,
      logIndex: log.logIndex,
      rootToken: Address32.from(rootToken),
      childToken: Address32.from(childToken),
    }
  } catch {
    return
  }
}

function parseRegistryTokenMapped(log: EVMLog): ConfigLogEntry | undefined {
  if (log.topics[0] !== registryTokenMappedTopic0) return

  try {
    const decoded = decodeEventLog({
      abi: registryTokenMappedAbi,
      eventName: 'TokenMapped',
      data: log.data as Hex,
      topics: log.topics as [Hex, ...Hex[]],
    })

    const { rootToken, childToken } = decoded.args as {
      rootToken: `0x${string}`
      childToken: `0x${string}`
    }

    return {
      kind: 'tokenMapping',
      blockNumber: log.blockNumber,
      logIndex: log.logIndex,
      rootToken: Address32.from(rootToken),
      childToken: Address32.from(childToken),
    }
  } catch {
    return
  }
}
