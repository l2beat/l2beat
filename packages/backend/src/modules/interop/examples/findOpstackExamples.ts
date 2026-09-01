import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { config as dotenv } from 'dotenv'
import {
  type AbiEvent,
  createPublicClient,
  decodeEventLog,
  type Hex,
  http,
  type PublicClient,
  parseAbiItem,
  toEventSelector,
} from 'viem'
import { OPSTACK_NETWORKS } from '../plugins/opstack/opstack'

dotenv({ path: '../config/.env' })
dotenv()

const L1_RPC_BATCH = 50_000
const L2_RPC_BATCH = 200_000
const DEFAULT_L1_BLOCK_RANGE = 10_000

const EV = {
  TransactionDeposited: parseAbiItem(
    'event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)',
  ),
  WithdrawalFinalized: parseAbiItem(
    'event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)',
  ),
  ETHDepositInitiated: parseAbiItem(
    'event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)',
  ),
  ERC20DepositInitiated: parseAbiItem(
    'event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
  ),
  ETHBridgeFinalized: parseAbiItem(
    'event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)',
  ),
  ERC20BridgeFinalized: parseAbiItem(
    'event ERC20BridgeFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
  ),
  MessagePassed: parseAbiItem(
    'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
  ),
  DepositFinalized: parseAbiItem(
    'event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
  ),
} as const

interface LogRow {
  address: Hex
  data: Hex
  topics: readonly Hex[]
  transactionHash: Hex
  blockNumber: bigint
}

interface FoundExample {
  description: string
  l1Tx: Hex
  l2Tx: Hex
}

export interface Findings {
  chain: string
  ethDeposit?: FoundExample
  erc20Deposit?: FoundExample
  ethWithdrawal?: FoundExample
  erc20Withdrawal?: FoundExample
  directPortalEthDeposit?: FoundExample
}

