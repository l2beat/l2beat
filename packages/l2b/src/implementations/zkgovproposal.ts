import { formatSeconds } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { ethers } from 'ethers'

// Constants
const ZK_PROTOCOL_GOVERNOR_ADDRESS =
  '0x76705327e682F2d96943280D99464Ab61219e34f'
const PROTOCOL_UPGRADE_HANDLER_ADDRESS =
  '0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3'
const L1_MESSENGER_ADDRESS = '0x0000000000000000000000000000000000008008'

// Time periods in seconds
const EXECUTION_DELAY = 3 * 60 * 60 // 3 hours from L2 to L1
const STANDARD_LEGAL_VETO_PERIOD = 3 * 24 * 60 * 60 // 3 days
const EXTENDED_LEGAL_VETO_PERIOD = 7 * 24 * 60 * 60 // 7 days
const UPGRADE_DELAY_PERIOD = 24 * 60 * 60 // 1 day
const UPGRADE_WAIT_OR_EXPIRE_PERIOD = 30 * 24 * 60 * 60 // 30 days

// Define types and interfaces
interface ZkGovProposalAnalyzerConfig {
  l2RpcUrl: string
  l1RpcUrl: string
  outputPath: string
}

interface ProposalInfo {
  proposalId: string
  proposer: string
  targets: string[]
  values: ethers.BigNumber[]
  signatures: string[]
  calldatas: string[]
  voteStart: ethers.BigNumber
  voteEnd: ethers.BigNumber
  description: string
  blockNumber: number
  txHash: string
}

interface ProposalExtensionInfo {
  proposalId: string
  extendedDeadline: ethers.BigNumber
  txHash: string
  blockNumber: number
  blockTimestamp: number
}

interface ProposalExecutionInfo {
  txHash: string
  blockNumber: number
  blockTimestamp: number
}

interface L1MessageInfo {
  hash: string
  message: string
  sender: string
}

interface UpgradeStatusInfo {
  creationTimestamp: number
  securityCouncilApprovalTimestamp: number
  guardiansApproval: boolean
  guardiansExtendedLegalVeto: boolean
  executed: boolean
}

interface UpgradeInfo {
  id: string
  proposal: {
    calls: Array<{
      target: string
      value: ethers.BigNumber
      data: string
    }>
    executor: string
    salt: string
  }
  blockNumber: number
  txHash: string
}

interface TimelineEvent {
  status: string
  time: Date
  description: string
  txHash?: string
  color: 'green' | 'yellow' | 'red' | 'blue' | 'cyan' | 'white' | 'magenta'
  isCurrent: boolean
}

// Enums
enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

enum UpgradeState {
  None = 0,
  LegalVetoPeriod = 1,
  Waiting = 2,
  ExecutionPending = 3,
  Ready = 4,
  Expired = 5,
  Done = 6,
}

export class ZkGovProposalAnalyzer {
  private l2Provider: ethers.providers.JsonRpcProvider
  private l1Provider: ethers.providers.JsonRpcProvider
  private outputPath: string

  constructor(config: ZkGovProposalAnalyzerConfig) {
    this.l2Provider = new ethers.providers.JsonRpcProvider(config.l2RpcUrl)
    this.l1Provider = new ethers.providers.JsonRpcProvider(config.l1RpcUrl)
    this.outputPath = config.outputPath
  }

