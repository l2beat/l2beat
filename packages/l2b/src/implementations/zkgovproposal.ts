#!/usr/bin/env node

import { ethers } from 'ethers'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config()

// -----------------------------------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------------------------------

/**
 * Primary configuration parameters and constants
 */
const CONFIG = {
  RPC: {
    ZKSYNC2: process.env.ZKSYNC2_RPC_URL,
    ETHEREUM: process.env.ETHEREUM_RPC_URL,
  },
  ADDRESSES: {
    // ZKsync Era (L2)
    ZK_PROTOCOL_GOVERNOR: '0x76705327e682F2d96943280D99464Ab61219e34f',
    L1_MESSENGER: '0x0000000000000000000000000000000000008008', // System Contract
    // Ethereum (L1)
    PROTOCOL_UPGRADE_HANDLER: '0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3',
  },
  CACHE: {
    FILE_PATH: path.join(__dirname, 'governance_event_cache.json'),
  },
  SEARCH: {
    L1_EVENT_BLOCK_RANGE: 1_000_000,
  },
  TIMEFRAMES: {
    L1_STANDARD_LEGAL_VETO_SECONDS: 3 * 24 * 60 * 60, // 3 days
    L1_EXTENDED_LEGAL_VETO_SECONDS: 7 * 24 * 60 * 60, // 7 days
    L1_UPGRADE_DELAY_SECONDS: 1 * 24 * 60 * 60, // 1 day
    L1_WAIT_OR_EXPIRE_SECONDS: 30 * 24 * 60 * 60, // 30 days
  },
  VOTE_TOKEN_DECIMALS: 18,
  L2_MESSENGER_SEND_SELECTOR: '0x62f84b24',
}

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

/**
 * L2 Governance State (ZKsync Era)
 */