function env(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

function client(url: string): PublicClient {
  return createPublicClient({ transport: http(url) })
}

async function getLogs(
  c: PublicClient,
  address: Hex,
  event: AbiEvent,
  fromBlock: bigint,
  toBlock: bigint,
  batch: number,
): Promise<LogRow[]> {
  const out: LogRow[] = []
  for (let from = fromBlock; from <= toBlock; from += BigInt(batch)) {
    const to =
      from + BigInt(batch) - 1n > toBlock ? toBlock : from + BigInt(batch) - 1n
    const chunk = await c.getLogs({
      address,
      event,
      fromBlock: from,
      toBlock: to,
    })
    for (const l of chunk) {
      if (!l.transactionHash || l.blockNumber === null) continue
      out.push({
        address: l.address,
        data: l.data,
        topics: l.topics,
        transactionHash: l.transactionHash,
        blockNumber: l.blockNumber,
      })
    }
  }
  return out
}

function decode<T extends AbiEvent>(
  ev: T,
  log: LogRow,
): { args: Record<string, unknown> } {
  return decodeEventLog({
    abi: [ev],
    data: log.data,
    topics: log.topics as [Hex, ...Hex[]],
  }) as never
}

async function findEthDeposit(
  l1: PublicClient,
  l2: PublicClient,
  l1Bridge: Hex,
  l2Bridge: Hex,
  l1From: bigint,
  l1To: bigint,
  l2From: bigint,
  l2To: bigint,
): Promise<FoundExample | undefined> {
  const initiated = await getLogs(
    l1,
    l1Bridge,
    EV.ETHDepositInitiated,
    l1From,
    l1To,
    L1_RPC_BATCH,
  )
  if (initiated.length === 0) return
  const finalized = await getLogs(
    l2,
    l2Bridge,
    EV.ETHBridgeFinalized,
    l2From,
    l2To,
    L2_RPC_BATCH,
  )
  for (const l1Log of initiated) {
    const amount = decode(EV.ETHDepositInitiated, l1Log).args.amount as bigint
    const l2Match = finalized.find(
      (f) =>
        (decode(EV.ETHBridgeFinalized, f).args.amount as bigint) === amount,
    )
    if (l2Match) {
      return {
        description: `${formatEth(amount)} ETH`,
        l1Tx: l1Log.transactionHash,
        l2Tx: l2Match.transactionHash,
      }
    }
  }
}

async function findErc20Deposit(
  l1: PublicClient,
  l2: PublicClient,
  l1Bridge: Hex,
  l2Bridge: Hex,
  l1From: bigint,
  l1To: bigint,
  l2From: bigint,
  l2To: bigint,
): Promise<FoundExample | undefined> {
  const initiated = await getLogs(
    l1,
    l1Bridge,
    EV.ERC20DepositInitiated,
    l1From,
    l1To,
    L1_RPC_BATCH,
  )
  if (initiated.length === 0) return
  const finalized = await getLogs(
    l2,
    l2Bridge,
    EV.DepositFinalized,
    l2From,
    l2To,
    L2_RPC_BATCH,
  )
  for (const l1Log of initiated) {
    const args = decode(EV.ERC20DepositInitiated, l1Log).args
    const amount = args.amount as bigint
    const l1Token = (args.l1Token as string).toLowerCase()
    const l2Match = finalized.find((f) => {
      const d = decode(EV.DepositFinalized, f).args
      return (
        (d.amount as bigint) === amount &&
        (d.l1Token as string).toLowerCase() === l1Token
      )
    })
    if (l2Match) {
      return {
        description: `ERC20 ${l1Token} amount=${amount.toString()}`,
        l1Tx: l1Log.transactionHash,
        l2Tx: l2Match.transactionHash,
      }
    }
  }
}

async function findWithdrawal(
  l1: PublicClient,
  l2: PublicClient,
  portal: Hex,
  l1Bridge: Hex,
  l2Passer: Hex,
  tokenKind: 'eth' | 'erc20',
  l1From: bigint,
  l1To: bigint,
  l2WithdrawalFrom: bigint,
  l2To: bigint,
): Promise<FoundExample | undefined> {
  const finals = await getLogs(
    l1,
    portal,
    EV.WithdrawalFinalized,
    l1From,
    l1To,
    L1_RPC_BATCH,
  )
  const selector =
    tokenKind === 'eth'
      ? toEventSelector(EV.ETHBridgeFinalized)
      : toEventSelector(EV.ERC20BridgeFinalized)
  const messagePassed = await getLogs(
    l2,
    l2Passer,
    EV.MessagePassed,
    l2WithdrawalFrom,
    l2To,
    L2_RPC_BATCH,
  )

  for (const wf of finals) {
    const receipt = await l1.getTransactionReceipt({ hash: wf.transactionHash })
    const hasBridgeFinalized = receipt.logs.some(
      (l) =>
        l.address.toLowerCase() === l1Bridge.toLowerCase() &&
        l.topics[0] === selector,
    )
    if (!hasBridgeFinalized) continue
    const withdrawalHash = wf.topics[1]
    const mp = messagePassed.find(
      (m) =>
        (
          decode(EV.MessagePassed, m).args.withdrawalHash as string
        ).toLowerCase() === withdrawalHash.toLowerCase(),
    )
    if (mp) {
      return {
        description: `withdrawal (${tokenKind}) wh=${withdrawalHash.slice(0, 12)}…`,
        l1Tx: wf.transactionHash,
        l2Tx: mp.transactionHash,
      }
    }
  }
}

async function findDirectPortalEthDeposit(
  l1: PublicClient,
  l2: PublicClient,
  portal: Hex,
  l1Bridge: Hex,
  l1Xdom: Hex,
  l1From: bigint,
  l1To: bigint,
): Promise<FoundExample | undefined> {
  const deposits = await getLogs(
    l1,
    portal,
    EV.TransactionDeposited,
    l1From,
    l1To,
    L1_RPC_BATCH,
  )
  for (const d of deposits) {
    const receipt = await l1.getTransactionReceipt({ hash: d.transactionHash })
    const addrs = new Set(receipt.logs.map((l) => l.address.toLowerCase()))
    if (addrs.has(l1Bridge.toLowerCase()) || addrs.has(l1Xdom.toLowerCase()))
      continue
    const tx = await l1.getTransaction({ hash: d.transactionHash })
    if (tx.value === 0n) continue
    const recipient = `0x${d.topics[2].slice(-40)}` as Hex
    const block = await l1.getBlock({ blockNumber: d.blockNumber })
    const l2Hash = await findL2DepositTxByTimestamp(
      l2,
      block.timestamp,
      recipient.toLowerCase(),
    )
    if (l2Hash) {
      return {
        description: `direct portal ETH deposit ${formatEth(tx.value)}`,
        l1Tx: d.transactionHash,
        l2Tx: l2Hash,
      }
    }
  }
}

async function findL2DepositTxByTimestamp(
  l2: PublicClient,
  l1Timestamp: bigint,
  recipientLc: string,
): Promise<Hex | undefined> {
  const tip = await l2.getBlock({ blockTag: 'latest' })
  const secondsSince = Number(tip.timestamp - l1Timestamp)
  const btMs = await estimateBlockTimeMs(l2, tip.number, tip.timestamp)
  const guess = tip.number - BigInt(Math.round((secondsSince * 1000) / btMs))
  const window = BigInt(Math.max(240, Math.ceil((240 * 1000) / btMs)))
  for (let delta = 0n; delta <= window; delta++) {
    for (const sign of [1n, -1n] as const) {
      const b = guess + sign * delta
      if (b < 0n) continue
      const block = (await l2.getBlock({
        blockNumber: b,
        includeTransactions: true,
      })) as unknown as {
        transactions: Array<{ typeHex?: string; hash: Hex; to?: string | null }>
      }
      const match = block.transactions.find(
        (t) =>
          t.typeHex === '0x7e' && (t.to ?? '').toLowerCase() === recipientLc,
      )
      if (match) return match.hash
    }
  }
}

function formatEth(value: bigint): string {
  const s = value.toString().padStart(19, '0')
  const whole = s.slice(0, -18) || '0'
  const frac = s.slice(-18).replace(/0+$/, '')
  return frac ? `${whole}.${frac}` : whole
}

async function estimateBlockTimeMs(
  c: PublicClient,
  tipNumber: bigint,
  tipTs: bigint,
  sampleBack = 1000n,
): Promise<number> {
  const back = tipNumber > sampleBack ? tipNumber - sampleBack : 0n
  const sample = await c.getBlock({ blockNumber: back })
  const blocks = tipNumber - back
  if (blocks === 0n) return 1000
  const seconds = Number(tipTs - sample.timestamp)
  return (seconds * 1000) / Number(blocks)
}

async function blocksForSeconds(
  c: PublicClient,
  tipNumber: bigint,
  tipTs: bigint,
  seconds: number,
): Promise<bigint> {
  const btMs = await estimateBlockTimeMs(c, tipNumber, tipTs)
  return BigInt(Math.ceil((seconds * 1000) / btMs))
}

export async function findOpstackExamples(
  chain: string,
  opts: { l1Blocks?: number } = {},
): Promise<Findings> {
  const network = OPSTACK_NETWORKS.find((n) => n.chain === chain)
  if (!network) throw new Error(`Unknown opstack chain: ${chain}`)

  const l1 = client(env('ETHEREUM_RPC_URL'))
  const l2 = client(env(`${chain.toUpperCase()}_RPC_URL`))

  const l1Tip = await l1.getBlockNumber()
  const l2Tip = await l2.getBlockNumber()
  const l1BlockRange = BigInt(opts.l1Blocks ?? DEFAULT_L1_BLOCK_RANGE)
  const l1From = l1Tip - l1BlockRange
  const l1To = l1Tip

  const l1FromTs = (await l1.getBlock({ blockNumber: l1From })).timestamp
  const l2TipTs = (await l2.getBlock({ blockNumber: l2Tip })).timestamp
  const depositWindowSec = Number(l2TipTs - l1FromTs)
  const depositL2Blocks = await blocksForSeconds(
    l2,
    l2Tip,
    l2TipTs,
    depositWindowSec + 200,
  )
  const l2From = l2Tip > depositL2Blocks ? l2Tip - depositL2Blocks : 0n
  const l2To = l2Tip
  // MessagePassed on L2 happens ~7 days before WithdrawalFinalized on L1. Look back 14 days.
  const withdrawalL2Blocks = await blocksForSeconds(
    l2,
    l2Tip,
    l2TipTs,
    14 * 24 * 60 * 60,
  )
  const l2WithdrawalFrom =
    l2Tip > withdrawalL2Blocks ? l2Tip - withdrawalL2Blocks : 0n

  const portal = ChainSpecificAddress.address(network.optimismPortal) as Hex
  const l1Bridge = ChainSpecificAddress.address(network.l1StandardBridge) as Hex
  const l1Xdom = ChainSpecificAddress.address(
    network.l1CrossDomainMessenger,
  ) as Hex
  const l2Bridge = ChainSpecificAddress.address(network.l2StandardBridge) as Hex
  const l2Passer = ChainSpecificAddress.address(
    network.l2ToL1MessagePasser,
  ) as Hex

  const [
    ethDeposit,
    erc20Deposit,
    ethWithdrawal,
    erc20Withdrawal,
    directPortalEthDeposit,
  ] = await Promise.all([
    findEthDeposit(l1, l2, l1Bridge, l2Bridge, l1From, l1To, l2From, l2To),
    findErc20Deposit(l1, l2, l1Bridge, l2Bridge, l1From, l1To, l2From, l2To),
    findWithdrawal(
      l1,
      l2,
      portal,
      l1Bridge,
      l2Passer,
      'eth',
      l1From,
      l1To,
      l2WithdrawalFrom,
      l2To,
    ),
    findWithdrawal(
      l1,
      l2,
      portal,
      l1Bridge,
      l2Passer,
      'erc20',
      l1From,
      l1To,
      l2WithdrawalFrom,
      l2To,
    ),
    findDirectPortalEthDeposit(l1, l2, portal, l1Bridge, l1Xdom, l1From, l1To),
  ])

  return {
    chain,
    ethDeposit,
    erc20Deposit,
    ethWithdrawal,
    erc20Withdrawal,
    directPortalEthDeposit,
  }
}

if (require.main === module) {
  const chain = process.argv[2]
  const l1Blocks = process.argv[3] ? Number(process.argv[3]) : undefined
  if (!chain) {
    console.error('usage: find-opstack-examples <chain> [l1Blocks]')
    process.exit(1)
  }
  findOpstackExamples(chain, { l1Blocks })
    .then((f) => {
      for (const [k, v] of Object.entries(f)) {
        if (k === 'chain') continue
        if (v === undefined) {
          console.log(`${k}: not found`)
        } else {
          const ex = v as FoundExample
          console.log(`${k}: ${ex.description}`)
          console.log(`  ethereum: ${ex.l1Tx}`)
          console.log(`  ${chain}:  ${ex.l2Tx}`)
        }
      }
    })
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}