  public async analyzeProposal(proposalId: string): Promise<void> {
    console.log(
      chalk.blue(
        `\nAnalyzing ZKsync governance proposal ${chalk.bold(proposalId)}...\n`,
      ),
    )

    try {
      // Step 1: Get proposal information from L2
      const proposalInfo = await this.findProposalCreatedEvent(proposalId)
      if (!proposalInfo) {
        console.log(
          chalk.red(`Proposal ${proposalId} not found on ZKsync Era (L2)`),
        )
        return
      }

      // Step 2: Get proposal state on L2
      const proposalState = await this.getProposalState(proposalId)

      // Step 3: Check if there was a late quorum extension
      const extensionInfo = await this.findProposalExtendedEvent(proposalId)

      // Step 4: Find execution info if proposal was executed
      let executionInfo: ProposalExecutionInfo | null = null
      let l1MessageInfo: L1MessageInfo | null = null
      let upgradeInfo: UpgradeInfo | null = null
      let upgradeState: UpgradeState | null = null
      let upgradeStatus: UpgradeStatusInfo | null = null
      let l2BlockTimestamp = 0

      if (proposalState === ProposalState.Executed) {
        executionInfo = await this.findProposalExecutedInfo(proposalId)

        // Get L1 info immediately if proposal was executed
        if (executionInfo) {
          l1MessageInfo = await this.findL1MessageSent(executionInfo.txHash)

          if (l1MessageInfo) {
            l2BlockTimestamp = executionInfo.blockTimestamp
            const estimatedL1Block = await this.getL1BlockAfterTimestamp(
              l2BlockTimestamp + EXECUTION_DELAY,
            )

            upgradeInfo = await this.findUpgradeStartedEvent(
              l1MessageInfo.hash,
              estimatedL1Block,
            )
            upgradeState = await this.getUpgradeState(l1MessageInfo.hash)
            upgradeStatus = await this.getUpgradeStatus(l1MessageInfo.hash)
          }
        }
      }

      // Initialize timeline events array
      const timeline: TimelineEvent[] = await this.buildProposalTimeline(
        proposalInfo,
        proposalState,
        extensionInfo,
        executionInfo,
      )

      // Initialize output content
      const summaryOutput: string[] = []
      const detailsOutput: string[] = []

      // Add summary section (description and calldata) to summary output
      // Pass the L1 upgradeInfo to addSummaryToOutput
      this.addSummaryToOutput(
        summaryOutput,
        proposalInfo,
        proposalState,
        upgradeInfo,
      )

      // Add header to details output
      this.addL2HeaderToOutput(detailsOutput, proposalInfo, proposalState)

      // Add timeline to details output
      this.addTimelineToOutput(detailsOutput, timeline, 'L2 Proposal Timeline')

      // Add L1 information to details output if available
      if (executionInfo && l1MessageInfo) {
        this.addL1InfoToOutput(
          detailsOutput,
          l1MessageInfo,
          upgradeInfo,
          upgradeState,
          upgradeStatus,
          l2BlockTimestamp,
          executionInfo.txHash,
        )

        // Step 8: Compare the payloads (L2 vs L1)
        if (upgradeInfo) {
          this.addPayloadComparisonToOutput(
            detailsOutput,
            proposalInfo,
            upgradeInfo,
          )
        }
      } else if (executionInfo) {
        detailsOutput.push(
          chalk.yellow(
            "\nThis proposal doesn't target L1 (no L1 message was sent)",
          ),
        )
      }

      // 9. Combine outputs and display
      const combinedOutput = [...summaryOutput, ...detailsOutput]
      this.displayOutput(combinedOutput)
    } catch (error) {
      console.error(chalk.red('\nError analyzing proposal:'), error)
    }
  }

  /**
   * Add summary information (description and calldata) to output
   */
  private addSummaryToOutput(
    output: string[],
    proposalInfo: ProposalInfo,
    proposalState: ProposalState,
    upgradeInfo: UpgradeInfo | null = null,
  ): void {
    output.push(chalk.bold.green('='.repeat(80)))
    output.push(chalk.bold.green('PROPOSAL SUMMARY'))
    output.push(chalk.bold.green('='.repeat(80)))

    // Basic info
    output.push(chalk.bold('\nID: ') + proposalInfo.proposalId)
    output.push(chalk.bold('State: ') + this.formatProposalState(proposalState))

    // Description first
    output.push(chalk.bold('\nDescription:'))
    output.push(proposalInfo.description)

    // If we have L1 upgrade info, display L1 payload instead of L2
    if (upgradeInfo) {
      output.push(chalk.bold.cyan('\nL1 Upgrade Targets:'))
      for (let i = 0; i < upgradeInfo.proposal.calls.length; i++) {
        const call = upgradeInfo.proposal.calls[i]
        output.push(chalk.cyan(`\nTarget ${i + 1}: ${call.target}`))
        output.push(`Value: ${ethers.utils.formatEther(call.value)} ETH`)
        output.push(`Calldata: ${call.data}`)
      }
      output.push(chalk.bold('\nL1 Executor: ') + upgradeInfo.proposal.executor)
      output.push(chalk.bold('L1 Salt: ') + upgradeInfo.proposal.salt)
    } else {
      // Otherwise display L2 targets
      output.push(chalk.bold.cyan('\nProposal Targets:'))
      for (let i = 0; i < proposalInfo.targets.length; i++) {
        output.push(chalk.cyan(`\nTarget ${i + 1}: ${proposalInfo.targets[i]}`))
        output.push(
          `Value: ${ethers.utils.formatEther(proposalInfo.values[i])} ETH`,
        )
        if (proposalInfo.signatures[i]) {
          output.push(`Signature: ${proposalInfo.signatures[i]}`)
        }
        output.push(`Calldata: ${proposalInfo.calldatas[i]}`)
      }
    }

    // Add a clear separator
    output.push('\n' + chalk.bold.blue('='.repeat(80)))
    output.push(chalk.bold.blue('Flow / status details'))
    output.push(chalk.bold.blue('='.repeat(80)))
  }

