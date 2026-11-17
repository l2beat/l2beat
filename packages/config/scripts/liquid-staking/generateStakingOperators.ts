/**
 * Regenerates `src/liquid-staking/stakingOperators.json`: who runs the
 * validators of each liquid staking protocol we can trace onchain.
 *
 * Every active validator comes from one beacon API read at the finalized
 * slot. A validator is a protocol's when the protocol's contracts name its key
 * (Lido, ether.fi) or its withdrawal address (Rocket Pool, StakeWise), and the
 * operator is the one those contracts name. Contracts are read at that slot's
 * execution block, so both sides describe the same moment.
 *
 * wBETH and cbETH are run by Binance and Coinbase alone, and their validators
 * carry no onchain marker, so they have no entry.
 *
 * Needs ETHEREUM_RPC_URL (an archive node: logs are read from the protocols'
 * deployments on) and ETHEREUM_BEACON_API_URL. The RPC is rate limited by
 * ETHEREUM_RPC_CALLS_PER_MINUTE (300 by default), with at most four calls in
 * flight, since the node may be shared.
 *
 * Run with: pnpm --filter @l2beat/config liquid-staking:operators
 */

import { getEnv, Logger } from '@l2beat/backend-tools'
import {
  BeaconChainClient,
  HttpClient,
  MulticallV3Client,
  RpcClient,
} from '@l2beat/shared'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { writeFileSync } from 'fs'
import path from 'path'
import type {
  ProtocolStakingOperators,
  StakingOperatorsSnapshot,
} from '../../src/liquid-staking/stakingOperators'
import type { ProjectStakingOperator as StakingOperator } from '../../src/types'

const OUTPUT = path.join(
  __dirname,
  '../../src/liquid-staking/stakingOperators.json',
)

const MULTICALL = EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11')
const MAX_IN_FLIGHT = 4
/** Rows kept per protocol before the smallest are summed into one. */
const MAX_ROWS = 40
const GWEI_PER_ETH = 1e9

const ACTIVE = ['active_ongoing', 'active_exiting', 'active_slashed']

main().catch((e: unknown) => {
  console.error(e)
  process.exitCode = 1
})