enum L2State {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

/**
 * L1 Upgrade State (Ethereum)
 */
enum L1State {
  None = 0,
  LegalVetoPeriod = 1,
  Waiting = 2,
  ExecutionPending = 3,
  Ready = 4,
  Expired = 5,
  Done = 6,
}

/**
 * Function call in upgrade proposal
 */
interface Call {
  target: string
  value: ethers.BigNumber
  data: string
}

/**
 * L1 Upgrade proposal
 */
interface UpgradeProposal {
  calls: Call[]
  executor: string
  salt: string
}

/**
 * ProposalCreated event data
 */
interface ProposalCreatedData {
  proposalId: ethers.BigNumber
  proposer: string
  targets: string[]
  values: ethers.BigNumber[]
  signatures: string[]
  calldatas: string[]
  voteStart: ethers.BigNumber // Timestamp
  voteEnd: ethers.BigNumber // Timestamp
  description: string
  blockNumber: number
  txHash: string
}

/**
 * ProposalExecuted event data
 */
interface ProposalExecutedData {
  proposalId: ethers.BigNumber
  blockNumber: number
  txHash: string
}

/**
 * ProposalExtended event data
 */
interface ProposalExtendedData {
  proposalId: ethers.BigNumber
  extendedDeadline: ethers.BigNumber // Timestamp
  blockNumber: number
  txHash: string
}

/**
 * L1MessageSent event data
 */
interface L1MessageSentData {
  sender: string
  hash: string
  message: string
  blockNumber: number
  txHash: string
}

/**
 * UpgradeStarted event data
 */
interface UpgradeStartedData {
  id: string
  proposal: UpgradeProposal
  blockNumber: number
  txHash: string
}

/**
 * L1 Upgrade status data
 */
interface UpgradeStatusData {
  creationTimestamp: number
  securityCouncilApprovalTimestamp: number
  guardiansApproval: boolean
  guardiansExtendedLegalVeto: boolean
  executed: boolean
}

/**
 * Proposal votes
 */
interface ProposalVotes {
  againstVotes: ethers.BigNumber
  forVotes: ethers.BigNumber
  abstainVotes: ethers.BigNumber
}

/**
 * Event cache for persistent storage
 */
interface EventCache {
  lastL2BlockFetched: number
  proposalCreatedEvents: ProposalCreatedData[]
  proposalExecutedEvents: ProposalExecutedData[]
  proposalExtendedEvents: ProposalExtendedData[]
}

/**
 * Block range for event queries
 */
interface BlockRange {
  fromBlock: number
  toBlock: number
}

/**
 * Visual formatting options for consistent styling
 */
const COLORS = {
  heading: chalk.bold.cyan,
  subheading: chalk.bold,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.blue,
  detail: chalk.magenta,
  value: chalk.yellow,
  hash: chalk.cyan,
  address: chalk.yellow,
  timestamp: chalk.cyan,
  percentage: chalk.magenta,
  trace: chalk.gray,
  active: chalk.green.bold,
  inactive: chalk.dim,
  completed: chalk.gray,
  important: chalk.bold.white,
  divider: chalk.dim,
  connector: chalk.gray,
  highlight: chalk.bold.white,
  extended: chalk.blue,
}

// -----------------------------------------------------------------------------
// CONTRACT ABIs
// -----------------------------------------------------------------------------

/**
 * ZK Protocol Governor ABI
 */
const ZK_PROTOCOL_GOVERNOR_ABI = [
  'event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)',
  'event ProposalExecuted(uint256 proposalId)',
  'event ProposalExtended(uint256 indexed proposalId, uint64 extendedDeadline)',
  'function proposalVotes(uint256 proposalId) view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)',
  'function state(uint256 proposalId) view returns (uint8)',
  'function quorum(uint256 blockNumber) view returns (uint256)',
]

/**
 * L1 Messenger ABI
 */
const L1_MESSENGER_ABI = [
  'event L1MessageSent(address indexed _sender, bytes32 indexed _hash, bytes _message)',
]

/**
 * Protocol Upgrade Handler ABI
 */
const PROTOCOL_UPGRADE_HANDLER_ABI = [
  'event UpgradeStarted(bytes32 indexed _id, tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt) _proposal)',
  'function upgradeState(bytes32 _id) view returns (uint8)',
  'function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)',
]

/**
 * Type for L1 upgrade proposal
 */
const UPGRADE_PROPOSAL_TYPE =
  'tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt)'

// -----------------------------------------------------------------------------
// CACHE MANAGEMENT
// -----------------------------------------------------------------------------

/**
 * Load event cache from disk or initialize a new one
 */
function loadCache(): EventCache {
  if (fs.existsSync(CONFIG.CACHE.FILE_PATH)) {
    try {
      const data = fs.readFileSync(CONFIG.CACHE.FILE_PATH, 'utf-8')
      const cache: EventCache = JSON.parse(data, (key, value) => {
        if (
          typeof value === 'object' &&
          value !== null &&
          value.type === 'BigNumber'
        ) {
          return ethers.BigNumber.from(value.hex)
        }
        return value
      })

      console.log(
        COLORS.trace(
          `Loaded cache from ${CONFIG.CACHE.FILE_PATH}. Last L2 block fetched: ${cache.lastL2BlockFetched}`,
        ),
      )

      // Initialize arrays if missing
      cache.proposalCreatedEvents = cache.proposalCreatedEvents || []
      cache.proposalExecutedEvents = cache.proposalExecutedEvents || []
      cache.proposalExtendedEvents = cache.proposalExtendedEvents || []

      return cache
    } catch (error) {
      console.warn(
        COLORS.warning(
          `Could not read cache file ${CONFIG.CACHE.FILE_PATH}: ${error}. Starting fresh.`,
        ),
      )
    }
  }

  // Initialize empty cache
  return {
    lastL2BlockFetched: 0,
    proposalCreatedEvents: [],
    proposalExecutedEvents: [],
    proposalExtendedEvents: [],
  }
}

/**
 * Save event cache to disk
 */
function saveCache(cache: EventCache): void {
  try {
    const data = JSON.stringify(
      cache,
      (key, value) => {
        if (ethers.BigNumber.isBigNumber(value)) {
          return { type: 'BigNumber', hex: value.toHexString() }
        }
        return value
      },
      2,
    )

    fs.writeFileSync(CONFIG.CACHE.FILE_PATH, data, 'utf-8')
    console.log(
      COLORS.trace(
        `Saved cache to ${CONFIG.CACHE.FILE_PATH}. Last L2 block fetched: ${cache.lastL2BlockFetched}`,
      ),
    )
  } catch (error) {
    console.error(COLORS.error(`Error saving cache: ${error}`))
  }
}

// -----------------------------------------------------------------------------
// FORMATTING HELPERS
// -----------------------------------------------------------------------------

/**
 * Format UNIX timestamp as readable date string
 */
function formatTimestamp(
  timestamp: number | ethers.BigNumber | undefined,
): string {
  if (!timestamp || ethers.BigNumber.from(timestamp).isZero()) return 'N/A'

  try {
    const date = new Date(ethers.BigNumber.from(timestamp).toNumber() * 1000)
    return date.toLocaleString()
  } catch (e) {
    console.warn(
      COLORS.warning(`Could not format timestamp ${timestamp}: ${e}`),
    )
    return 'Invalid Date'
  }
}

/**
 * Map L2 state code to readable string
 */
function mapL2State(state: number): string {
  return L2State[state] ?? `Unknown (${state})`
}

/**
 * Map L1 state code to readable string
 */
function mapL1State(state: number): string {
  return L1State[state] ?? `Unknown (${state})`
}

/**
 * Format ethereum value (in wei) to ETH
 */
function formatValue(value: ethers.BigNumber | undefined | null): string {
  if (value === undefined || value === null) return 'N/A'

  try {
    return ethers.BigNumber.from(value).isZero()
      ? '0'
      : ethers.utils.formatUnits(value, 'ether')
  } catch (e) {
    return `Invalid (${value?.toString() ?? 'undefined'})`
  }
}

/**
 * Format value with specified decimals
 */
function formatUnits(
  value: ethers.BigNumber | undefined | null,
  decimals: number,
): string {
  if (value === undefined || value === null) return 'N/A'

  try {
    return ethers.utils.formatUnits(value, decimals)
  } catch (e) {
    return `Invalid (${value?.toString() ?? 'undefined'})`
  }
}

/**
 * Calculate percentage with fixed precision
 */
function calculatePercentage(
  numerator: ethers.BigNumber,
  denominator: ethers.BigNumber,
): string {
  if (denominator.isZero()) return '0.00'

  try {
    const numFixed = ethers.FixedNumber.fromValue(
      numerator,
      CONFIG.VOTE_TOKEN_DECIMALS,
    )
    const denFixed = ethers.FixedNumber.fromValue(
      denominator,
      CONFIG.VOTE_TOKEN_DECIMALS,
    )

    if (denFixed.isZero()) return '0.00'

    const percentage = numFixed
      .mulUnsafe(ethers.FixedNumber.from(100))
      .divUnsafe(denFixed)
    return percentage.round(2).toString()
  } catch (e) {
    console.warn(
      COLORS.warning(
        `Error calculating percentage (${numerator}/${denominator}): ${e}`,
      ),
    )
    return 'Error'
  }
}

/**
 * Format duration in seconds to human-readable format (d h m)
 */
function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0
  if (totalSeconds === 0) return 'Ended'

  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  totalSeconds %= 24 * 60 * 60

  const hours = Math.floor(totalSeconds / (60 * 60))
  totalSeconds %= 60 * 60

  const minutes = Math.floor(totalSeconds / 60)

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)

  if (parts.length === 0 && totalSeconds > 0) return '< 1m'
  if (parts.length === 0) return 'Ended'

  return parts.join(' ')
}

// -----------------------------------------------------------------------------
// BLOCKCHAIN DATA FETCHING
// -----------------------------------------------------------------------------

/**
 * Fetch events from L2 blockchain and update cache
 */