  /**
   * Add header information to output array (without duplicating description)
   */
  private addL2HeaderToOutput(
    output: string[],
    proposalInfo: ProposalInfo,
    proposalState: ProposalState,
  ): void {
    // Header
    output.push(chalk.bold.magenta('\n' + '='.repeat(80)))
    output.push(chalk.bold.magenta('L2 Proposal Information'))
    output.push(chalk.bold.magenta('='.repeat(80)))

    // Proposal basic info (without repeating description)
    output.push(chalk.bold('\nL2 proposal ID: ') + proposalInfo.proposalId)
    output.push(chalk.bold('\nProposer: ') + proposalInfo.proposer)
    output.push(
      chalk.bold('Current State: ') + this.formatProposalState(proposalState),
    )
  }

  /**
   * Find the ProposalCreated event for a given proposal ID
   */
  private async findProposalCreatedEvent(
    proposalId: string,
  ): Promise<ProposalInfo | null> {
    const zkGovernorInterface = new ethers.utils.Interface([
      'event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)',
    ])

    // Event signature hash
    const eventSig = ethers.utils.id(
      'ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)',
    )

    // Get logs (we need to scan all logs since proposalId is not indexed)
    const logs = await this.l2Provider.getLogs({
      address: ZK_PROTOCOL_GOVERNOR_ADDRESS,
      topics: [eventSig],
      fromBlock: 41196850,
    })

    // Parse logs and find matching proposalId
    for (const log of logs) {
      try {
        const parsedLog = zkGovernorInterface.parseLog(log)
        if (parsedLog.args.proposalId.toString() === proposalId) {
          return {
            proposalId: parsedLog.args.proposalId.toString(),
            proposer: parsedLog.args.proposer,
            targets: parsedLog.args.targets,
            values: parsedLog.args[2],
            signatures: parsedLog.args.signatures,
            calldatas: parsedLog.args.calldatas,
            voteStart: parsedLog.args.voteStart,
            voteEnd: parsedLog.args.voteEnd,
            description: parsedLog.args.description,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
          }
        }
      } catch (_error) {
        console.log(chalk.yellow('Error parsing log, skipping...'))
      }
    }

    return null
  }

  /**
   * Find the ProposalExtended event for a given proposal ID
   */
  private async findProposalExtendedEvent(
    proposalId: string,
  ): Promise<ProposalExtensionInfo | null> {
    const zkGovernorInterface = new ethers.utils.Interface([
      'event ProposalExtended(uint256 indexed proposalId, uint64 extendedDeadline)',
    ])

    // Event signature hash
    const eventSig =
      '0x541f725fb9f7c98a30cc9c0ff32fbb14358cd7159c847a3aa20a2bdc442ba511' // ProposalExtended

    // Get logs with indexed proposalId
    const logs = await this.l2Provider.getLogs({
      address: ZK_PROTOCOL_GOVERNOR_ADDRESS,
      topics: [
        eventSig,
        ethers.utils.hexZeroPad(
          ethers.BigNumber.from(proposalId).toHexString(),
          32,
        ),
      ],
      fromBlock: 41196850,
    })

    if (logs.length > 0) {
      const parsedLog = zkGovernorInterface.parseLog(logs[0])
      const block = await this.l2Provider.getBlock(logs[0].blockNumber)

      return {
        proposalId: parsedLog.args.proposalId.toString(),
        extendedDeadline: parsedLog.args.extendedDeadline,
        txHash: logs[0].transactionHash,
        blockNumber: logs[0].blockNumber,
        blockTimestamp: block.timestamp,
      }
    }

    return null
  }

  /**
   * Get the current state of a proposal
   */
  private async getProposalState(proposalId: string): Promise<ProposalState> {
    const zkGovernorInterface = new ethers.utils.Interface([
      'function state(uint256 _proposalId) view returns (uint8)',
    ])

    const data = zkGovernorInterface.encodeFunctionData('state', [proposalId])

    const result = await this.l2Provider.call({
      to: ZK_PROTOCOL_GOVERNOR_ADDRESS,
      data,
    })

    const [state] = ethers.utils.defaultAbiCoder.decode(['uint8'], result)
    return state
  }

  /**
   * Find the execution information of a proposal
   */
  private async findProposalExecutedInfo(
    proposalId: string,
  ): Promise<ProposalExecutionInfo | null> {
    const zkGovernorInterface = new ethers.utils.Interface([
      'event ProposalExecuted(uint256 proposalId)',
    ])

    // Event signature hash
    const eventSig = ethers.utils.id('ProposalExecuted(uint256)')

    // Get logs
    const logs = await this.l2Provider.getLogs({
      address: ZK_PROTOCOL_GOVERNOR_ADDRESS,
      topics: [eventSig],
      fromBlock: 41196850,
    })

    // Parse logs and find matching proposalId
    for (const log of logs) {
      try {
        const parsedLog = zkGovernorInterface.parseLog(log)
        if (parsedLog.args.proposalId.toString() === proposalId) {
          const block = await this.l2Provider.getBlock(log.blockNumber)
          return {
            txHash: log.transactionHash,
            blockNumber: log.blockNumber,
            blockTimestamp: block.timestamp,
          }
        }
      } catch (_error) {
        console.log(chalk.yellow('Error parsing log, skipping...'))
      }
    }

    return null
  }

