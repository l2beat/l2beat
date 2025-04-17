import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { ethers } from 'ethers'

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

interface ParsedEventData {
  txHash: string
}

interface ContractCall {
  target: string
  value: ethers.BigNumberish
  data: string
}

type EventFilterArg =
  | string
  | number
  | boolean
  | ethers.BigNumberish
  | null
  | undefined
type ContractFilters = {
  [eventName: string]: (...args: EventFilterArg[]) => ethers.EventFilter
}

export class ZkGovProposalAnalyzer {
  private CONFIG = {
    RPC: {
      ZKSYNC2: '',
      ETHEREUM: '',
    },
    ADDRESSES: {
      // ZKsync Era (L2)
      ZK_PROTOCOL_GOVERNOR: '0x76705327e682F2d96943280D99464Ab61219e34f',
      L1_MESSENGER: '0x0000000000000000000000000000000000008008', // System Contract
      // Ethereum (L1)
      PROTOCOL_UPGRADE_HANDLER: '0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3',
    },
    CACHE: {
      FILE_PATH: '',
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

  private COLORS = {
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

  private ZK_PROTOCOL_GOVERNOR_ABI = [
    'event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)',
    'event ProposalExecuted(uint256 proposalId)',
    'event ProposalExtended(uint256 indexed proposalId, uint64 extendedDeadline)',
    'function proposalVotes(uint256 proposalId) view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)',
    'function state(uint256 proposalId) view returns (uint8)',
    'function quorum(uint256 blockNumber) view returns (uint256)',
  ]

  private L1_MESSENGER_ABI = [
    'event L1MessageSent(address indexed _sender, bytes32 indexed _hash, bytes _message)',
  ]

  private PROTOCOL_UPGRADE_HANDLER_ABI = [
    'event UpgradeStarted(bytes32 indexed _id, tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt) _proposal)',
    'function upgradeState(bytes32 _id) view returns (uint8)',
    'function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)',
  ]

  private UPGRADE_PROPOSAL_TYPE =
    'tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt)'

  private l2Provider: ethers.providers.JsonRpcProvider
  private l1Provider: ethers.providers.JsonRpcProvider
  private cache: EventCache

  constructor(zksyncRpcUrl: string, ethereumRpcUrl: string, cacheDir?: string) {
    this.CONFIG.RPC.ZKSYNC2 = zksyncRpcUrl
    this.CONFIG.RPC.ETHEREUM = ethereumRpcUrl
    this.CONFIG.CACHE.FILE_PATH = path.join(
      cacheDir || __dirname,
      'governance_event_cache.json',
    )

    this.l2Provider = new ethers.providers.JsonRpcProvider(
      this.CONFIG.RPC.ZKSYNC2,
    )
    this.l1Provider = new ethers.providers.JsonRpcProvider(
      this.CONFIG.RPC.ETHEREUM,
    )
    this.cache = this.loadCache()
  }

  /**
   * Load event cache from disk or initialize a new one
   */
  private loadCache(): EventCache {
    if (fs.existsSync(this.CONFIG.CACHE.FILE_PATH)) {
      try {
        const data = fs.readFileSync(this.CONFIG.CACHE.FILE_PATH, 'utf-8')
        const cache: EventCache = JSON.parse(data, (_key, value) => {
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
          this.COLORS.trace(
            `Loaded cache from ${this.CONFIG.CACHE.FILE_PATH}. Last L2 block fetched: ${cache.lastL2BlockFetched}`,
          ),
        )

        // Initialize arrays if missing
        cache.proposalCreatedEvents = cache.proposalCreatedEvents || []
        cache.proposalExecutedEvents = cache.proposalExecutedEvents || []
        cache.proposalExtendedEvents = cache.proposalExtendedEvents || []

        return cache
      } catch (error) {
        console.warn(
          this.COLORS.warning(
            `Could not read cache file ${this.CONFIG.CACHE.FILE_PATH}: ${error}. Starting fresh.`,
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
  private saveCache(): void {
    try {
      const data = JSON.stringify(
        this.cache,
        (_key, value) => {
          if (ethers.BigNumber.isBigNumber(value)) {
            return { type: 'BigNumber', hex: value.toHexString() }
          }
          return value
        },
        2,
      )

      fs.writeFileSync(this.CONFIG.CACHE.FILE_PATH, data, 'utf-8')
      console.log(
        this.COLORS.trace(
          `Saved cache to ${this.CONFIG.CACHE.FILE_PATH}. Last L2 block fetched: ${this.cache.lastL2BlockFetched}`,
        ),
      )
    } catch (error) {
      console.error(this.COLORS.error(`Error saving cache: ${error}`))
    }
  }

  /**
   * Format UNIX timestamp as readable date string
   */
  private formatTimestamp(
    timestamp: number | ethers.BigNumber | undefined,
  ): string {
    if (!timestamp || ethers.BigNumber.from(timestamp).isZero()) return 'N/A'

    try {
      const date = new Date(ethers.BigNumber.from(timestamp).toNumber() * 1000)
      return date.toLocaleString()
    } catch (e) {
      console.warn(
        this.COLORS.warning(`Could not format timestamp ${timestamp}: ${e}`),
      )
      return 'Invalid Date'
    }
  }

  /**
   * Map L2 state code to readable string
   */
  private mapL2State(state: number): string {
    return L2State[state] ?? `Unknown (${state})`
  }

  /**
   * Map L1 state code to readable string
   */
  private mapL1State(state: number): string {
    return L1State[state] ?? `Unknown (${state})`
  }

  /**
   * Format ethereum value (in wei) to ETH
   */
  private formatValue(value: ethers.BigNumber | undefined | null): string {
    if (value === undefined || value === null) return 'N/A'

    try {
      return ethers.BigNumber.from(value).isZero()
        ? '0'
        : ethers.utils.formatUnits(value, 'ether')
    } catch (_e) {
      return `Invalid (${value?.toString() ?? 'undefined'})`
    }
  }

  /**
   * Format value with specified decimals
   */
  private formatUnits(
    value: ethers.BigNumber | undefined | null,
    decimals: number,
  ): string {
    if (value === undefined || value === null) return 'N/A'

    try {
      return ethers.utils.formatUnits(value, decimals)
    } catch (_e) {
      return `Invalid (${value?.toString() ?? 'undefined'})`
    }
  }

  /**
   * Calculate percentage with fixed precision
   */
  private calculatePercentage(
    numerator: ethers.BigNumber,
    denominator: ethers.BigNumber,
  ): string {
    if (denominator.isZero()) return '0.00'

    try {
      const numFixed = ethers.FixedNumber.fromValue(
        numerator,
        this.CONFIG.VOTE_TOKEN_DECIMALS,
      )
      const denFixed = ethers.FixedNumber.fromValue(
        denominator,
        this.CONFIG.VOTE_TOKEN_DECIMALS,
      )

      if (denFixed.isZero()) return '0.00'

      const percentage = numFixed
        .mulUnsafe(ethers.FixedNumber.from(100))
        .divUnsafe(denFixed)
      return percentage.round(2).toString()
    } catch (e) {
      console.warn(
        this.COLORS.warning(
          `Error calculating percentage (${numerator}/${denominator}): ${e}`,
        ),
      )
      return 'Error'
    }
  }

  /**
   * Format duration in seconds to human-readable format (d h m)
   */
  private formatDuration(totalSeconds: number): string {
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

  /**
   * Fetch events from L2 blockchain and update cache
   */
  private async fetchL2Events<T extends ethers.BaseContract>(
    contract: T,
    eventName: string,
    cacheKey: keyof EventCache,
    parser: (log: ethers.Event) => ParsedEventData,
    forceRange: BlockRange | null = null,
  ): Promise<number> {
    const latestBlock = forceRange
      ? forceRange.toBlock
      : await this.l2Provider.getBlockNumber()
    const fromBlock = forceRange
      ? forceRange.fromBlock
      : this.cache.lastL2BlockFetched + 1
    const toBlock = latestBlock

    if (fromBlock > toBlock) {
      console.log(
        this.COLORS.trace(
          `Block range (${fromBlock}-${toBlock}) invalid or already covered for ${eventName} events.`,
        ),
      )
      return 0
    }

    console.log(
      this.COLORS.info(
        `Fetching ${eventName} events from block ${fromBlock} to ${toBlock}...`,
      ),
    )

    let addedCount = 0

    try {
      const eventFilter = (contract.filters as ContractFilters)[eventName]()

      if (!eventFilter) {
        throw new Error(`Filter for event ${eventName} not found.`)
      }

      const logs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
      console.log(
        this.COLORS.trace(`Found ${logs.length} ${eventName} events in range.`),
      )

      const existingTxHashes = new Set(
        (this.cache[cacheKey] as ParsedEventData[]).map((e) => e.txHash),
      )

      for (const log of logs) {
        if (existingTxHashes.has(log.transactionHash)) continue

        try {
          const parsedData = parser(log)
          if (parsedData) {
            ;(this.cache[cacheKey] as ParsedEventData[]).push(
              parsedData as ParsedEventData,
            )
            existingTxHashes.add(log.transactionHash)
            addedCount++
          }
        } catch (e) {
          console.warn(
            this.COLORS.warning(
              `Could not parse ${eventName} log in tx ${log.transactionHash}: ${e}`,
            ),
          )
        }
      }

      console.log(
        this.COLORS.trace(
          `Added ${addedCount} new unique ${eventName} events to cache.`,
        ),
      )
    } catch (error) {
      console.error(
        this.COLORS.error(`Error fetching ${eventName} events: ${error}`),
      )
    }

    if (!forceRange && toBlock > this.cache.lastL2BlockFetched) {
      this.cache.lastL2BlockFetched = toBlock
    } else if (forceRange && toBlock > this.cache.lastL2BlockFetched) {
      this.cache.lastL2BlockFetched = toBlock
    }

    return addedCount
  }

  /**
   * Find L1MessageSent event in a transaction receipt
   */
  private async findL1MessageSentInTx(
    executionTxHash: string,
  ): Promise<L1MessageSentData | null> {
    console.log(
      this.COLORS.info(
        `Fetching receipt for L2 execution tx: ${executionTxHash}...`,
      ),
    )

    try {
      const receipt =
        await this.l2Provider.getTransactionReceipt(executionTxHash)

      if (!receipt) {
        console.error(
          this.COLORS.error(
            `Could not find transaction receipt for ${executionTxHash}`,
          ),
        )
        return null
      }

      const l1MessengerInterface = new ethers.utils.Interface(
        this.L1_MESSENGER_ABI,
      )
      const l1MessageSentTopic =
        l1MessengerInterface.getEventTopic('L1MessageSent')

      for (const log of receipt.logs) {
        if (
          log.address.toLowerCase() ===
            this.CONFIG.ADDRESSES.L1_MESSENGER.toLowerCase() &&
          log.topics[0] === l1MessageSentTopic
        ) {
          try {
            const parsedLog = l1MessengerInterface.parseLog(log)
            console.log(this.COLORS.success('Found L1MessageSent event!'))

            return {
              sender: parsedLog.args._sender,
              hash: parsedLog.args._hash,
              message: parsedLog.args._message,
              blockNumber: log.blockNumber,
              txHash: log.transactionHash,
            }
          } catch (e) {
            console.warn(
              this.COLORS.warning(`Error parsing L1MessageSent log: ${e}`),
            )
          }
        }
      }

      console.warn(
        this.COLORS.warning(
          `L1MessageSent event not found in transaction ${executionTxHash}`,
        ),
      )
      return null
    } catch (error) {
      console.error(this.COLORS.error(`Error fetching tx receipt: ${error}`))
      return null
    }
  }

  /**
   * Find UpgradeStarted event on L1 with given hash
   */
  private async findL1UpgradeStarted(
    upgradeHandlerContract: ethers.Contract,
    l1ProposalHash: string,
  ): Promise<UpgradeStartedData | null> {
    console.log(
      this.COLORS.info(
        `Searching for L1 UpgradeStarted event with ID: ${l1ProposalHash}...`,
      ),
    )

    try {
      const eventFilter =
        upgradeHandlerContract.filters.UpgradeStarted(l1ProposalHash)
      const latestL1Block = await this.l1Provider.getBlockNumber()
      const fromBlockL1 = Math.max(
        0,
        latestL1Block - this.CONFIG.SEARCH.L1_EVENT_BLOCK_RANGE,
      )

      console.log(
        this.COLORS.trace(
          `Querying L1 blocks ${fromBlockL1} to ${latestL1Block}...`,
        ),
      )

      const logs = await upgradeHandlerContract.queryFilter(
        eventFilter,
        fromBlockL1,
        latestL1Block,
      )

      if (logs.length === 0) {
        console.warn(
          this.COLORS.warning(
            `UpgradeStarted event not found on L1 for ID ${l1ProposalHash} in the last ${this.CONFIG.SEARCH.L1_EVENT_BLOCK_RANGE} blocks.`,
          ),
        )
        return null
      }

      if (logs.length > 1) {
        console.warn(
          this.COLORS.warning(
            `Found multiple (${logs.length}) UpgradeStarted events. Using first one.`,
          ),
        )
      }

      const log = logs[0]
      const parsedLog = upgradeHandlerContract.interface.parseLog(log)

      console.log(this.COLORS.success('Found UpgradeStarted event on L1!'))

      const proposalData = parsedLog.args._proposal
      const mappedProposal: UpgradeProposal = {
        calls: proposalData.calls.map((call: ContractCall) => ({
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
        this.COLORS.error(
          `Error searching for L1 UpgradeStarted event: ${error}`,
        ),
      )
      return null
    }
  }

  /**
   * Decode L1 proposal from L2 calldata
   */
  private decodeL1ProposalFromL2Calldata(
    l2Calldata: string,
  ): UpgradeProposal | null {
    if (
      !l2Calldata ||
      !l2Calldata.startsWith(this.CONFIG.L2_MESSENGER_SEND_SELECTOR)
    ) {
      console.warn(
        this.COLORS.warning(
          `L2 Calldata does not start with L1Messenger selector (${this.CONFIG.L2_MESSENGER_SEND_SELECTOR})`,
        ),
      )
      return null
    }

    try {
      const encodedArgs =
        '0x' +
        l2Calldata.substring(this.CONFIG.L2_MESSENGER_SEND_SELECTOR.length)
      const decodedOuter = ethers.utils.defaultAbiCoder.decode(
        ['bytes'],
        encodedArgs,
      )
      const messageBytes = decodedOuter[0]
      const decodedInner = ethers.utils.defaultAbiCoder.decode(
        [this.UPGRADE_PROPOSAL_TYPE],
        messageBytes,
      )
      const proposalData = decodedInner[0]

      const mappedProposal: UpgradeProposal = {
        calls: proposalData.calls.map((call: ContractCall) => ({
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
        this.COLORS.error(`Error decoding L1 proposal from L2 calldata: ${e}`),
      )
      console.error(this.COLORS.error(`L2 Calldata was: ${l2Calldata}`))
      return null
    }
  }

  /**
   * Compare L1 payloads from different sources for consistency
   */
  private comparePayloads(
    l1PayloadFromL2: UpgradeProposal | null,
    l1PayloadFromEvent: UpgradeProposal | null,
  ): boolean {
    if (!l1PayloadFromL2 || !l1PayloadFromEvent) {
      console.error(
        this.COLORS.error('Cannot compare payloads, one or both are missing.'),
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
        this.COLORS.error(
          `Mismatch: Executor L2(${l1PayloadFromL2.executor}) != L1(${l1PayloadFromEvent.executor})`,
        ),
      )
      mismatchFound = true
    }

    // Compare salt
    if (l1PayloadFromL2.salt !== l1PayloadFromEvent.salt) {
      console.error(
        this.COLORS.error(
          `Mismatch: Salt L2(${l1PayloadFromL2.salt}) != L1(${l1PayloadFromEvent.salt})`,
        ),
      )
      mismatchFound = true
    }

    // Compare calls length
    if (l1PayloadFromL2.calls.length !== l1PayloadFromEvent.calls.length) {
      console.error(
        this.COLORS.error(
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
          this.COLORS.error(
            `Mismatch (Call ${i}): Target L2(${callL2.target}) != L1(${callL1.target})`,
          ),
        )
        mismatchFound = true
      }

      if (!ethers.BigNumber.from(callL2.value).eq(callL1.value)) {
        console.error(
          this.COLORS.error(
            `Mismatch (Call ${i}): Value L2(${callL2.value.toString()}) != L1(${callL1.value.toString()})`,
          ),
        )
        mismatchFound = true
      }

      if (callL2.data.toLowerCase() !== callL1.data.toLowerCase()) {
        console.error(
          this.COLORS.error(
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
  private async findProposalExtendedEvent(
    governorContract: ethers.Contract,
    proposalId: ethers.BigNumber,
    startBlock: number,
  ): Promise<ProposalExtendedData | null> {
    // Check cache first
    const cachedEvent = this.cache.proposalExtendedEvents.find((e) =>
      e.proposalId.eq(proposalId),
    )

    if (cachedEvent) {
      console.log(
        this.COLORS.trace(
          `Found cached ProposalExtended event for ID ${proposalId.toString()}`,
        ),
      )
      return cachedEvent
    }

    console.log(
      this.COLORS.info(
        `Searching for ProposalExtended event for ID ${proposalId.toString()} from block ${startBlock}...`,
      ),
    )

    try {
      const eventFilter = governorContract.filters.ProposalExtended(proposalId)
      const latestBlock = await this.l2Provider.getBlockNumber()

      // Query from startBlock (proposal creation) up to latest known block
      const logs = await governorContract.queryFilter(
        eventFilter,
        startBlock,
        latestBlock,
      )

      if (logs.length === 0) {
        console.log(
          this.COLORS.trace(
            `No ProposalExtended event found for ID ${proposalId.toString()}.`,
          ),
        )
        return null
      }

      if (logs.length > 1) {
        console.warn(
          this.COLORS.warning(
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
        this.COLORS.success(
          `Found ProposalExtended event at block ${log.blockNumber}. New deadline: ${this.formatTimestamp(extendedData.extendedDeadline)}`,
        ),
      )

      // Add to cache if not already there
      if (
        !this.cache.proposalExtendedEvents.some(
          (e) => e.txHash === extendedData.txHash,
        )
      ) {
        this.cache.proposalExtendedEvents.push(extendedData)
      }

      return extendedData
    } catch (error) {
      console.error(
        this.COLORS.error(
          `Error searching for ProposalExtended event: ${error}`,
        ),
      )
      return null
    }
  }

  /**
   * Display a text-based timeline of the proposal states with timing info
   */
  private displayTimeline(
    l2StateName: string,
    l1StateName: string | null,
    proposalCreated: ProposalCreatedData | null,
    proposalExtended: ProposalExtendedData | null,
    l1StatusData: UpgradeStatusData | null,
    currentL1Timestamp: number,
  ): void {
    console.log(this.COLORS.subheading('\n--- Proposal Timeline ---'))

    // --- L2 Timeline ---
    const l2States = ['Pending', 'Active', 'Succeeded', 'Queued', 'Executed']
    const l2OffPathStates = ['Canceled', 'Defeated', 'Expired']
    const currentL2Index = l2States.indexOf(l2StateName)
    const l2IsOffPath = l2OffPathStates.includes(l2StateName)

    // Determine effective L2 deadline
    const effectiveVoteEndTs = proposalExtended
      ? proposalExtended.extendedDeadline
      : proposalCreated?.voteEnd

    let l2Timeline = this.COLORS.subheading('L2: ')

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
        timingInfo = this.COLORS.timestamp(
          ` (${this.formatDuration(secondsRemaining)} left)`,
        )

        if (secondsRemaining <= 0) {
          timingInfo = this.COLORS.timestamp(` (Ended)`)
        }
      }

      let coloredState = state

      if (l2IsOffPath) {
        coloredState = this.COLORS.completed(state)
      } else if (index < currentL2Index) {
        coloredState = this.COLORS.completed(state)
      } else if (index === currentL2Index) {
        coloredState = this.COLORS.active(state)
      } else {
        coloredState = this.COLORS.inactive(state)
      }

      l2Timeline +=
        coloredState +
        timingInfo +
        (index < l2States.length - 1 ? this.COLORS.divider(' -> ') : '')
    })

    if (l2IsOffPath) {
      l2Timeline += this.COLORS.error.bold(` -> ${l2StateName}`)
    }

    if (proposalExtended) {
      l2Timeline += this.COLORS.extended(` [Extended]`)
    }

    console.log(l2Timeline)

    // --- Connector ---
    if (l2StateName === 'Executed' && l1StateName) {
      console.log(this.COLORS.info('    | L2 -> L1 Message Sent & Proven'))
    } else if (l2IsOffPath || l2StateName === 'Expired') {
      console.log(this.COLORS.error('    | Proposal Ended on L2'))
    } else if (l2StateName === 'Queued' || l2StateName === 'Succeeded') {
      console.log(this.COLORS.connector('    | ... (Awaiting L2 Execution)'))
    } else {
      console.log(this.COLORS.connector('    | ...'))
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

      let l1Timeline = this.COLORS.subheading('L1: ')
      let nextArrow = true

      let legalVetoEndTime = 0
      let waitOrExpiryEndTime = 0
      let readyTimestamp = 0

      if (l1StatusData && l1StatusData.creationTimestamp > 0) {
        const vetoDuration = l1StatusData.guardiansExtendedLegalVeto
          ? this.CONFIG.TIMEFRAMES.L1_EXTENDED_LEGAL_VETO_SECONDS
          : this.CONFIG.TIMEFRAMES.L1_STANDARD_LEGAL_VETO_SECONDS

        legalVetoEndTime = l1StatusData.creationTimestamp + vetoDuration
        waitOrExpiryEndTime =
          legalVetoEndTime + this.CONFIG.TIMEFRAMES.L1_WAIT_OR_EXPIRE_SECONDS

        if (l1StatusData.securityCouncilApprovalTimestamp > 0) {
          readyTimestamp =
            l1StatusData.securityCouncilApprovalTimestamp +
            this.CONFIG.TIMEFRAMES.L1_UPGRADE_DELAY_SECONDS
        } else if (l1StatusData.guardiansApproval) {
          readyTimestamp =
            waitOrExpiryEndTime +
            this.CONFIG.TIMEFRAMES.L1_UPGRADE_DELAY_SECONDS
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
            timingInfo = this.COLORS.timestamp(
              ` (${this.formatDuration(secondsRemaining)} left)`,
            )
          } else if (
            state === 'Waiting' &&
            l1StateName === state &&
            waitOrExpiryEndTime > 0
          ) {
            secondsRemaining = waitOrExpiryEndTime - currentL1Timestamp
            timingInfo = this.COLORS.timestamp(
              ` (~${this.formatDuration(secondsRemaining)} left until expiry/delay)`,
            )
          } else if (
            state === 'ExecutionPending' &&
            l1StateName === state &&
            readyTimestamp > 0
          ) {
            secondsRemaining = readyTimestamp - currentL1Timestamp
            timingInfo = this.COLORS.timestamp(
              ` (~${this.formatDuration(secondsRemaining)} left until ready)`,
            )
          } else if (state === 'Ready' && l1StateName === state) {
            timingInfo = this.COLORS.timestamp(` (Ready to Execute)`)
          } else if (state === 'Done' && l1StateName === state) {
            timingInfo = this.COLORS.timestamp(` (Executed)`)
          } else if (state === 'Expired' && l1StateName === state) {
            timingInfo = this.COLORS.error(` (Expired)`)
          }
        }

        let coloredState = state

        if (l1IsOffPath) {
          coloredState = this.COLORS.completed(state)
        } else if (state === 'None' && currentL1Index === 0) {
          coloredState = this.COLORS.active(state)
        } else if (currentL1Index === -1 || index < currentL1Index) {
          coloredState = this.COLORS.completed(state)
        } else if (index === currentL1Index) {
          coloredState = this.COLORS.active(state)
        } else {
          coloredState = this.COLORS.inactive(state)
        }

        const isLastVisible =
          index === l1States.length - 1 || (l1IsOffPath && state === 'Ready')

        nextArrow = !isLastVisible
        l1Timeline +=
          coloredState +
          timingInfo +
          (nextArrow ? this.COLORS.divider(' -> ') : '')
      })

      if (l1IsOffPath) {
        l1Timeline += this.COLORS.error.bold(` -> ${l1StateName}`)
      }

      if (l1StatusData?.guardiansExtendedLegalVeto) {
        l1Timeline += this.COLORS.extended(` [Veto Extended]`)
      }

      console.log(l1Timeline)
    } else if (!l2IsOffPath) {
      console.log(
        this.COLORS.subheading('L1: ') +
          this.COLORS.inactive('None (Awaiting L2->L1 Message Proof)'),
      )
    }
  }

  /**
   * Display detailed information about proposal votes
   */
  private displayVotesInfo(
    votes: ProposalVotes,
    quorumValue: ethers.BigNumber | null,
  ): void {
    console.log(this.COLORS.subheading('L2 Votes:'))

    const totalVotes = votes.forVotes
      .add(votes.againstVotes)
      .add(votes.abstainVotes)
    const forPercent = this.calculatePercentage(votes.forVotes, totalVotes)
    const againstPercent = this.calculatePercentage(
      votes.againstVotes,
      totalVotes,
    )
    const abstainPercent = this.calculatePercentage(
      votes.abstainVotes,
      totalVotes,
    )

    console.log(
      `  For:     ${this.COLORS.success(this.formatUnits(votes.forVotes, this.CONFIG.VOTE_TOKEN_DECIMALS))} (${forPercent}%)`,
    )
    console.log(
      `  Against: ${this.COLORS.error(this.formatUnits(votes.againstVotes, this.CONFIG.VOTE_TOKEN_DECIMALS))} (${againstPercent}%)`,
    )
    console.log(
      `  Abstain: ${this.COLORS.completed(this.formatUnits(votes.abstainVotes, this.CONFIG.VOTE_TOKEN_DECIMALS))} (${abstainPercent}%)`,
    )
    console.log(`  ${this.COLORS.divider('--------------------')}`)
    console.log(
      `  Total Voted: ${this.COLORS.info(this.formatUnits(totalVotes, this.CONFIG.VOTE_TOKEN_DECIMALS))}`,
    )

    if (quorumValue) {
      const quorumPercentReached = this.calculatePercentage(
        votes.forVotes,
        quorumValue,
      )
      console.log(
        `  Quorum:      ${this.COLORS.detail(this.formatUnits(quorumValue, this.CONFIG.VOTE_TOKEN_DECIMALS))} (Required at Vote Start)`,
      )
      console.log(
        `  Quorum Reached: ${this.COLORS.detail(quorumPercentReached)}% (by For votes)`,
      )
    } else {
      console.log(`  Quorum: ${this.COLORS.warning('Could not fetch quorum')}`)
    }
  }

  /**
   * Display L1 payload details
   */
  private displayPayload(
    title: string,
    payload: UpgradeProposal,
    reason: string | null = null,
  ): void {
    console.log(this.COLORS.subheading(title))

    if (reason) {
      console.log(reason)
    }

    console.log(`  Executor: ${this.COLORS.address(payload.executor)}`)
    console.log(`  Salt: ${this.COLORS.hash(payload.salt)}`)
    ;(payload.calls ?? []).forEach((call, i) => {
      console.log(this.COLORS.trace(`  Call ${i}:`))
      console.log(`    Target: ${this.COLORS.detail(call.target)}`)
      console.log(
        `    Value: ${this.COLORS.info(this.formatValue(call.value))} ETH`,
      )
      console.log(`    Data: ${this.COLORS.hash(call.data)}`)
    })
  }

  /**
   * Analyze a governance proposal by ID
   */
  public async analyze(l2ProposalId: string): Promise<void> {
    let proposalIdBN: ethers.BigNumber

    try {
      proposalIdBN = ethers.BigNumber.from(l2ProposalId)
    } catch (_e) {
      console.error(
        this.COLORS.error(`Invalid L2 Proposal ID format: ${l2ProposalId}`),
      )
      process.exit(1)
    }

    console.log(this.COLORS.heading(`--- ZKsync Era Governance Decoder ---`))
    console.log(
      this.COLORS.info(`Analyzing L2 Proposal ID: ${proposalIdBN.toString()}`),
    )

    // Test connections
    try {
      await this.l2Provider.getNetwork()
    } catch (e) {
      console.error(this.COLORS.error(`Failed L2 RPC connection: ${e}`))
      process.exit(1)
    }

    try {
      await this.l1Provider.getNetwork()
    } catch (e) {
      console.error(this.COLORS.error(`Failed L1 RPC connection: ${e}`))
      process.exit(1)
    }

    // --- Fetch Current Time ---
    let currentL1Timestamp = 0

    try {
      currentL1Timestamp = (await this.l1Provider.getBlock('latest')).timestamp
    } catch (_e) {
      console.warn(this.COLORS.warning('Could not fetch current L1 timestamp.'))
    }

    // Contract initialization
    const zkGovernor = new ethers.Contract(
      this.CONFIG.ADDRESSES.ZK_PROTOCOL_GOVERNOR,
      this.ZK_PROTOCOL_GOVERNOR_ABI,
      this.l2Provider,
    )

    const protocolUpgradeHandler = new ethers.Contract(
      this.CONFIG.ADDRESSES.PROTOCOL_UPGRADE_HANDLER,
      this.PROTOCOL_UPGRADE_HANDLER_ABI,
      this.l1Provider,
    )

    // --- 1. Fetch L2 ProposalCreated Data ---
    console.log(
      this.COLORS.subheading('\n--- Step 1: L2 Proposal Creation ---'),
    )

    await this.fetchL2Events(
      zkGovernor,
      'ProposalCreated',
      'proposalCreatedEvents',
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

    this.cache.proposalCreatedEvents.sort(
      (a, b) => a.blockNumber - b.blockNumber,
    )

    const proposalCreated = this.cache.proposalCreatedEvents.find((p) =>
      p.proposalId.eq(proposalIdBN),
    )

    if (!proposalCreated) {
      console.error(
        this.COLORS.error(
          `ProposalCreated event not found for ID ${proposalIdBN.toString()}.`,
        ),
      )
      this.saveCache()
      process.exit(1)
    }

    console.log(
      this.COLORS.success(
        `Found ProposalCreated event in L2 block ${proposalCreated.blockNumber} (Tx: ${proposalCreated.txHash})`,
      ),
    )
    console.log(this.COLORS.subheading('L2 Proposal Details:'))
    console.log(`  Proposer: ${this.COLORS.address(proposalCreated.proposer)}`)
    console.log(
      `  Vote Start Time: ${this.COLORS.timestamp(this.formatTimestamp(proposalCreated.voteStart))}`,
    )

    // --- Check for Vote Extension ---
    const proposalExtended = await this.findProposalExtendedEvent(
      zkGovernor,
      proposalIdBN,
      proposalCreated.blockNumber,
    )

    const effectiveVoteEndTs = proposalExtended
      ? proposalExtended.extendedDeadline
      : proposalCreated.voteEnd

    console.log(
      `  Vote End Time:   ${this.COLORS.timestamp(this.formatTimestamp(effectiveVoteEndTs))}${
        proposalExtended ? this.COLORS.extended(' (Extended)') : ''
      }`,
    )

    console.log(
      `  Description:\n${this.COLORS.trace.italic(
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
      l2State = await zkGovernor.state(proposalIdBN)
      l2StateName = this.mapL2State(l2State)
      console.log(`  L2 State: ${this.COLORS.value(l2StateName)}`)

      votes = await zkGovernor.proposalVotes(proposalIdBN)

      // Quorum is based on voteStart *timestamp* (which acts as timepoint)
      quorumValue = await zkGovernor.quorum(proposalCreated.voteStart)
    } catch (e) {
      console.warn(
        this.COLORS.warning(`Could not fetch L2 state, votes, or quorum: ${e}`),
      )
    }

    // Display Votes and Quorum
    this.displayVotesInfo(votes, quorumValue)

    // --- 2. Find L2 Execution and Extract L1 Message ---
    console.log(
      this.COLORS.subheading('\n--- Step 2: L2 Execution & L1 Message ---'),
    )

    const latestL2Block = await this.l2Provider.getBlockNumber()

    await this.fetchL2Events(
      zkGovernor,
      'ProposalExecuted',
      'proposalExecutedEvents',
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

    this.cache.proposalExecutedEvents.sort(
      (a, b) => a.blockNumber - b.blockNumber,
    )

    const proposalExecuted = this.cache.proposalExecutedEvents.find((p) =>
      p.proposalId.eq(proposalIdBN),
    )

    let l1MessageSent: L1MessageSentData | null = null
    let l1ProposalHash: string | null = null

    if (proposalExecuted) {
      console.log(
        this.COLORS.success(
          `Found ProposalExecuted event in L2 block ${proposalExecuted.blockNumber} (Tx: ${proposalExecuted.txHash})`,
        ),
      )

      l1MessageSent = await this.findL1MessageSentInTx(proposalExecuted.txHash)

      if (l1MessageSent) {
        l1ProposalHash = l1MessageSent.hash
        console.log(
          this.COLORS.subheading(
            `L1 Proposal Identifier (Hash): ${this.COLORS.hash(l1ProposalHash)}`,
          ),
        )
      } else {
        console.error(
          this.COLORS.error(
            `Failed L1MessageSent lookup for tx ${proposalExecuted.txHash}.`,
          ),
        )
      }
    } else {
      console.warn(
        this.COLORS.warning(
          `ProposalExecuted event not found for ID ${proposalIdBN.toString()}.`,
        ),
      )
    }

    // --- 3. Decode L1 Payload from L2 Data ---
    let l1PayloadFromL2: UpgradeProposal | null = null

    const messengerCallIndex = (proposalCreated.targets ?? []).findIndex(
      (t) =>
        t.toLowerCase() === this.CONFIG.ADDRESSES.L1_MESSENGER.toLowerCase(),
    )

    if (messengerCallIndex !== -1) {
      const messengerCalldata = proposalCreated.calldatas?.[messengerCallIndex]

      if (messengerCalldata) {
        l1PayloadFromL2 = this.decodeL1ProposalFromL2Calldata(messengerCalldata)
      }
    }

    // --- 4. Fetch L1 Upgrade Data ---
    let upgradeStarted: UpgradeStartedData | null = null
    let l1State = -1
    let l1StateName: string | null = null
    let l1StatusData: UpgradeStatusData | null = null

    if (l1ProposalHash) {
      console.log(
        this.COLORS.subheading('\n--- Step 4: L1 Proposal Status ---'),
      )

      upgradeStarted = await this.findL1UpgradeStarted(
        protocolUpgradeHandler,
        l1ProposalHash,
      )

      try {
        l1State = await protocolUpgradeHandler.upgradeState(l1ProposalHash)
        l1StateName = this.mapL1State(l1State)
        l1StatusData =
          await protocolUpgradeHandler.upgradeStatus(l1ProposalHash)
      } catch (e) {
        console.warn(
          this.COLORS.warning(
            `Could not query L1 state/status for ${l1ProposalHash}: ${e}`,
          ),
        )
      }

      if (upgradeStarted) {
        console.log(
          this.COLORS.success(
            `Found UpgradeStarted event in L1 block ${upgradeStarted.blockNumber} (Tx: ${upgradeStarted.txHash})`,
          ),
        )
      } else {
        console.warn(
          this.COLORS.warning(
            `L1 UpgradeStarted event not found for ID ${l1ProposalHash}.`,
          ),
        )
      }

      console.log(`  L1 State: ${this.COLORS.value(l1StateName ?? 'Unknown')}`)

      if (l1StatusData) {
        console.log(`  L1 Status:`)
        console.log(
          `    Created: ${this.COLORS.timestamp(this.formatTimestamp(l1StatusData.creationTimestamp))}`,
        )
        console.log(
          `    SC Approved: ${this.COLORS.timestamp(this.formatTimestamp(l1StatusData.securityCouncilApprovalTimestamp))}`,
        )
        console.log(
          `    Guardians Approved: ${this.COLORS.value(l1StatusData.guardiansApproval.toString())}`,
        )
        console.log(
          `    Guardians Extended Veto: ${this.COLORS.value(l1StatusData.guardiansExtendedLegalVeto.toString())}`,
        )
        console.log(
          `    Executed: ${this.COLORS.value(l1StatusData.executed.toString())}`,
        )
      }
    } else {
      console.log(
        this.COLORS.subheading('\n--- Step 4: L1 Proposal Status ---'),
      )
      console.log(this.COLORS.trace('L1 Proposal Hash not found.'))
    }

    // --- Display Timeline ---
    this.displayTimeline(
      l2StateName,
      l1StateName,
      proposalCreated,
      proposalExtended,
      l1StatusData,
      currentL1Timestamp,
    )

    // --- 5. Display Payloads & Compare ---
    console.log(
      this.COLORS.subheading('\n--- Step 5: L1 Payload Verification ---'),
    )

    let payloadsMatch = false

    if (l1PayloadFromL2 && upgradeStarted) {
      payloadsMatch = this.comparePayloads(
        l1PayloadFromL2,
        upgradeStarted.proposal,
      )
    }

    // Display L1 Event Payload first (if available)
    if (upgradeStarted) {
      this.displayPayload(
        'L1 Payload (from UpgradeStarted Event):',
        upgradeStarted.proposal,
      )
    }

    // Display Decoded L2 Payload ONLY if it exists AND L1 event doesn't exist OR payloads mismatch
    if (l1PayloadFromL2 && (!upgradeStarted || !payloadsMatch)) {
      let reason = null

      if (!upgradeStarted) {
        reason = this.COLORS.warning(
          '(Displaying because L1 UpgradeStarted event was not found)',
        )
      } else if (!payloadsMatch) {
        reason = this.COLORS.error(
          '(Displaying because it differs from L1 UpgradeStarted event payload)',
        )
      }

      this.displayPayload(
        '\nL1 Payload (Decoded from L2 Messenger Call - Verification):',
        l1PayloadFromL2,
        reason,
      )
    }

    // Final comparison result message
    if (l1PayloadFromL2 && upgradeStarted) {
      if (payloadsMatch) {
        console.log(
          this.COLORS.success(
            '\nPayload Sanity Check Passed: L1 event payload matches decoded L2 messenger payload.',
          ),
        )
      } else {
        console.error(
          this.COLORS.error(
            '\nPayload Sanity Check Failed: Differences found!',
          ),
        )
      }
    } else if (l1ProposalHash) {
      console.warn(
        this.COLORS.warning(
          '\nCould not perform payload comparison: L1 event data or decoded L2 payload is missing.',
        ),
      )
    }

    console.log(this.COLORS.heading('\n--- Analysis Complete ---'))

    // --- Save Cache ---
    this.saveCache()
  }
}