async function fetchL2Events<T extends ethers.BaseContract>(
  contract: T,
  eventName: string,
  cacheKey: keyof EventCache,
  cache: EventCache,
  l2Provider: ethers.providers.JsonRpcProvider,
  parser: (log: ethers.Event) => any,
  forceRange: BlockRange | null = null,
): Promise<number> {
  const latestBlock = forceRange
    ? forceRange.toBlock
    : await l2Provider.getBlockNumber()
  const fromBlock = forceRange
    ? forceRange.fromBlock
    : cache.lastL2BlockFetched + 1
  const toBlock = latestBlock

  if (fromBlock > toBlock) {
    console.log(
      COLORS.trace(
        `Block range (${fromBlock}-${toBlock}) invalid or already covered for ${eventName} events.`,
      ),
    )
    return 0
  }

  console.log(
    COLORS.info(
      `Fetching ${eventName} events from block ${fromBlock} to ${toBlock}...`,
    ),
  )

  let addedCount = 0

  try {
    const eventFilter = (contract.filters as any)[eventName]()

    if (!eventFilter) {
      throw new Error(`Filter for event ${eventName} not found.`)
    }

    const logs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
    console.log(
      COLORS.trace(`Found ${logs.length} ${eventName} events in range.`),
    )

    const existingTxHashes = new Set(
      (cache[cacheKey] as any[]).map((e) => e.txHash),
    )

    for (const log of logs) {
      if (existingTxHashes.has(log.transactionHash)) continue

      try {
        const parsedData = parser(log)
        if (parsedData) {
          ;(cache[cacheKey] as any[]).push(parsedData)
          existingTxHashes.add(log.transactionHash)
          addedCount++
        }
      } catch (e) {
        console.warn(
          COLORS.warning(
            `Could not parse ${eventName} log in tx ${log.transactionHash}: ${e}`,
          ),
        )
      }
    }

    console.log(
      COLORS.trace(
        `Added ${addedCount} new unique ${eventName} events to cache.`,
      ),
    )
  } catch (error) {
    console.error(COLORS.error(`Error fetching ${eventName} events: ${error}`))
  }

  if (!forceRange && toBlock > cache.lastL2BlockFetched) {
    cache.lastL2BlockFetched = toBlock
  } else if (forceRange && toBlock > cache.lastL2BlockFetched) {
    cache.lastL2BlockFetched = toBlock
  }

  return addedCount
}

/**
 * Find L1MessageSent event in a transaction receipt
 */
async function findL1MessageSentInTx(
  l2Provider: ethers.providers.JsonRpcProvider,
  executionTxHash: string,
): Promise<L1MessageSentData | null> {
  console.log(
    COLORS.info(`Fetching receipt for L2 execution tx: ${executionTxHash}...`),
  )

  try {
    const receipt = await l2Provider.getTransactionReceipt(executionTxHash)

    if (!receipt) {
      console.error(
        COLORS.error(
          `Could not find transaction receipt for ${executionTxHash}`,
        ),
      )
      return null
    }

    const l1MessengerInterface = new ethers.utils.Interface(L1_MESSENGER_ABI)
    const l1MessageSentTopic =
      l1MessengerInterface.getEventTopic('L1MessageSent')

    for (const log of receipt.logs) {
      if (
        log.address.toLowerCase() ===
          CONFIG.ADDRESSES.L1_MESSENGER.toLowerCase() &&
        log.topics[0] === l1MessageSentTopic
      ) {
        try {
          const parsedLog = l1MessengerInterface.parseLog(log)
          console.log(COLORS.success('Found L1MessageSent event!'))

          return {
            sender: parsedLog.args._sender,
            hash: parsedLog.args._hash,
            message: parsedLog.args._message,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
          }
        } catch (e) {
          console.warn(COLORS.warning(`Error parsing L1MessageSent log: ${e}`))
        }
      }
    }

    console.warn(
      COLORS.warning(
        `L1MessageSent event not found in transaction ${executionTxHash}`,
      ),
    )
    return null
  } catch (error) {
    console.error(COLORS.error(`Error fetching tx receipt: ${error}`))
    return null
  }
}

/**
 * Find UpgradeStarted event on L1 with given hash
 */
async function findL1UpgradeStarted(
  l1Provider: ethers.providers.JsonRpcProvider,
  upgradeHandlerContract: ethers.Contract,
  l1ProposalHash: string,
): Promise<UpgradeStartedData | null> {
  console.log(
    COLORS.info(
      `Searching for L1 UpgradeStarted event with ID: ${l1ProposalHash}...`,
    ),
  )

  try {
    const eventFilter =
      upgradeHandlerContract.filters.UpgradeStarted(l1ProposalHash)
    const latestL1Block = await l1Provider.getBlockNumber()
    const fromBlockL1 = Math.max(
      0,
      latestL1Block - CONFIG.SEARCH.L1_EVENT_BLOCK_RANGE,
    )

    console.log(
      COLORS.trace(`Querying L1 blocks ${fromBlockL1} to ${latestL1Block}...`),
    )

    const logs = await upgradeHandlerContract.queryFilter(
      eventFilter,
      fromBlockL1,
      latestL1Block,
    )

    if (logs.length === 0) {
      console.warn(
        COLORS.warning(
          `UpgradeStarted event not found on L1 for ID ${l1ProposalHash} in the last ${CONFIG.SEARCH.L1_EVENT_BLOCK_RANGE} blocks.`,
        ),
      )
      return null
    }

    if (logs.length > 1) {
      console.warn(
        COLORS.warning(
          `Found multiple (${logs.length}) UpgradeStarted events. Using first one.`,
        ),
      )
    }

    const log = logs[0]
    const parsedLog = upgradeHandlerContract.interface.parseLog(log)

    console.log(COLORS.success('Found UpgradeStarted event on L1!'))

    const proposalData = parsedLog.args._proposal
    const mappedProposal: UpgradeProposal = {
      calls: proposalData.calls.map((call: any) => ({
        target: call.target,
        value: call.value,
        data: call.data,
      })),
      executor: proposalData.executor,
      salt: proposalData.salt,
    }

    return {
      id: parsedLog.args._id,
      proposal: mappedProposal,
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    }
  } catch (error) {
    console.error(
      COLORS.error(`Error searching for L1 UpgradeStarted event: ${error}`),
    )
    return null
  }
}

/**
 * Decode L1 proposal from L2 calldata
 */