  /**
   * Build a timeline of events for the proposal
   */
  private async buildProposalTimeline(
    proposalInfo: ProposalInfo,
    currentState: ProposalState,
    extensionInfo: ProposalExtensionInfo | null,
    executionInfo: ProposalExecutionInfo | null,
  ): Promise<TimelineEvent[]> {
    const timeline: TimelineEvent[] = []

    // Get block timestamp for proposal creation
    const creationBlock = await this.l2Provider.getBlock(
      proposalInfo.blockNumber,
    )
    const creationTime = creationBlock.timestamp

    // 1. Proposal Creation
    timeline.push({
      status: 'Created',
      time: new Date(creationTime * 1000),
      description: 'Proposal was created',
      txHash: proposalInfo.txHash,
      color: 'blue',
      isCurrent: false,
    })

    // 2. Pending Period
    const pendingStart = new Date(creationTime * 1000)
    timeline.push({
      status: 'Pending',
      time: pendingStart,
      description: 'Waiting for voting to start',
      color: 'yellow',
      isCurrent: currentState === ProposalState.Pending,
    })

    // 3. Active Period
    const voteStartTime = proposalInfo.voteStart.toNumber()
    const originalVoteEndTime = proposalInfo.voteEnd.toNumber()

    timeline.push({
      status: 'Active',
      time: new Date(voteStartTime * 1000),
      description: 'Voting period started',
      color: 'yellow',
      isCurrent: currentState === ProposalState.Active && !extensionInfo,
    })

    // 4. Late Quorum Extension (if applicable)
    if (extensionInfo) {
      const extendedDeadline = extensionInfo.extendedDeadline.toNumber()
      timeline.push({
        status: 'Extended',
        time: new Date(extensionInfo.blockTimestamp * 1000),
        description: `Vote period extended to ${new Date(extendedDeadline * 1000).toISOString()}`,
        txHash: extensionInfo.txHash,
        color: 'cyan',
        isCurrent: currentState === ProposalState.Active,
      })
    }

    // 5. Vote End
    const actualVoteEndTime = extensionInfo
      ? extensionInfo.extendedDeadline.toNumber()
      : originalVoteEndTime

    const voteEndEvent: TimelineEvent = {
      status: 'Vote Ended',
      time: new Date(actualVoteEndTime * 1000),
      description: 'Voting period ended',
      color: 'blue',
      isCurrent: false,
    }

    // Different outcomes after vote ends
    if (currentState === ProposalState.Canceled) {
      voteEndEvent.status = 'Canceled'
      voteEndEvent.description = 'Proposal was canceled'
      voteEndEvent.color = 'red'
      voteEndEvent.isCurrent = true
    } else if (currentState === ProposalState.Defeated) {
      voteEndEvent.status = 'Defeated'
      voteEndEvent.description = 'Proposal was defeated'
      voteEndEvent.color = 'red'
      voteEndEvent.isCurrent = true
    } else if (
      [
        ProposalState.Succeeded,
        ProposalState.Queued,
        ProposalState.Executed,
      ].includes(currentState)
    ) {
      voteEndEvent.status = 'Succeeded'
      voteEndEvent.description = 'Proposal vote succeeded'
      voteEndEvent.color = 'green'
      voteEndEvent.isCurrent = currentState === ProposalState.Succeeded
    }

    timeline.push(voteEndEvent)

    // 6. Queued (in ZKsync this is very brief since timelock is 0)
    if ([ProposalState.Queued, ProposalState.Executed].includes(currentState)) {
      timeline.push({
        status: 'Queued',
        time: new Date(actualVoteEndTime * 1000),
        description: 'Proposal queued for execution',
        color: 'yellow',
        isCurrent: currentState === ProposalState.Queued,
      })
    }

    // 7. Executed
    if (currentState === ProposalState.Executed && executionInfo) {
      timeline.push({
        status: 'Executed',
        time: new Date(executionInfo.blockTimestamp * 1000),
        description: 'Proposal executed on L2',
        txHash: executionInfo.txHash,
        color: 'green',
        isCurrent: true,
      })
    }

    return timeline
  }