async function main() {
  const env = getEnv()
  const http = new HttpClient()
  const logger = Logger.WARN
  const beacon = new BeaconChainClient({
    sourceName: 'beaconApi',
    beaconApiUrl: withSlash(env.string('ETHEREUM_BEACON_API_URL')),
    callsPerMinute: 60,
    retryStrategy: 'SCRIPT',
    timeout: 600_000,
    http,
    logger,
  })
  const rpc = new RpcClient({
    chain: 'ethereum',
    url: env.string('ETHEREUM_RPC_URL'),
    callsPerMinute: env.integer('ETHEREUM_RPC_CALLS_PER_MINUTE', 300),
    retryStrategy: 'SCRIPT',
    timeout: 120_000,
    http,
    logger,
  })

  const { slot, blockNumber } = await beacon.getBlockNumbers('finalized')
  const timestamp = await rpc.getBlockTimestamp(blockNumber)
  console.log(`Finalized slot ${slot}, block ${blockNumber}.`)

  const validators = await readValidators(beacon, slot)
  console.log(
    `${validators.count} active validators, ${Math.round(validators.totalGwei / GWEI_PER_ETH)} ETH.`,
  )

  const reader = new ContractReader(rpc, blockNumber)
  const protocols: Record<string, ProtocolStakingOperators> = {
    lido: await readLido(reader, validators),
    etherfi: await readEtherfi(reader, validators),
    rocketpool: await readRocketPool(reader, validators),
    stakewise: await readStakeWise(reader, validators),
  }

  const snapshot: StakingOperatorsSnapshot = {
    slot,
    blockNumber,
    timestamp,
    totalEth: toEth(validators.totalGwei),
    validators: validators.count,
    protocols,
  }
  writeFileSync(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`)
  for (const [id, p] of Object.entries(protocols)) {
    console.log(
      `${id}: ${p.eth} ETH in ${p.validators} validators, ${p.operatorCount} operators`,
    )
  }
  console.log(`Wrote ${OUTPUT}`)
}

interface Validators {
  /** Balance by key, in gwei. */
  byPubkey: Map<string, number>
  /** Balance and count by withdrawal address, lowercase. */
  byAddress: Map<string, { gwei: number; count: number }>
  totalGwei: number
  count: number
}

async function readValidators(
  beacon: BeaconChainClient,
  slot: number,
): Promise<Validators> {
  const byPubkey = new Map<string, number>()
  const byAddress = new Map<string, { gwei: number; count: number }>()
  let totalGwei = 0
  for await (const v of beacon.getValidators(slot, ACTIVE)) {
    const gwei = Number(v.balanceGwei)
    byPubkey.set(v.pubkey.toLowerCase(), gwei)
    totalGwei += gwei
    if (v.withdrawalAddress) {
      const address = v.withdrawalAddress.toLowerCase()
      const entry = byAddress.get(address) ?? { gwei: 0, count: 0 }
      entry.gwei += gwei
      entry.count++
      byAddress.set(address, entry)
    }
  }
  return { byPubkey, byAddress, totalGwei, count: byPubkey.size }
}

// --- Lido ---

const LIDO_STAKING_ROUTER = '0xFdDf38947aFB03C621C71b06C9C70bce73f12999'
const LIDO_WITHDRAWAL_VAULT = '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f'
/** Names the operators of the curated module that is not a registry. */
const LIDO_META_REGISTRY = '0xA64b339eebD3dC3De848298B6a140955932901d8'

const lidoRouter = new utils.Interface([
  'function getStakingModuleIds() view returns (uint256[])',
  'function getStakingModule(uint256) view returns (tuple(uint24 id, address stakingModuleAddress, uint16 stakingModuleFee, uint16 treasuryFee, uint16 stakeShareLimit, uint8 status, string name, uint64 lastDepositAt, uint256 lastDepositBlock, uint256 exitedValidatorsCount, uint16 priorityExitShareThreshold, uint64 maxDepositsPerBlock, uint64 minDepositBlockDistance))',
])
/** What every staking module implements. */
const lidoModule = new utils.Interface([
  'function getNodeOperatorsCount() view returns (uint256)',
  'function getNodeOperatorSummary(uint256) view returns (uint256 targetLimitMode, uint256 targetValidatorsCount, uint256 stuckValidatorsCount, uint256 refundedValidatorsCount, uint256 stuckPenaltyEndTimestamp, uint256 totalExitedValidators, uint256 totalDepositedValidators, uint256 depositableValidatorsCount)',
])
/** The node operators registries: the curated modules and Simple DVT. */
const lidoRegistry = new utils.Interface([
  'function getNodeOperator(uint256, bool) view returns (bool active, string name, address rewardAddress, uint64 totalVettedValidators, uint64 totalExitedValidators, uint64 totalAddedValidators, uint64 totalDepositedValidators)',
  'function getSigningKeys(uint256, uint256, uint256) view returns (bytes pubkeys, bytes signatures, bool[] used)',
])
/** The newer modules: curated v2 and community staking. */
const lidoCsm = new utils.Interface([
  'function getSigningKeys(uint256, uint256, uint256) view returns (bytes)',
])
const lidoMetaRegistry = new utils.Interface([
  'function getOperatorMetadata(uint256) view returns (tuple(string name, string description, bool ownerEditsRestricted))',
])
const KEYS_PER_CALL = 400
const CHUNKS_PER_GROUP = 200
const PUBKEY_HEX_LENGTH = 96

async function readLido(
  reader: ContractReader,
  validators: Validators,
): Promise<ProtocolStakingOperators> {
  const [ids] = await reader.one(
    LIDO_STAKING_ROUTER,
    lidoRouter,
    'getStakingModuleIds',
  )
  const companies = new Map<string, StakingOperator>()
  const groups = new Map<string, StakingOperator & { ids: Set<string> }>()
  let gwei = 0
  let count = 0

  for (const id of ids as bigint[]) {
    const [module] = await reader.one(
      LIDO_STAKING_ROUTER,
      lidoRouter,
      'getStakingModule',
      [id],
    )
    const address: string = module.stakingModuleAddress
    const moduleName: string = module.name
    const [operatorCount] = await reader.one(
      address,
      lidoModule,
      'getNodeOperatorsCount',
    )
    const operatorIds = range(Number(operatorCount))
    // Only the registries answer this, and they name their operators.
    const named = await reader.many(
      operatorIds.map((op) => ({
        to: address,
        iface: lidoRegistry,
        fn: 'getNodeOperator',
        args: [op, true],
      })),
    )
    const isRegistry = named.every((r) => r !== undefined)
    const isCurated = /curated/i.test(moduleName)
    const names =
      isRegistry || !isCurated
        ? named.map((r) => r?.name as string | undefined)
        : (
            await reader.many(
              operatorIds.map((op) => ({
                to: LIDO_META_REGISTRY,
                iface: lidoMetaRegistry,
                fn: 'getOperatorMetadata',
                args: [op],
              })),
            )
          ).map((r) => r?.[0].name as string | undefined)
    const summaries = await reader.many(
      operatorIds.map((op) => ({
        to: address,
        iface: lidoModule,
        fn: 'getNodeOperatorSummary',
        args: [op],
      })),
    )
    const chunks = operatorIds.flatMap((op) => {
      const summary = summaries[op]
      assert(summary, 'Lido operator summary missing')
      const deposited = Number(summary.totalDepositedValidators)
      return range(Math.ceil(deposited / KEYS_PER_CALL)).map((i) => ({
        op,
        start: i * KEYS_PER_CALL,
        n: Math.min(KEYS_PER_CALL, deposited - i * KEYS_PER_CALL),
      }))
    })
    // Curated operators are companies; other modules' are summed per module.
    const group = isCurated ? undefined : moduleGroup(moduleName)
    // Each answer carries up to 400 keys with their signatures, so the keys
    // are read a group at a time, a few answers per request, and dropped once
    // matched.
    for (let from = 0; from < chunks.length; from += CHUNKS_PER_GROUP) {
      const part = chunks.slice(from, from + CHUNKS_PER_GROUP)
      const keys = await reader.many(
        part.map((c) => ({
          to: address,
          iface: isRegistry ? lidoRegistry : lidoCsm,
          fn: 'getSigningKeys',
          args: [c.op, c.start, c.n],
        })),
        4,
      )
      part.forEach((chunk, i) => {
        const result = keys[i]
        assert(result, 'Lido signing keys missing')
        const hex = (result[0] as string).slice(2)
        for (let k = 0; k < hex.length; k += PUBKEY_HEX_LENGTH) {
          const balance = validators.byPubkey.get(
            `0x${hex.slice(k, k + PUBKEY_HEX_LENGTH)}`,
          )
          if (balance === undefined) continue
          gwei += balance
          count++
          if (group) {
            const row = groups.get(group) ?? {
              name: group,
              eth: 0,
              validators: 0,
              ids: new Set<string>(),
            }
            row.eth += balance
            row.validators++
            row.ids.add(`${id}:${chunk.op}`)
            groups.set(group, row)
          } else {
            const name = companyName(
              names[chunk.op] || `${moduleName} operator ${chunk.op}`,
            )
            const row = companies.get(companyKey(name)) ?? {
              name,
              eth: 0,
              validators: 0,
            }
            row.eth += balance
            row.validators++
            companies.set(companyKey(name), row)
          }
        }
      })
    }
    console.log(
      `Lido module ${id} ${moduleName}: ${operatorIds.length} operators, ${chunks.reduce((s, c) => s + c.n, 0)} deposited keys.`,
    )
  }

  // Every validator withdrawing to Lido's vault should have matched a key.
  const atVault = validators.byAddress.get(LIDO_WITHDRAWAL_VAULT)
  if (atVault && atVault.count !== count) {
    console.warn(
      `Lido: ${count} validators matched by key, ${atVault.count} withdraw to the vault.`,
    )
  }

  const rows = [
    ...companies.values(),
    ...[...groups.values()].map(({ ids, ...row }) => ({
      ...row,
      operatorCount: ids.size,
    })),
  ]
  return toProtocol(
    gwei,
    count,
    companies.size +
      [...groups.values()].reduce((sum, g) => sum + g.ids.size, 0),
    rows,
    'operators',
  )
}

/** One row for a module of many small operators. */
function moduleGroup(moduleName: string) {
  if (/^community staking/i.test(moduleName)) return 'Community Staking Module'
  if (/simple ?dvt/i.test(moduleName)) return 'Simple DVT Module'
  return moduleName
}

/**
 * A company runs one operator in each curated module, named a little
 * differently in each: "Kiln" and "Kiln - PTO", say.
 */
const LIDO_NAME_SUFFIX =
  /\s*(-\s*|-)(pto|pgo|eeo|iodc\+?|ee|professional trusted operator)$/i
const LIDO_COMPANY_SUFFIX = /\s+(GmbH|AS|LLC|DO|\(BVI\) Limited|Limited)$/i
const LIDO_RENAMES: Record<string, string> = {
  'Prysm Team at Offchain Labs': 'Prysm by Offchain',
  'Gateway.fm': 'Gateway FM',
  blockscape: 'Blockscape',
  ChainLayer: 'Chainlayer',
  'P2P.ORG': 'P2P.org',
}

function companyName(name: string) {
  const short = name
    .replace(LIDO_NAME_SUFFIX, '')
    .replace(LIDO_COMPANY_SUFFIX, '')
    .trim()
  return LIDO_RENAMES[short] ?? short
}

function companyKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// --- ether.fi ---

const ETHERFI_AUCTION_MANAGER = '0x00C452aFFee3a17d9Cecc1Bcd2B8d5C7635C4CB9'
const ETHERFI_STAKING_MANAGER = '0x25e821b7197B146F7713C3b89B6A4D83516B912d'
const ETHERFI_NODES_MANAGER = '0x8B71140AD2e5d1E7018d2a7f8a288BD3CD38916F'
const ETHERFI_DEPLOYED_AT = 17_174_000

const etherfiEvents = new utils.Interface([
  'event BidCreated(address indexed bidder, uint256 amountPerBid, uint256[] bidIdArray, uint64[] ipfsIndexArray)',
  'event ValidatorRegistered(address indexed operator, address indexed bNftOwner, address indexed tNftOwner, uint256 validatorId, bytes validatorPubKey, string ipfsHashForEncryptedValidatorKey)',
  'event ValidatorCreationStatusUpdated(tuple(bytes publicKey, bytes signature, bytes32 depositDataRoot, string ipfsHashForEncryptedValidatorKey) depositData, uint256 bidId, address etherFiNode, bytes32 hashedAllData, uint8 indexed status)',
  'event PubkeyLinked(bytes32 indexed pubkeyHash, address indexed nodeAddress, uint256 indexed legacyId, bytes pubkey)',
])

/**
 * An operator wins a validator by bidding for it, so the bid names the
 * operator. Validators registered before the bids carry the operator in their
 * own event.
 */
async function readEtherfi(
  reader: ContractReader,
  validators: Validators,
): Promise<ProtocolStakingOperators> {
  const logs = (address: string, event: string) =>
    reader.logs(address, etherfiEvents, event, ETHERFI_DEPLOYED_AT)
  const [bids, registered, created, linked] = [
    await logs(ETHERFI_AUCTION_MANAGER, 'BidCreated'),
    await logs(ETHERFI_STAKING_MANAGER, 'ValidatorRegistered'),
    await logs(ETHERFI_STAKING_MANAGER, 'ValidatorCreationStatusUpdated'),
    await logs(ETHERFI_NODES_MANAGER, 'PubkeyLinked'),
  ]

  const bidder = new Map<string, string>()
  for (const log of bids) {
    for (const id of log.args.bidIdArray) {
      bidder.set(id.toString(), log.args.bidder)
    }
  }
  const operatorOf = new Map<string, string>()
  for (const log of registered) {
    operatorOf.set(log.args.validatorPubKey.toLowerCase(), log.args.operator)
  }
  const fromBid = (pubkey: string, bidId: { toString(): string }) => {
    const operator = bidder.get(bidId.toString())
    if (operator && !operatorOf.has(pubkey)) operatorOf.set(pubkey, operator)
  }
  for (const log of created) {
    fromBid(log.args.depositData.publicKey.toLowerCase(), log.args.bidId)
  }
  for (const log of linked) {
    fromBid(log.args.pubkey.toLowerCase(), log.args.legacyId)
  }

  const operators = new Map<string, StakingOperator>()
  let gwei = 0
  let count = 0
  for (const [pubkey, operator] of operatorOf) {
    const balance = validators.byPubkey.get(pubkey)
    if (balance === undefined) continue
    gwei += balance
    count++
    const address = operator.toLowerCase()
    const row = operators.get(address) ?? {
      name: operator,
      address: operator,
      eth: 0,
      validators: 0,
    }
    row.eth += balance
    row.validators++
    operators.set(address, row)
  }
  return toProtocol(
    gwei,
    count,
    operators.size,
    [...operators.values()],
    'operators',
  )
}

// --- Rocket Pool ---

const ROCKET_STORAGE = '0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46'
const NODES_PER_CALL = 500

const rocketStorage = new utils.Interface([
  'function getAddress(bytes32) view returns (address)',
])
const rocketNodeManager = new utils.Interface([
  'function getNodeCount() view returns (uint256)',
  'function getNodeAddresses(uint256, uint256) view returns (address[])',
  'function getMegapoolAddress(address) view returns (address)',
])
const rocketMinipoolManager = new utils.Interface([
  'function getNodeMinipoolCount(address) view returns (uint256)',
  'function getNodeMinipoolAt(address, uint256) view returns (address)',
])
const rocketMegapoolFactory = new utils.Interface([
  'function getMegapoolDeployed(address) view returns (bool)',
])

/**
 * A Rocket Pool validator withdraws to its minipool or to its node's
 * megapool, so the node is the one those contracts belong to.
 */
async function readRocketPool(
  reader: ContractReader,
  validators: Validators,
): Promise<ProtocolStakingOperators> {
  const contract = async (name: string) => {
    const key = utils.keccak256(utils.toUtf8Bytes(`contract.address${name}`))
    const [address] = await reader.one(
      ROCKET_STORAGE,
      rocketStorage,
      'getAddress',
      [key],
    )
    return address as string
  }
  const nodeManager = await contract('rocketNodeManager')
  const minipoolManager = await contract('rocketMinipoolManager')
  const megapoolFactory = await contract('rocketMegapoolFactory')
  console.log(
    `Rocket Pool contracts: node manager ${nodeManager}, minipool manager ${minipoolManager}, megapool factory ${megapoolFactory}.`,
  )

  const [nodeCount] = await reader.one(
    nodeManager,
    rocketNodeManager,
    'getNodeCount',
  )
  const pages = await reader.many(
    range(Math.ceil(Number(nodeCount) / NODES_PER_CALL)).map((i) => ({
      to: nodeManager,
      iface: rocketNodeManager,
      fn: 'getNodeAddresses',
      args: [i * NODES_PER_CALL, NODES_PER_CALL],
    })),
  )
  const nodes = pages.flatMap((page) => (page?.[0] ?? []) as string[])

  const [minipoolCounts, hasMegapool] = [
    await reader.many(
      nodes.map((node) => ({
        to: minipoolManager,
        iface: rocketMinipoolManager,
        fn: 'getNodeMinipoolCount',
        args: [node],
      })),
    ),
    await reader.many(
      nodes.map((node) => ({
        to: megapoolFactory,
        iface: rocketMegapoolFactory,
        fn: 'getMegapoolDeployed',
        args: [node],
      })),
    ),
  ]
  const minipoolCalls = nodes.flatMap((node, i) =>
    range(Number(minipoolCounts[i]?.[0] ?? 0)).map((k) => ({ node, k })),
  )
  const minipools = await reader.many(
    minipoolCalls.map(({ node, k }) => ({
      to: minipoolManager,
      iface: rocketMinipoolManager,
      fn: 'getNodeMinipoolAt',
      args: [node, k],
    })),
  )
  const megapoolNodes = nodes.filter((_, i) => hasMegapool[i]?.[0] === true)
  const megapools = await reader.many(
    megapoolNodes.map((node) => ({
      to: nodeManager,
      iface: rocketNodeManager,
      fn: 'getMegapoolAddress',
      args: [node],
    })),
  )

  const nodeOf = new Map<string, string>()
  minipoolCalls.forEach(({ node }, i) => {
    const pool = minipools[i]?.[0] as string | undefined
    if (pool) nodeOf.set(pool.toLowerCase(), node)
  })
  megapoolNodes.forEach((node, i) => {
    const pool = megapools[i]?.[0] as string | undefined
    if (pool) nodeOf.set(pool.toLowerCase(), node)
  })
  console.log(
    `Rocket Pool: ${nodes.length} nodes, ${minipoolCalls.length} minipools, ${megapoolNodes.length} megapools.`,
  )

  return byWithdrawalAddress(validators, nodeOf, 'nodes')
}

// --- StakeWise ---

const STAKEWISE_VAULTS_REGISTRY = '0x3a0008a588772446f6e656133C2D5029CC4FC20E'
const STAKEWISE_DEPLOYED_AT = 18_000_000
const STAKEWISE_GENESIS_VAULT = '0xac0f906e433d58fa868f936e8a43230473652885'

const stakewiseRegistry = new utils.Interface([
  'event VaultAdded(address indexed caller, address indexed vault)',
])

/** A StakeWise validator withdraws to the vault that runs it. */
async function readStakeWise(
  reader: ContractReader,
  validators: Validators,
): Promise<ProtocolStakingOperators> {
  const added = await reader.logs(
    STAKEWISE_VAULTS_REGISTRY,
    stakewiseRegistry,
    'VaultAdded',
    STAKEWISE_DEPLOYED_AT,
  )
  const vaults = new Map<string, string>()
  for (const log of added) {
    const vault: string = log.args.vault
    vaults.set(
      vault.toLowerCase(),
      vault.toLowerCase() === STAKEWISE_GENESIS_VAULT ? 'Genesis Vault' : vault,
    )
  }
  return byWithdrawalAddress(validators, vaults, 'vaults')
}

// --- Shared ---

/** Operators by the withdrawal addresses that are theirs. */
function byWithdrawalAddress(
  validators: Validators,
  /** Withdrawal address, lowercase, to the operator's name. */
  operatorOf: Map<string, string>,
  unit: string,
): ProtocolStakingOperators {
  const operators = new Map<string, StakingOperator>()
  let gwei = 0
  let count = 0
  for (const [address, operator] of operatorOf) {
    const stake = validators.byAddress.get(address)
    if (!stake) continue
    gwei += stake.gwei
    count += stake.count
    const row = operators.get(operator) ?? {
      name: operator,
      ...(utils.isAddress(operator) ? { address: operator } : {}),
      eth: 0,
      validators: 0,
    }
    row.eth += stake.gwei
    row.validators += stake.count
    operators.set(operator, row)
  }
  return toProtocol(gwei, count, operators.size, [...operators.values()], unit)
}

/**
 * Rows summed in gwei, rounded to ETH, the largest first, with the smallest
 * summed into one row past `MAX_ROWS`.
 */
function toProtocol(
  gwei: number,
  validators: number,
  operatorCount: number,
  rowsInGwei: StakingOperator[],
  unit: string,
): ProtocolStakingOperators {
  const rows = rowsInGwei
    .map((row) => ({ ...row, eth: toEth(row.eth) }))
    .sort((a, b) => b.eth - a.eth || a.name.localeCompare(b.name))
  if (rows.length > MAX_ROWS) {
    const rest = rows.splice(MAX_ROWS - 1)
    rows.push({
      name: `Other ${unit}`,
      eth: rest.reduce((sum, row) => sum + row.eth, 0),
      validators: rest.reduce((sum, row) => sum + row.validators, 0),
      operatorCount: rest.reduce(
        (sum, row) => sum + (row.operatorCount ?? 1),
        0,
      ),
    })
  }
  return { eth: toEth(gwei), validators, operatorCount, operators: rows }
}

function toEth(gwei: number) {
  return Math.round(gwei / GWEI_PER_ETH)
}

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i)
}

function withSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`
}

interface Call {
  to: string
  iface: utils.Interface
  fn: string
  args?: unknown[]
}

/** Contract reads at one block, a few requests at a time. */
class ContractReader {
  constructor(
    private readonly rpc: RpcClient,
    private readonly blockNumber: number,
  ) {}

  async one(
    to: string,
    iface: utils.Interface,
    fn: string,
    args: unknown[] = [],
  ) {
    const [result] = await this.many([{ to, iface, fn, args }])
    assert(result, `Call failed: ${fn}`)
    return result
  }

  /** Each call's result, or undefined where the call reverted. */
  async many(
    calls: Call[],
    perRequest = 150,
  ): Promise<(utils.Result | undefined)[]> {
    const multicall = new MulticallV3Client(MULTICALL, 0, perRequest)
    const batches = multicall.encodeBatches(
      calls.map((c) => ({
        to: EthereumAddress(c.to),
        input: Bytes.fromHex(c.iface.encodeFunctionData(c.fn, c.args ?? [])),
      })),
    )
    const answers = await inPool(batches, MAX_IN_FLIGHT, async (batch) =>
      multicall.decode(await this.rpc.call(batch, this.blockNumber)),
    )
    return answers.flat().map((answer, i) => {
      const call = calls[i]
      assert(call)
      return answer.success
        ? call.iface.decodeFunctionResult(call.fn, answer.data.toString())
        : undefined
    })
  }

  /** Every log of one event, from `from` to the block read at. */
  async logs(
    address: string,
    iface: utils.Interface,
    event: string,
    from: number,
  ) {
    const topic = iface.getEventTopic(event)
    const logs = await this.rpc.getLogs(
      from,
      this.blockNumber,
      [address],
      [topic],
    )
    return logs.map((log) => iface.parseLog(log))
  }
}

async function inPool<T, R>(
  items: T[],
  size: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        results[i] = await fn(items[i] as T)
      }
    }),
  )
  return results
}