function decodeL1ProposalFromL2Calldata(
  l2Calldata: string,
): UpgradeProposal | null {
  if (
    !l2Calldata ||
    !l2Calldata.startsWith(CONFIG.L2_MESSENGER_SEND_SELECTOR)
  ) {
    console.warn(
      COLORS.warning(
        `L2 Calldata does not start with L1Messenger selector (${CONFIG.L2_MESSENGER_SEND_SELECTOR})`,
      ),
    )
    return null
  }

  try {
    const encodedArgs =
      '0x' + l2Calldata.substring(CONFIG.L2_MESSENGER_SEND_SELECTOR.length)
    const decodedOuter = ethers.utils.defaultAbiCoder.decode(
      ['bytes'],
      encodedArgs,
    )
    const messageBytes = decodedOuter[0]
    const decodedInner = ethers.utils.defaultAbiCoder.decode(
      [UPGRADE_PROPOSAL_TYPE],
      messageBytes,
    )
    const proposalData = decodedInner[0]

    const mappedProposal: UpgradeProposal = {
      calls: proposalData.calls.map((call: any) => ({
        target: call.target,
        value: call.value,
        data: call.data,
      })),
      executor: proposalData.executor,
      salt: proposalData.salt,
    }

    return mappedProposal
  } catch (e) {
    console.error(
      COLORS.error(`Error decoding L1 proposal from L2 calldata: ${e}`),
    )
    console.error(COLORS.error(`L2 Calldata was: ${l2Calldata}`))
    return null
  }
}

/**
 * Compare L1 payloads from different sources for consistency
 */
function comparePayloads(
  l1PayloadFromL2: UpgradeProposal | null,
  l1PayloadFromEvent: UpgradeProposal | null,
): boolean {
  if (!l1PayloadFromL2 || !l1PayloadFromEvent) {
    console.error(
      COLORS.error('Cannot compare payloads, one or both are missing.'),
    )
    return false
  }

  let mismatchFound = false

  // Compare executor
  if (
    l1PayloadFromL2.executor.toLowerCase() !==
    l1PayloadFromEvent.executor.toLowerCase()
  ) {
    console.error(
      COLORS.error(
        `Mismatch: Executor L2(${l1PayloadFromL2.executor}) != L1(${l1PayloadFromEvent.executor})`,
      ),
    )
    mismatchFound = true
  }

  // Compare salt
  if (l1PayloadFromL2.salt !== l1PayloadFromEvent.salt) {
    console.error(
      COLORS.error(
        `Mismatch: Salt L2(${l1PayloadFromL2.salt}) != L1(${l1PayloadFromEvent.salt})`,
      ),
    )
    mismatchFound = true
  }

  // Compare calls length
  if (l1PayloadFromL2.calls.length !== l1PayloadFromEvent.calls.length) {
    console.error(
      COLORS.error(
        `Mismatch: Call count L2(${l1PayloadFromL2.calls.length}) != L1(${l1PayloadFromEvent.calls.length})`,
      ),
    )
    return false
  }

  // Compare each call
  for (let i = 0; i < l1PayloadFromL2.calls.length; i++) {
    const callL2 = l1PayloadFromL2.calls[i]
    const callL1 = l1PayloadFromEvent.calls[i]

    if (callL2.target.toLowerCase() !== callL1.target.toLowerCase()) {
      console.error(
        COLORS.error(
          `Mismatch (Call ${i}): Target L2(${callL2.target}) != L1(${callL1.target})`,
        ),
      )
      mismatchFound = true
    }

    if (!ethers.BigNumber.from(callL2.value).eq(callL1.value)) {
      console.error(
        COLORS.error(
          `Mismatch (Call ${i}): Value L2(${callL2.value.toString()}) != L1(${callL1.value.toString()})`,
        ),
      )
      mismatchFound = true
    }

    if (callL2.data.toLowerCase() !== callL1.data.toLowerCase()) {
      console.error(
        COLORS.error(
          `Mismatch (Call ${i}): Data L2(${callL2.data}) != L1(${callL1.data})`,
        ),
      )
      mismatchFound = true
    }
  }

  return !mismatchFound
}

/**
 * Find ProposalExtended event for a specific proposal
 */
async function findProposalExtendedEvent(
  governorContract: ethers.Contract,
  proposalId: ethers.BigNumber,
  startBlock: number,
  cache: EventCache,
  l2Provider: ethers.providers.JsonRpcProvider,
): Promise<ProposalExtendedData | null> {
  // Check cache first
  const cachedEvent = cache.proposalExtendedEvents.find((e) =>
    e.proposalId.eq(proposalId),
  )

  if (cachedEvent) {
    console.log(
      COLORS.trace(
        `Found cached ProposalExtended event for ID ${proposalId.toString()}`,
      ),
    )
    return cachedEvent
  }

  console.log(
    COLORS.info(
      `Searching for ProposalExtended event for ID ${proposalId.toString()} from block ${startBlock}...`,
    ),
  )

  try {
    const eventFilter = governorContract.filters.ProposalExtended(proposalId)
    const latestBlock = await l2Provider.getBlockNumber()

    // Query from startBlock (proposal creation) up to latest known block
    const logs = await governorContract.queryFilter(
      eventFilter,
      startBlock,
      latestBlock,
    )

    if (logs.length === 0) {
      console.log(
        COLORS.trace(
          `No ProposalExtended event found for ID ${proposalId.toString()}.`,
        ),
      )
      return null
    }

    if (logs.length > 1) {
      console.warn(
        COLORS.warning(
          `Found multiple (${logs.length}) ProposalExtended events for ID ${proposalId.toString()}. Using the first one.`,
        ),
      )
    }

    const log = logs[0]
    const parsedLog = governorContract.interface.parseLog(log)

    const extendedData: ProposalExtendedData = {
      proposalId: parsedLog.args.proposalId,
      extendedDeadline: parsedLog.args.extendedDeadline,
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    }

    console.log(
      COLORS.success(
        `Found ProposalExtended event at block ${log.blockNumber}. New deadline: ${formatTimestamp(extendedData.extendedDeadline)}`,
      ),
    )

    // Add to cache if not already there
    if (
      !cache.proposalExtendedEvents.some(
        (e) => e.txHash === extendedData.txHash,
      )
    ) {
      cache.proposalExtendedEvents.push(extendedData)
    }

    return extendedData
  } catch (error) {
    console.error(
      COLORS.error(`Error searching for ProposalExtended event: ${error}`),
    )
    return null
  }
}