  /**
   * Find the L1MessageSent event in a transaction receipt
   */
  private async findL1MessageSent(
    txHash: string,
  ): Promise<L1MessageInfo | null> {
    const receipt = await this.l2Provider.getTransactionReceipt(txHash)

    const messengerInterface = new ethers.utils.Interface([
      'event L1MessageSent(address indexed _sender, bytes32 indexed _hash, bytes _message)',
    ])

    // Event signature hash
    const eventSig = ethers.utils.id('L1MessageSent(address,bytes32,bytes)')

    // Find L1MessageSent in transaction logs
    for (const log of receipt.logs) {
      if (
        log.address.toLowerCase() === L1_MESSENGER_ADDRESS.toLowerCase() &&
        log.topics[0] === eventSig
      ) {
        const parsedLog = messengerInterface.parseLog(log)
        return {
          sender: parsedLog.args._sender,
          hash: parsedLog.args._hash,
          message: parsedLog.args._message,
        }
      }
    }

    return null
  }

  /**
   * Find UpgradeStarted event on L1
   */
  private async findUpgradeStartedEvent(
    upgradeId: string,
    fromBlock: number,
  ): Promise<UpgradeInfo | null> {
    const upgradeHandlerInterface = new ethers.utils.Interface([
      'event UpgradeStarted(bytes32 indexed _id, tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt) _proposal)',
    ])

    // Event signature hash
    const eventSig =
      '0x71a79729ed8b7db17b27c5dfe0ae24cf41d52b08c8dfc82592fc7db23010c879' // UpgradeStarted
    // Get logs with indexed upgradeId
    const logs = await this.l1Provider.getLogs({
      address: PROTOCOL_UPGRADE_HANDLER_ADDRESS,
      topics: [eventSig, ethers.utils.hexZeroPad(upgradeId, 32)],
      fromBlock,
    })

    if (logs.length > 0) {
      const parsedLog = upgradeHandlerInterface.parseLog(logs[0])
      return {
        id: parsedLog.args._id,
        proposal: parsedLog.args._proposal,
        blockNumber: logs[0].blockNumber,
        txHash: logs[0].transactionHash,
      }
    }

    return null
  }

  /**
   * Get the upgrade state from L1
   */
  private async getUpgradeState(upgradeId: string): Promise<UpgradeState> {
    const upgradeHandlerInterface = new ethers.utils.Interface([
      'function upgradeState(bytes32 _id) view returns (uint8)',
    ])

    const data = upgradeHandlerInterface.encodeFunctionData('upgradeState', [
      upgradeId,
    ])

    const result = await this.l1Provider.call({
      to: PROTOCOL_UPGRADE_HANDLER_ADDRESS,
      data,
    })

    const [state] = ethers.utils.defaultAbiCoder.decode(['uint8'], result)
    return state
  }

  /**
   * Get detailed upgrade status from L1
   */
  private async getUpgradeStatus(
    upgradeId: string,
  ): Promise<UpgradeStatusInfo | null> {
    const upgradeHandlerInterface = new ethers.utils.Interface([
      'function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)',
    ])

    const data = upgradeHandlerInterface.encodeFunctionData('upgradeStatus', [
      upgradeId,
    ])

    try {
      const result = await this.l1Provider.call({
        to: PROTOCOL_UPGRADE_HANDLER_ADDRESS,
        data,
      })

      const [
        creationTimestamp,
        securityCouncilApprovalTimestamp,
        guardiansApproval,
        guardiansExtendedLegalVeto,
        executed,
      ] = ethers.utils.defaultAbiCoder.decode(
        ['uint48', 'uint48', 'bool', 'bool', 'bool'],
        result,
      )

      return {
        creationTimestamp: Number(creationTimestamp),
        securityCouncilApprovalTimestamp: Number(
          securityCouncilApprovalTimestamp,
        ),
        guardiansApproval,
        guardiansExtendedLegalVeto,
        executed,
      }
    } catch (_error) {
      console.log(chalk.yellow('Error getting upgrade status'))
      return null
    }
  }

  /**
   * Find approximate L1 block after a given timestamp
   */
  private async getL1BlockAfterTimestamp(timestamp: number): Promise<number> {
    const currentBlock = await this.l1Provider.getBlockNumber()
    const currentBlockData = await this.l1Provider.getBlock(currentBlock)

    if (currentBlockData.timestamp <= timestamp) {
      // The timestamp is in the future, use current block
      return currentBlock
    }

    // Estimate a good starting point by using average block time (12s for Ethereum)
    const blockTimeEstimate = 12 // seconds
    const blockDiff = Math.floor(
      (currentBlockData.timestamp - timestamp) / blockTimeEstimate,
    )
    const estimatedBlock = Math.max(1, currentBlock - blockDiff)

    return estimatedBlock
  }