// -----------------------------------------------------------------------------
// VISUALIZATION HELPERS
// -----------------------------------------------------------------------------

/**
 * Display a text-based timeline of the proposal states with timing info
 */
function displayTimeline(
  l2StateName: string,
  l1StateName: string | null,
  proposalCreated: ProposalCreatedData | null,
  proposalExtended: ProposalExtendedData | null,
  l1StatusData: UpgradeStatusData | null,
  currentL1Timestamp: number,
): void {
  console.log(COLORS.subheading('\n--- Proposal Timeline ---'))

  // --- L2 Timeline ---
  const l2States = ['Pending', 'Active', 'Succeeded', 'Queued', 'Executed']
  const l2OffPathStates = ['Canceled', 'Defeated', 'Expired']
  const currentL2Index = l2States.indexOf(l2StateName)
  const l2IsOffPath = l2OffPathStates.includes(l2StateName)

  // Determine effective L2 deadline
  const effectiveVoteEndTs = proposalExtended
    ? proposalExtended.extendedDeadline
    : proposalCreated?.voteEnd

  let l2Timeline = COLORS.subheading('L2: ')

  l2States.forEach((state, index) => {
    let timingInfo = ''

    // Calculate time remaining for Active state based on effective end timestamp
    if (
      state === 'Active' &&
      l2StateName === 'Active' &&
      effectiveVoteEndTs &&
      currentL1Timestamp > 0
    ) {
      const secondsRemaining =
        effectiveVoteEndTs.toNumber() - currentL1Timestamp
      timingInfo = COLORS.timestamp(
        ` (${formatDuration(secondsRemaining)} left)`,
      )

      if (secondsRemaining <= 0) {
        timingInfo = COLORS.timestamp(` (Ended)`)
      }
    }

    let coloredState = state

    if (l2IsOffPath) {
      coloredState = COLORS.completed(state)
    } else if (index < currentL2Index) {
      coloredState = COLORS.completed(state)
    } else if (index === currentL2Index) {
      coloredState = COLORS.active(state)
    } else {
      coloredState = COLORS.inactive(state)
    }

    l2Timeline +=
      coloredState +
      timingInfo +
      (index < l2States.length - 1 ? COLORS.divider(' -> ') : '')
  })

  if (l2IsOffPath) {
    l2Timeline += COLORS.error.bold(` -> ${l2StateName}`)
  }

  if (proposalExtended) {
    l2Timeline += COLORS.extended(` [Extended]`)
  }

  console.log(l2Timeline)

  // --- Connector ---
  if (l2StateName === 'Executed' && l1StateName) {
    console.log(COLORS.info('    | L2 -> L1 Message Sent & Proven'))
  } else if (l2IsOffPath || l2StateName === 'Expired') {
    console.log(COLORS.error('    | Proposal Ended on L2'))
  } else if (l2StateName === 'Queued' || l2StateName === 'Succeeded') {
    console.log(COLORS.connector('    | ... (Awaiting L2 Execution)'))
  } else {
    console.log(COLORS.connector('    | ...'))
  }

  // --- L1 Timeline ---
  if (l1StateName && !l2IsOffPath) {
    const l1States = [
      'None',
      'LegalVetoPeriod',
      'Waiting',
      'ExecutionPending',
      'Ready',
      'Done',
    ]
    const l1OffPathStates = ['Expired']
    let currentL1Index = l1States.indexOf(l1StateName)
    const l1IsOffPath = l1OffPathStates.includes(l1StateName)

    if (l1StateName === 'None') currentL1Index = 0

    let l1Timeline = COLORS.subheading('L1: ')
    let nextArrow = true

    let legalVetoEndTime = 0
    let waitOrExpiryEndTime = 0
    let readyTimestamp = 0

    if (l1StatusData && l1StatusData.creationTimestamp > 0) {
      const vetoDuration = l1StatusData.guardiansExtendedLegalVeto
        ? CONFIG.TIMEFRAMES.L1_EXTENDED_LEGAL_VETO_SECONDS
        : CONFIG.TIMEFRAMES.L1_STANDARD_LEGAL_VETO_SECONDS

      legalVetoEndTime = l1StatusData.creationTimestamp + vetoDuration
      waitOrExpiryEndTime =
        legalVetoEndTime + CONFIG.TIMEFRAMES.L1_WAIT_OR_EXPIRE_SECONDS

      if (l1StatusData.securityCouncilApprovalTimestamp > 0) {
        readyTimestamp =
          l1StatusData.securityCouncilApprovalTimestamp +
          CONFIG.TIMEFRAMES.L1_UPGRADE_DELAY_SECONDS
      } else if (l1StatusData.guardiansApproval) {
        readyTimestamp =
          waitOrExpiryEndTime + CONFIG.TIMEFRAMES.L1_UPGRADE_DELAY_SECONDS
      }
    }

    l1States.forEach((state, index) => {
      if (state === 'None' && currentL1Index !== 0) return

      let timingInfo = ''
      let secondsRemaining = -1

      if (l1StatusData && currentL1Timestamp > 0) {
        if (
          state === 'LegalVetoPeriod' &&
          l1StateName === state &&
          legalVetoEndTime > 0
        ) {
          secondsRemaining = legalVetoEndTime - currentL1Timestamp
          timingInfo = COLORS.timestamp(
            ` (${formatDuration(secondsRemaining)} left)`,
          )
        } else if (
          state === 'Waiting' &&
          l1StateName === state &&
          waitOrExpiryEndTime > 0
        ) {
          secondsRemaining = waitOrExpiryEndTime - currentL1Timestamp
          timingInfo = COLORS.timestamp(
            ` (~${formatDuration(secondsRemaining)} left until expiry/delay)`,
          )
        } else if (
          state === 'ExecutionPending' &&
          l1StateName === state &&
          readyTimestamp > 0
        ) {
          secondsRemaining = readyTimestamp - currentL1Timestamp
          timingInfo = COLORS.timestamp(
            ` (~${formatDuration(secondsRemaining)} left until ready)`,
          )
        } else if (state === 'Ready' && l1StateName === state) {
          timingInfo = COLORS.timestamp(` (Ready to Execute)`)
        } else if (state === 'Done' && l1StateName === state) {
          timingInfo = COLORS.timestamp(` (Executed)`)
        } else if (state === 'Expired' && l1StateName === state) {
          timingInfo = COLORS.error(` (Expired)`)
        }
      }

      let coloredState = state

      if (l1IsOffPath) {
        coloredState = COLORS.completed(state)
      } else if (state === 'None' && currentL1Index === 0) {
        coloredState = COLORS.active(state)
      } else if (currentL1Index === -1 || index < currentL1Index) {
        coloredState = COLORS.completed(state)
      } else if (index === currentL1Index) {
        coloredState = COLORS.active(state)
      } else {
        coloredState = COLORS.inactive(state)
      }

      const isLastVisible =
        index === l1States.length - 1 || (l1IsOffPath && state === 'Ready')

      nextArrow = !isLastVisible
      l1Timeline +=
        coloredState + timingInfo + (nextArrow ? COLORS.divider(' -> ') : '')
    })

    if (l1IsOffPath) {
      l1Timeline += COLORS.error.bold(` -> ${l1StateName}`)
    }

    if (l1StatusData?.guardiansExtendedLegalVeto) {
      l1Timeline += COLORS.extended(` [Veto Extended]`)
    }

    console.log(l1Timeline)
  } else if (!l2IsOffPath) {
    console.log(
      COLORS.subheading('L1: ') +
        COLORS.inactive('None (Awaiting L2->L1 Message Proof)'),
    )
  }
}

/**
 * Display detailed information about proposal votes
 */
function displayVotesInfo(
  votes: ProposalVotes,
  quorumValue: ethers.BigNumber | null,
): void {
  console.log(COLORS.subheading('L2 Votes:'))

  const totalVotes = votes.forVotes
    .add(votes.againstVotes)
    .add(votes.abstainVotes)
  const forPercent = calculatePercentage(votes.forVotes, totalVotes)
  const againstPercent = calculatePercentage(votes.againstVotes, totalVotes)
  const abstainPercent = calculatePercentage(votes.abstainVotes, totalVotes)

  console.log(
    `  For:     ${COLORS.success(formatUnits(votes.forVotes, CONFIG.VOTE_TOKEN_DECIMALS))} (${forPercent}%)`,
  )
  console.log(
    `  Against: ${COLORS.error(formatUnits(votes.againstVotes, CONFIG.VOTE_TOKEN_DECIMALS))} (${againstPercent}%)`,
  )
  console.log(
    `  Abstain: ${COLORS.completed(formatUnits(votes.abstainVotes, CONFIG.VOTE_TOKEN_DECIMALS))} (${abstainPercent}%)`,
  )
  console.log(`  ${COLORS.divider('--------------------')}`)
  console.log(
    `  Total Voted: ${COLORS.info(formatUnits(totalVotes, CONFIG.VOTE_TOKEN_DECIMALS))}`,
  )

  if (quorumValue) {
    const quorumPercentReached = calculatePercentage(
      votes.forVotes,
      quorumValue,
    )
    console.log(
      `  Quorum:      ${COLORS.detail(formatUnits(quorumValue, CONFIG.VOTE_TOKEN_DECIMALS))} (Required at Vote Start)`,
    )
    console.log(
      `  Quorum Reached: ${COLORS.detail(quorumPercentReached)}% (by For votes)`,
    )
  } else {
    console.log(`  Quorum: ${COLORS.warning('Could not fetch quorum')}`)
  }
}

/**
 * Display L1 payload details
 */
function displayPayload(
  title: string,
  payload: UpgradeProposal,
  reason: string | null = null,
): void {
  console.log(COLORS.subheading(title))

  if (reason) {
    console.log(reason)
  }

  console.log(`  Executor: ${COLORS.address(payload.executor)}`)
  console.log(`  Salt: ${COLORS.hash(payload.salt)}`)

  ;(payload.calls ?? []).forEach((call, i) => {
    console.log(COLORS.trace(`  Call ${i}:`))
    console.log(`    Target: ${COLORS.detail(call.target)}`)
    console.log(`    Value: ${COLORS.info(formatValue(call.value))} ETH`)
    console.log(`    Data: ${COLORS.hash(call.data)}`)
  })
}

// -----------------------------------------------------------------------------
// MAIN EXECUTION
// -----------------------------------------------------------------------------