  /**
   * Add timeline to output array with custom title
   */
  private addTimelineToOutput(
    output: string[],
    timeline: TimelineEvent[],
    title: string,
  ): void {
    output.push(chalk.bold.cyan('\n' + '='.repeat(80)))
    output.push(chalk.bold.cyan(title))
    output.push(chalk.bold.cyan('='.repeat(80)))

    // Sort timeline by time
    timeline.sort((a, b) => a.time.getTime() - b.time.getTime())

    // Current time for relative time calculations
    const now = new Date()

    // Find current step for special formatting
    let currentEventIndex = timeline.findIndex((event) => event.isCurrent)
    if (currentEventIndex === -1) {
      // If no current event (shouldn't happen), find the last past event
      for (let i = timeline.length - 1; i >= 0; i--) {
        if (timeline[i].time <= now) {
          currentEventIndex = i
          break
        }
      }
    }

    // Display timeline with connections
    for (let i = 0; i < timeline.length; i++) {
      const event = timeline[i]
      const formattedTime = event.time
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19)
      const relativeTime = this.formatTimeDistance(event.time)

      // Choose appropriate marker and style based on position in timeline
      let marker: string
      let statusLine: string

      if (i === currentEventIndex) {
        // Current event
        marker = chalk.bold.white('•') // Current state marker is a filled circle
        statusLine = chalk.bold[event.color](`${event.status.toUpperCase()}`)
      } else if (i < currentEventIndex) {
        // Past event
        marker = chalk.gray('✓') // Past events get a checkmark
        statusLine = chalk[event.color](event.status)
      } else {
        // Future event
        marker = chalk.gray('○') // Future events get an empty circle
        statusLine = chalk.gray(event.status)
      }

      // Add connector line for all but the last item
      const connector = i < timeline.length - 1 ? chalk.gray('│') : ' '

      // Format the timeline entry
      output.push(`${marker} ${statusLine}`)
      output.push(`${connector}  ${formattedTime} (${relativeTime})`)
      if (event.description) {
        output.push(
          `${connector}  ${i === currentEventIndex ? chalk.bold(event.description) : event.description}`,
        )
      }
      if (event.txHash) {
        output.push(`${connector}  ${chalk.dim(`Tx: ${event.txHash}`)}`)
      }

      // Add spacing connector if not the last item
      if (i < timeline.length - 1) {
        output.push(`${connector}`)
      }
    }
  }

  /**
   * Build L1 upgrade timeline similar to proposal timeline
   */
  private buildL1UpgradeTimeline(
    upgradeInfo: UpgradeInfo,
    upgradeState: UpgradeState,
    upgradeStatus: UpgradeStatusInfo,
  ): TimelineEvent[] {
    const timeline: TimelineEvent[] = []

    // 1. Upgrade Created
    const creationTime = new Date(upgradeStatus.creationTimestamp * 1000)
    timeline.push({
      status: 'Created',
      time: creationTime,
      description: 'L1 upgrade proposal was created',
      txHash: upgradeInfo.txHash,
      color: 'blue',
      isCurrent: upgradeState === UpgradeState.None,
    })

    // 2. Legal Veto Period
    timeline.push({
      status: 'Legal Veto Period',
      time: creationTime,
      description: upgradeStatus.guardiansExtendedLegalVeto
        ? `Time to review and/or coordinate for non-approval (extended: ${formatSeconds(EXTENDED_LEGAL_VETO_PERIOD)})`
        : `Time to review and/or coordinate for non-approval (standard: ${formatSeconds(STANDARD_LEGAL_VETO_PERIOD)})`,
      color: 'yellow',
      isCurrent: upgradeState === UpgradeState.LegalVetoPeriod,
    })

    // 3. Legal Veto Period End
    const vetoEndTime = new Date(
      (upgradeStatus.creationTimestamp +
        (upgradeStatus.guardiansExtendedLegalVeto
          ? EXTENDED_LEGAL_VETO_PERIOD
          : STANDARD_LEGAL_VETO_PERIOD)) *
        1000,
    )

    timeline.push({
      status: 'Legal Veto Period Ended',
      time: vetoEndTime,
      description: `'Waiting' state can be approved by Guardians (${formatSeconds(UPGRADE_WAIT_OR_EXPIRE_PERIOD)}), SC (immediate) or expire (${formatSeconds(UPGRADE_WAIT_OR_EXPIRE_PERIOD)})`,
      color: 'blue',
      isCurrent: false,
    })

    // 4. Security Council Approval (if happened)
    if (upgradeStatus.securityCouncilApprovalTimestamp > 0) {
      const scApprovalTime = new Date(
        upgradeStatus.securityCouncilApprovalTimestamp * 1000,
      )

      timeline.push({
        status: 'SC Approved',
        time: scApprovalTime,
        description: `Security Council approved the upgrade, can be executed after ${formatSeconds(UPGRADE_DELAY_PERIOD)}`,
        color: 'green',
        isCurrent: false,
      })

      // 5. Ready for Execution time
      const readyTime = new Date(
        (upgradeStatus.securityCouncilApprovalTimestamp +
          UPGRADE_DELAY_PERIOD) *
          1000,
      )

      timeline.push({
        status: 'Ready for Execution',
        time: readyTime,
        description: 'Upgrade is ready to be executed',
        color: 'green',
        isCurrent: upgradeState === UpgradeState.Ready,
      })

      // 6. Execution (if executed)
      if (upgradeStatus.executed) {
        // We don't have exact execution time, so use the ready time as an approximation
        const execTime = new Date(readyTime.getTime() + 1000) // Just add 1 second

        timeline.push({
          status: 'Executed (Done)',
          time: execTime,
          description: 'Upgrade was executed on L1',
          color: 'green',
          isCurrent: upgradeState === UpgradeState.Done,
        })
      } else if (upgradeState === UpgradeState.Expired) {
        // 6b. Expired (if applicable)
        const expiryTime = new Date(
          (upgradeStatus.securityCouncilApprovalTimestamp +
            UPGRADE_DELAY_PERIOD +
            UPGRADE_WAIT_OR_EXPIRE_PERIOD) *
            1000,
        )

        timeline.push({
          status: 'Expired',
          time: expiryTime,
          description: 'Upgrade expired without execution',
          color: 'red',
          isCurrent: true,
        })
      }
    } else {
      // Alternative flow: Security Council hasn't approved
      const waitingEndTime = new Date(
        (upgradeStatus.creationTimestamp +
          (upgradeStatus.guardiansExtendedLegalVeto
            ? EXTENDED_LEGAL_VETO_PERIOD
            : STANDARD_LEGAL_VETO_PERIOD) +
          UPGRADE_WAIT_OR_EXPIRE_PERIOD) *
          1000,
      )

      // Show Guardian Approval status
      if (upgradeStatus.guardiansApproval) {
        timeline.push({
          status: 'Guardians Approved',
          time: vetoEndTime, // Approximate time TODO: fetch exact time from events
          description: `Guardians approved the upgrade, allowing for execution after ${formatSeconds(UPGRADE_WAIT_OR_EXPIRE_PERIOD)}`,
          color: 'green',
          isCurrent: false,
        })
      }

      // Always show the waiting status
      timeline.push({
        status: 'Waiting for Approval',
        time: vetoEndTime,
        description: 'Waiting for Guardians and/or Security Council approval',
        color: 'yellow',
        isCurrent: upgradeState === UpgradeState.Waiting,
      })

      // Add expiry info
      timeline.push({
        status:
          upgradeState === UpgradeState.Expired ? 'Expired' : 'Will Expire',
        time: waitingEndTime,
        description:
          'Upgrade expires if not approved by Guardians and/or Security Council',
        color: upgradeState === UpgradeState.Expired ? 'red' : 'yellow',
        isCurrent: upgradeState === UpgradeState.Expired,
      })
    }

    return timeline
  }

  /**
   * Add L1 information to output array
   */
  private addL1InfoToOutput(
    output: string[],
    l1MessageInfo: L1MessageInfo,
    upgradeInfo: UpgradeInfo | null,
    upgradeState: UpgradeState | null,
    upgradeStatus: UpgradeStatusInfo | null,
    l2ExecutionTimestamp: number,
    l2ExecutionTxHash: string,
  ): void {
    // Add L1 section header
    output.push(chalk.bold.magenta('\n' + '='.repeat(80)))
    output.push(chalk.bold.magenta('L1 Upgrade Information'))
    output.push(chalk.bold.magenta('='.repeat(80)))

    output.push(
      chalk.bold('\nL1 Upgrade ID (from L2 message): ') + l1MessageInfo.hash,
    )
    output.push(
      chalk.bold('L2 -> L1 Message Origin: ') +
        chalk.dim(`Tx: ${l2ExecutionTxHash}`),
    )

    // Show estimated arrival time on L1
    const estimatedL1Arrival = new Date(
      (l2ExecutionTimestamp + EXECUTION_DELAY) * 1000,
    )
    output.push(
      chalk.bold('\nEstimated L1 Arrival: ') +
        `${estimatedL1Arrival.toISOString()} (${this.formatTimeDistance(estimatedL1Arrival)})`,
    )

    // If upgrade was found on L1
    if (upgradeInfo) {
      output.push(
        chalk.bold('\nL1 Upgrade Started: ') +
          'Yes (' +
          chalk.dim(`Tx: ${upgradeInfo.txHash}`) +
          ')',
      )
      output.push(
        chalk.bold('L1 Upgrade ID (from L1 event): ') + upgradeInfo.id,
      )

      // Show upgrade state
      if (upgradeState !== null) {
        output.push(
          chalk.bold('\nL1 Upgrade State: ') +
            this.formatUpgradeState(upgradeState),
        )
        // Create L1 upgrade timeline if we have status information
        if (upgradeStatus) {
          // Build the L1 upgrade timeline
          const l1Timeline = this.buildL1UpgradeTimeline(
            upgradeInfo,
            upgradeState,
            upgradeStatus,
          )

          // Add the timeline to output with the L1-specific title
          this.addTimelineToOutput(output, l1Timeline, 'L1 Upgrade Timeline')
        }
      }
    } else {
      output.push(chalk.yellow('\nL1 Upgrade not yet started or not found'))
    }
  }

  /**
   * Compare and add payload comparison to output
   */
  private addPayloadComparisonToOutput(
    output: string[],
    proposalInfo: ProposalInfo,
    upgradeInfo: UpgradeInfo,
  ): void {
    output.push(chalk.bold.yellow('\n' + '='.repeat(80)))
    output.push(chalk.bold.yellow('L2 vs L1 Payload Comparison'))
    output.push(chalk.bold.yellow('='.repeat(80)))

    const l1Calls = upgradeInfo.proposal.calls

    // Check if L2 calldata contains L1 calldata
    let matchFound = false
    let l2CallForL1 = null

    // L2 calls targeting the L1 messenger should contain the L1 calls
    for (let i = 0; i < proposalInfo.targets.length; i++) {
      // Only check calls to L1 Messenger
      if (
        proposalInfo.targets[i].toLowerCase() ===
        L1_MESSENGER_ADDRESS.toLowerCase()
      ) {
        l2CallForL1 = proposalInfo.calldatas[i]

        // Check if all L1 calls are contained in this L2 calldata
        let allCallsFound = true
        for (const l1Call of l1Calls) {
          if (!l2CallForL1.includes(l1Call.data.substring(2))) {
            // Remove '0x' prefix
            allCallsFound = false
            break
          }
        }

        if (allCallsFound) {
          matchFound = true
          break
        }
      }
    }
    // Show matching status
    if (matchFound) {
      output.push(
        chalk.green('\n✓ L1 payload is contained within the L2 proposal'),
      )
    } else {
      output.push(chalk.red('\n✗ L1 payload does not match L2 proposal'))

      // If no match found, show full L1 payload details
      output.push(chalk.bold('\nFull L1 Upgrade Details:'))
      for (let i = 0; i < l1Calls.length; i++) {
        const call = l1Calls[i]
        output.push(chalk.cyan(`\nTarget ${i + 1}: ${call.target}`))
        output.push(`Value: ${ethers.utils.formatEther(call.value)} ETH`)
        output.push(`Calldata: ${call.data}`)
      }

      output.push(chalk.bold('\nL1 Executor: ') + upgradeInfo.proposal.executor)
      output.push(chalk.bold('L1 Salt: ') + upgradeInfo.proposal.salt)
    }
  }

  /**
   * Format a proposal state with color
   */
  private formatProposalState(state: ProposalState): string {
    const stateNames = [
      'Pending',
      'Active',
      'Canceled',
      'Defeated',
      'Succeeded',
      'Queued',
      'Expired',
      'Executed',
    ]

    const stateName = stateNames[state]

    switch (state) {
      case ProposalState.Pending:
      case ProposalState.Active:
        return chalk.yellow(stateName)
      case ProposalState.Canceled:
      case ProposalState.Defeated:
      case ProposalState.Expired:
        return chalk.red(stateName)
      case ProposalState.Succeeded:
      case ProposalState.Queued:
      case ProposalState.Executed:
        return chalk.green(stateName)
      default:
        return chalk.white(stateName)
    }
  }

  /**
   * Format an upgrade state with color
   */
  private formatUpgradeState(state: UpgradeState): string {
    const stateNames = [
      'None',
      'LegalVetoPeriod',
      'Waiting',
      'ExecutionPending',
      'Ready',
      'Expired',
      'Done',
    ]

    const stateName = stateNames[state]

    switch (state) {
      case UpgradeState.None:
      case UpgradeState.Expired:
        return chalk.red(stateName)
      case UpgradeState.LegalVetoPeriod:
      case UpgradeState.Waiting:
      case UpgradeState.ExecutionPending:
        return chalk.yellow(stateName)
      case UpgradeState.Ready:
      case UpgradeState.Done:
        return chalk.green(stateName)
      default:
        return chalk.white(stateName)
    }
  }

  /**
   * Format time distance for better readability
   */
  private formatTimeDistance(date: Date): string {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffSeconds = Math.floor(Math.abs(diffMs) / 1000)

    if (diffSeconds < 60) {
      return diffMs >= 0 ? 'Just now' : 'Just passed'
    }

    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) {
      return diffMs >= 0 ? `in ${diffMinutes}m` : `${diffMinutes}m ago`
    }

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) {
      return diffMs >= 0 ? `in ${diffHours}h` : `${diffHours}h ago`
    }

    const diffDays = Math.floor(diffHours / 24)
    return diffMs >= 0 ? `in ${diffDays}d` : `${diffDays}d ago`
  }

  /**
   * Display the output in terminal
   */
  private displayOutput(output: string[]): void {
    console.log(output.join('\n'))
  }
}