async function main(): Promise<void> {
  // --- Argument Parsing ---
  const args = process.argv.slice(2)

  if (args.length !== 1) {
    console.error(
      COLORS.error('Usage: ts-node governance-decoder.ts <l2_proposal_id>'),
    )
    process.exit(1)
  }

  const l2ProposalIdInput = args[0]
  let l2ProposalId: ethers.BigNumber

  try {
    l2ProposalId = ethers.BigNumber.from(l2ProposalIdInput)
  } catch (e) {
    console.error(
      COLORS.error(`Invalid L2 Proposal ID format: ${l2ProposalIdInput}`),
    )
    process.exit(1)
  }

  console.log(COLORS.heading(`--- ZKsync Era Governance Decoder ---`))
  console.log(
    COLORS.info(`Analyzing L2 Proposal ID: ${l2ProposalId.toString()}`),
  )

  // --- Provider & Contract Setup ---
  if (!CONFIG.RPC.ZKSYNC2 || !CONFIG.RPC.ETHEREUM) {
    console.error(
      COLORS.error(
        'Error: ZKSYNC2_RPC_URL and ETHEREUM_RPC_URL must be set in the .env file.',
      ),
    )
    process.exit(1)
  }

  const l2Provider = new ethers.providers.JsonRpcProvider(CONFIG.RPC.ZKSYNC2)
  const l1Provider = new ethers.providers.JsonRpcProvider(CONFIG.RPC.ETHEREUM)

  const zkGovernor = new ethers.Contract(
    CONFIG.ADDRESSES.ZK_PROTOCOL_GOVERNOR,
    ZK_PROTOCOL_GOVERNOR_ABI,
    l2Provider,
  )

  const protocolUpgradeHandler = new ethers.Contract(
    CONFIG.ADDRESSES.PROTOCOL_UPGRADE_HANDLER,
    PROTOCOL_UPGRADE_HANDLER_ABI,
    l1Provider,
  )

  // Test connections
  try {
    await l2Provider.getNetwork()
  } catch (e) {
    console.error(COLORS.error(`Failed L2 RPC connection: ${e}`))
    process.exit(1)
  }

  try {
    await l1Provider.getNetwork()
  } catch (e) {
    console.error(COLORS.error(`Failed L1 RPC connection: ${e}`))
    process.exit(1)
  }

  // --- Fetch Current Time ---
  let currentL1Timestamp = 0

  try {
    currentL1Timestamp = (await l1Provider.getBlock('latest')).timestamp
  } catch (e) {
    console.warn(COLORS.warning('Could not fetch current L1 timestamp.'))
  }

  // --- Load Cache ---
  const cache = loadCache()

  // --- 1. Fetch L2 ProposalCreated Data ---
  console.log(COLORS.subheading('\n--- Step 1: L2 Proposal Creation ---'))

  await fetchL2Events(
    zkGovernor,
    'ProposalCreated',
    'proposalCreatedEvents',
    cache,
    l2Provider,
    (log) => {
      const args = zkGovernor.interface.parseLog(log).args
      return {
        proposalId: args.proposalId,
        proposer: args.proposer,
        targets: args.targets,
        values: args.values,
        signatures: args.signatures,
        calldatas: args.calldatas,
        voteStart: args.voteStart,
        voteEnd: args.voteEnd,
        description: args.description,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
      }
    },
  )

  cache.proposalCreatedEvents.sort((a, b) => a.blockNumber - b.blockNumber)

  const proposalCreated = cache.proposalCreatedEvents.find((p) =>
    p.proposalId.eq(l2ProposalId),
  )

  if (!proposalCreated) {
    console.error(
      COLORS.error(
        `ProposalCreated event not found for ID ${l2ProposalId.toString()}.`,
      ),
    )
    saveCache(cache)
    process.exit(1)
  }

  console.log(
    COLORS.success(
      `Found ProposalCreated event in L2 block ${proposalCreated.blockNumber} (Tx: ${proposalCreated.txHash})`,
    ),
  )
  console.log(COLORS.subheading('L2 Proposal Details:'))
  console.log(`  Proposer: ${COLORS.address(proposalCreated.proposer)}`)
  console.log(
    `  Vote Start Time: ${COLORS.timestamp(formatTimestamp(proposalCreated.voteStart))}`,
  )

  // --- Check for Vote Extension ---
  const proposalExtended = await findProposalExtendedEvent(
    zkGovernor,
    l2ProposalId,
    proposalCreated.blockNumber,
    cache,
    l2Provider,
  )

  const effectiveVoteEndTs = proposalExtended
    ? proposalExtended.extendedDeadline
    : proposalCreated.voteEnd

  console.log(
    `  Vote End Time:   ${COLORS.timestamp(formatTimestamp(effectiveVoteEndTs))}${
      proposalExtended ? COLORS.extended(' (Extended)') : ''
    }`,
  )

  console.log(
    `  Description:\n${COLORS.trace.italic(
      proposalCreated.description
        .split('\n')
        .map((l) => `    ${l}`)
        .join('\n'),
    )}`,
  )

  // --- Fetch L2 State, Votes, and Quorum ---
  let l2State = -1
  let l2StateName = 'Unknown'
  let votes: ProposalVotes = {
    againstVotes: ethers.BigNumber.from(0),
    forVotes: ethers.BigNumber.from(0),
    abstainVotes: ethers.BigNumber.from(0),
  }
  let quorumValue: ethers.BigNumber | null = null

  try {
    l2State = await zkGovernor.state(l2ProposalId)
    l2StateName = mapL2State(l2State)
    console.log(`  L2 State: ${COLORS.value(l2StateName)}`)

    votes = await zkGovernor.proposalVotes(l2ProposalId)

    // Quorum is based on voteStart *timestamp* (which acts as timepoint)
    quorumValue = await zkGovernor.quorum(proposalCreated.voteStart)
  } catch (e) {
    console.warn(
      COLORS.warning(`Could not fetch L2 state, votes, or quorum: ${e}`),
    )
  }

  // Display Votes and Quorum
  displayVotesInfo(votes, quorumValue)

  // --- 2. Find L2 Execution and Extract L1 Message ---
  console.log(COLORS.subheading('\n--- Step 2: L2 Execution & L1 Message ---'))

  const latestL2Block = await l2Provider.getBlockNumber()

  await fetchL2Events(
    zkGovernor,
    'ProposalExecuted',
    'proposalExecutedEvents',
    cache,
    l2Provider,
    (log) => {
      const args = zkGovernor.interface.parseLog(log).args
      return {
        proposalId: args.proposalId,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
      }
    },
    { fromBlock: proposalCreated.blockNumber, toBlock: latestL2Block },
  )

  cache.proposalExecutedEvents.sort((a, b) => a.blockNumber - b.blockNumber)

  const proposalExecuted = cache.proposalExecutedEvents.find((p) =>
    p.proposalId.eq(l2ProposalId),
  )

  let l1MessageSent: L1MessageSentData | null = null
  let l1ProposalHash: string | null = null

  if (proposalExecuted) {
    console.log(
      COLORS.success(
        `Found ProposalExecuted event in L2 block ${proposalExecuted.blockNumber} (Tx: ${proposalExecuted.txHash})`,
      ),
    )

    l1MessageSent = await findL1MessageSentInTx(
      l2Provider,
      proposalExecuted.txHash,
    )

    if (l1MessageSent) {
      l1ProposalHash = l1MessageSent.hash
      console.log(
        COLORS.subheading(
          `L1 Proposal Identifier (Hash): ${COLORS.hash(l1ProposalHash)}`,
        ),
      )
    } else {
      console.error(
        COLORS.error(
          `Failed L1MessageSent lookup for tx ${proposalExecuted.txHash}.`,
        ),
      )
    }
  } else {
    console.warn(
      COLORS.warning(
        `ProposalExecuted event not found for ID ${l2ProposalId.toString()}.`,
      ),
    )
  }

  // --- 3. Decode L1 Payload from L2 Data ---
  let l1PayloadFromL2: UpgradeProposal | null = null

  const messengerCallIndex = (proposalCreated.targets ?? []).findIndex(
    (t) => t.toLowerCase() === CONFIG.ADDRESSES.L1_MESSENGER.toLowerCase(),
  )

  if (messengerCallIndex !== -1) {
    const messengerCalldata = proposalCreated.calldatas?.[messengerCallIndex]

    if (messengerCalldata) {
      l1PayloadFromL2 = decodeL1ProposalFromL2Calldata(messengerCalldata)
    }
  }

  // --- 4. Fetch L1 Upgrade Data ---
  let upgradeStarted: UpgradeStartedData | null = null
  let l1State = -1
  let l1StateName: string | null = null
  let l1StatusData: UpgradeStatusData | null = null

  if (l1ProposalHash) {
    console.log(COLORS.subheading('\n--- Step 4: L1 Proposal Status ---'))

    upgradeStarted = await findL1UpgradeStarted(
      l1Provider,
      protocolUpgradeHandler,
      l1ProposalHash,
    )

    try {
      l1State = await protocolUpgradeHandler.upgradeState(l1ProposalHash)
      l1StateName = mapL1State(l1State)
      l1StatusData = await protocolUpgradeHandler.upgradeStatus(l1ProposalHash)
    } catch (e) {
      console.warn(
        COLORS.warning(
          `Could not query L1 state/status for ${l1ProposalHash}: ${e}`,
        ),
      )
    }

    if (upgradeStarted) {
      console.log(
        COLORS.success(
          `Found UpgradeStarted event in L1 block ${upgradeStarted.blockNumber} (Tx: ${upgradeStarted.txHash})`,
        ),
      )
    } else {
      console.warn(
        COLORS.warning(
          `L1 UpgradeStarted event not found for ID ${l1ProposalHash}.`,
        ),
      )
    }

    console.log(`  L1 State: ${COLORS.value(l1StateName ?? 'Unknown')}`)

    if (l1StatusData) {
      console.log(`  L1 Status:`)
      console.log(
        `    Created: ${COLORS.timestamp(formatTimestamp(l1StatusData.creationTimestamp))}`,
      )
      console.log(
        `    SC Approved: ${COLORS.timestamp(formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`,
      )
      console.log(
        `    Guardians Approved: ${COLORS.value(l1StatusData.guardiansApproval.toString())}`,
      )
      console.log(
        `    Guardians Extended Veto: ${COLORS.value(l1StatusData.guardiansExtendedLegalVeto.toString())}`,
      )
      console.log(
        `    Executed: ${COLORS.value(l1StatusData.executed.toString())}`,
      )
    }
  } else {
    console.log(COLORS.subheading('\n--- Step 4: L1 Proposal Status ---'))
    console.log(COLORS.trace('L1 Proposal Hash not found.'))
  }

  // --- Display Timeline ---
  displayTimeline(
    l2StateName,
    l1StateName,
    proposalCreated,
    proposalExtended,
    l1StatusData,
    currentL1Timestamp,
  )

  // --- 5. Display Payloads & Compare ---
  console.log(COLORS.subheading('\n--- Step 5: L1 Payload Verification ---'))

  let payloadsMatch = false

  if (l1PayloadFromL2 && upgradeStarted) {
    payloadsMatch = comparePayloads(l1PayloadFromL2, upgradeStarted.proposal)
  }

  // Display L1 Event Payload first (if available)
  if (upgradeStarted) {
    displayPayload(
      'L1 Payload (from UpgradeStarted Event):',
      upgradeStarted.proposal,
    )
  }

  // Display Decoded L2 Payload ONLY if it exists AND L1 event doesn't exist OR payloads mismatch
  if (l1PayloadFromL2 && (!upgradeStarted || !payloadsMatch)) {
    let reason = null

    if (!upgradeStarted) {
      reason = COLORS.warning(
        '(Displaying because L1 UpgradeStarted event was not found)',
      )
    } else if (!payloadsMatch) {
      reason = COLORS.error(
        '(Displaying because it differs from L1 UpgradeStarted event payload)',
      )
    }

    displayPayload(
      '\nL1 Payload (Decoded from L2 Messenger Call - Verification):',
      l1PayloadFromL2,
      reason,
    )
  }

  // Final comparison result message
  if (l1PayloadFromL2 && upgradeStarted) {
    if (payloadsMatch) {
      console.log(
        COLORS.success(
          '\nPayload Sanity Check Passed: L1 event payload matches decoded L2 messenger payload.',
        ),
      )
    } else {
      console.error(
        COLORS.error('\nPayload Sanity Check Failed: Differences found!'),
      )
    }
  } else if (l1ProposalHash) {
    console.warn(
      COLORS.warning(
        '\nCould not perform payload comparison: L1 event data or decoded L2 payload is missing.',
      ),
    )
  }

  console.log(COLORS.heading('\n--- Analysis Complete ---'))

  // --- Save Cache ---
  saveCache(cache)
}

// --- Run ---
main().catch((error) => {
  console.error(COLORS.error('\n--- Script Error ---'))
  console.error(error)
  process.exit(1)
})

export async function decodeZkGovProposal(
  proposalId: string,
  {
    l2RpcUrl = process.env.ZKSYNC2_RPC_URL ?? '',
    l1RpcUrl = process.env.ETHEREUM_RPC_URL ?? '',
  }: { l2RpcUrl?: string; l1RpcUrl?: string } = {},
): Promise<void> {
  // allow the caller to override the RPC URLs
  if (l2RpcUrl) process.env.ZKSYNC2_RPC_URL = l2RpcUrl
  if (l1RpcUrl) process.env.ETHEREUM_RPC_URL = l1RpcUrl

  // ‹main› is the original async entry‑point from your script
  await main(proposalId) // ← just pass the ID
}
