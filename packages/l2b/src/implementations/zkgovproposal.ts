import { ethers } from 'ethers'
import chalk from 'chalk'
import * as fs from 'fs'
import * as path from 'path'

// Constants
const ZK_PROTOCOL_GOVERNOR_ADDRESS = '0x76705327e682F2d96943280D99464Ab61219e34f'
const PROTOCOL_UPGRADE_HANDLER_ADDRESS = '0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3'
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

// Enums
enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

enum UpgradeState {
  None,
  LegalVetoPeriod,
  Waiting,
  ExecutionPending,
  Ready,
  Expired,
  Done
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

  /**
   * Analyze a ZKsync governance proposal
   * @param proposalId The proposal ID to analyze
   */
  public async analyzeProposal(proposalId: string): Promise<void> {
    console.log(chalk.blue(`\nAnalyzing ZKsync governance proposal ${chalk.bold(proposalId)}...\n`))

    try {
      // Step 1: Get proposal information from L2
      const proposalInfo = await this.findProposalCreatedEvent(proposalId)
      if (!proposalInfo) {
        console.log(chalk.red(`Proposal ${proposalId} not found on ZKsync Era (L2)`))
        return
      }

      // Step 2: Get proposal state on L2
      const proposalState = await this.getProposalState(proposalId)

      // Initialize output content
      const output: string[] = []

      // Add L2 information to output
      this.addL2InfoToOutput(output, proposalInfo, proposalState)

      let l1MessageInfo: L1MessageInfo | null = null
      let upgradeInfo: UpgradeInfo | null = null
      let upgradeState: UpgradeState | null = null
      let upgradeStatus: UpgradeStatusInfo | null = null

      // Step 3: If executed, check for L1 message
      if (proposalState === ProposalState.Executed) {
        const executedTxHash = await this.findProposalExecutedTx(proposalId)
        if (executedTxHash) {
          // Step 4: Find L1 message sent event
          l1MessageInfo = await this.findL1MessageSent(executedTxHash)

          if (l1MessageInfo) {
            // Step 5: Get L1 upgrade information
            const l2ExecutionBlock = await this.l2Provider.getTransactionReceipt(executedTxHash)
            const l2BlockTimestamp = (await this.l2Provider.getBlock(l2ExecutionBlock.blockNumber)).timestamp
            const estimatedL1Block = await this.getL1BlockAfterTimestamp(l2BlockTimestamp)

            upgradeInfo = await this.findUpgradeStartedEvent(l1MessageInfo.hash, estimatedL1Block)
            upgradeState = await this.getUpgradeState(l1MessageInfo.hash)
            upgradeStatus = await this.getUpgradeStatus(l1MessageInfo.hash)

            // Add L1 information to output
            this.addL1InfoToOutput(
              output, 
              l1MessageInfo, 
              upgradeInfo, 
              upgradeState, 
              upgradeStatus, 
              l2BlockTimestamp
            )
          } else {
            output.push(chalk.yellow("\nThis proposal doesn't target L1 (no L1 message was sent)"))
          }
        }
      }

      // Step 6: Display and/or save output
      if (this.outputPath) {
        await this.writeToMarkdownFile(output)
        console.log(chalk.green(`\nOutput saved to ${this.outputPath}`))
      } else {
        this.displayOutput(output)
      }

    } catch (error) {
      console.error(chalk.red("\nError analyzing proposal:"), error)
    }
  }

  /**
   * Find the ProposalCreated event for a given proposal ID
   */
  private async findProposalCreatedEvent(proposalId: string): Promise<ProposalInfo | null> {
    const zkGovernorInterface = new ethers.utils.Interface([
      'event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)'
    ])

    // Event signature hash
    const eventSig = ethers.utils.id(
      'ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)'
    )

    // Get logs (we need to scan all logs since proposalId is not indexed)
    const logs = await this.l2Provider.getLogs({
      address: ZK_PROTOCOL_GOVERNOR_ADDRESS,
      topics: [eventSig],
      fromBlock: 41196850
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
            txHash: log.transactionHash
          }
        }
      } catch (error) {
        console.log(chalk.yellow("Error parsing log, skipping..."))
      }
    }

    return null
  }

  /**
   * Get the current state of a proposal
   */
  private async getProposalState(proposalId: string): Promise<ProposalState> {
    const zkGovernorInterface = new ethers.utils.Interface([
      'function state(uint256 _proposalId) view returns (uint8)'
    ])

    const data = zkGovernorInterface.encodeFunctionData('state', [proposalId])

    const result = await this.l2Provider.call({
      to: ZK_PROTOCOL_GOVERNOR_ADDRESS,
      data
    })

    const [state] = ethers.utils.defaultAbiCoder.decode(['uint8'], result)
    return state
  }

  /**
   * Find the transaction hash of the ProposalExecuted event
   */
  private async findProposalExecutedTx(proposalId: string): Promise<string | null> {
    const zkGovernorInterface = new ethers.utils.Interface([
      'event ProposalExecuted(uint256 proposalId)'
    ])

    // Event signature hash
    const eventSig = ethers.utils.id('ProposalExecuted(uint256)')

    // Get logs (we need to scan all logs since proposalId is not indexed)
    const logs = await this.l2Provider.getLogs({
      address: ZK_PROTOCOL_GOVERNOR_ADDRESS,
      topics: [eventSig],
      fromBlock: 41196850
    })

    // Parse logs and find matching proposalId
    for (const log of logs) {
      try {
        const parsedLog = zkGovernorInterface.parseLog(log)
        if (parsedLog.args.proposalId.toString() === proposalId) {
          return log.transactionHash
        }
      } catch (error) {
        console.log(chalk.yellow("Error parsing log, skipping..."))
      }
    }

    return null
  }

  /**
   * Find the L1MessageSent event in a transaction receipt
   */
  private async findL1MessageSent(txHash: string): Promise<L1MessageInfo | null> {
    const receipt = await this.l2Provider.getTransactionReceipt(txHash)

    const messengerInterface = new ethers.utils.Interface([
      'event L1MessageSent(address indexed _sender, bytes32 indexed _hash, bytes _message)'
    ])

    // Event signature hash
    const eventSig = ethers.utils.id('L1MessageSent(address,bytes32,bytes)')

    // Find L1MessageSent in transaction logs
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() === L1_MESSENGER_ADDRESS.toLowerCase() && 
          log.topics[0] === eventSig) {
        const parsedLog = messengerInterface.parseLog(log)
        return {
          sender: parsedLog.args._sender,
          hash: parsedLog.args._hash,
          message: parsedLog.args._message
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
    fromBlock: number
  ): Promise<UpgradeInfo | null> {
    const upgradeHandlerInterface = new ethers.utils.Interface([
      'event UpgradeStarted(bytes32 indexed _id, tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt) _proposal)'
    ])

    // Event signature hash
    const eventSig = '0x71a79729ed8b7db17b27c5dfe0ae24cf41d52b08c8dfc82592fc7db23010c879' // UpgradeStarted
    // Get logs with indexed upgradeId
    const logs = await this.l1Provider.getLogs({
      address: PROTOCOL_UPGRADE_HANDLER_ADDRESS,
      topics: [eventSig, ethers.utils.hexZeroPad(upgradeId, 32)],
      fromBlock
    })

    if (logs.length > 0) {
      const parsedLog = upgradeHandlerInterface.parseLog(logs[0])
      return {
        id: parsedLog.args._id,
        proposal: parsedLog.args._proposal,
        blockNumber: logs[0].blockNumber,
        txHash: logs[0].transactionHash
      }
    }

    return null
  }

  /**
   * Get the upgrade state from L1
   */
  private async getUpgradeState(upgradeId: string): Promise<UpgradeState> {
    const upgradeHandlerInterface = new ethers.utils.Interface([
      'function upgradeState(bytes32 _id) view returns (uint8)'
    ])

    const data = upgradeHandlerInterface.encodeFunctionData('upgradeState', [upgradeId])

    const result = await this.l1Provider.call({
      to: PROTOCOL_UPGRADE_HANDLER_ADDRESS,
      data
    })

    const [state] = ethers.utils.defaultAbiCoder.decode(['uint8'], result)
    return state
  }

  /**
   * Get detailed upgrade status from L1
   */
  private async getUpgradeStatus(upgradeId: string): Promise<UpgradeStatusInfo | null> {
    const upgradeHandlerInterface = new ethers.utils.Interface([
      'function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)'
    ])

    const data = upgradeHandlerInterface.encodeFunctionData('upgradeStatus', [upgradeId])

    try {
      const result = await this.l1Provider.call({
        to: PROTOCOL_UPGRADE_HANDLER_ADDRESS,
        data
      })

      const [
        creationTimestamp, 
        securityCouncilApprovalTimestamp, 
        guardiansApproval, 
        guardiansExtendedLegalVeto, 
        executed
      ] = ethers.utils.defaultAbiCoder.decode(
        ['uint48', 'uint48', 'bool', 'bool', 'bool'], 
        result
      )

      return {
        creationTimestamp: Number(creationTimestamp),
        securityCouncilApprovalTimestamp: Number(securityCouncilApprovalTimestamp),
        guardiansApproval,
        guardiansExtendedLegalVeto,
        executed
      }
    } catch (error) {
      console.log(chalk.yellow("Error getting upgrade status"))
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
    const blockDiff = Math.floor((currentBlockData.timestamp - timestamp) / blockTimeEstimate)
    const estimatedBlock = Math.max(1, currentBlock - blockDiff)

    return estimatedBlock
  }

  /**
   * Add L2 information to output array
   */
  private addL2InfoToOutput(
    output: string[], 
    proposalInfo: ProposalInfo, 
    proposalState: ProposalState
  ): void {
    // Header
    output.push(chalk.bold.blue("=".repeat(50)))
    output.push(chalk.bold.blue("ZKsync Governance Proposal Analysis"))
    output.push(chalk.bold.blue("=".repeat(50)))

    // Proposal ID and basic info
    output.push(chalk.bold("\nProposal ID: ") + proposalInfo.proposalId)
    output.push(chalk.bold("Proposer: ") + proposalInfo.proposer)
    output.push(chalk.bold("Description: ") + proposalInfo.description)

    // Proposal state on L2
    output.push(chalk.bold("\nL2 State: ") + this.formatProposalState(proposalState))

    // Vote schedule
    const voteStart = new Date(proposalInfo.voteStart.toNumber() * 1000)
    const voteEnd = new Date(proposalInfo.voteEnd.toNumber() * 1000)
    output.push(chalk.bold("\nVoting period: "))
    output.push(`  Start: ${voteStart.toISOString()} (${this.formatTimeDistance(voteStart)})`)
    output.push(`  End: ${voteEnd.toISOString()} (${this.formatTimeDistance(voteEnd)})`)

    // Proposal targets and calldata
    output.push(chalk.bold("\nProposal Targets:"))
    for (let i = 0; i < proposalInfo.targets.length; i++) {
      output.push(chalk.cyan(`\nTarget ${i+1}: ${proposalInfo.targets[i]}`))
      output.push(`  Value: ${ethers.utils.formatEther(proposalInfo.values[i])} ETH`)
      output.push(`  Signature: ${proposalInfo.signatures[i] || '(none)'}`)
      output.push(`  Calldata: ${this.formatCalldata(proposalInfo.calldatas[i])}`)
    }
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
    l2ExecutionTimestamp: number
  ): void {
    // Add L1 Message Hash
    output.push(chalk.bold.green("\n" + "=".repeat(50)))
    output.push(chalk.bold.green("L1 Upgrade Information"))
    output.push(chalk.bold.green("=".repeat(50)))

    output.push(chalk.bold("\nL1 Message Hash: ") + l1MessageInfo.hash)

    // Show estimated arrival time on L1
    const estimatedL1Arrival = new Date((l2ExecutionTimestamp + EXECUTION_DELAY) * 1000)
    output.push(chalk.bold("Estimated L1 Arrival: ") + 
      `${estimatedL1Arrival.toISOString()} (${this.formatTimeDistance(estimatedL1Arrival)})`)

    // If upgrade was found on L1
    if (upgradeInfo) {
      output.push(chalk.bold("\nL1 Upgrade Started: ") + "Yes")

      // Check if targets match between L2 and L1
      output.push(chalk.bold("\nProposal Calls from L1:"))
      for (let i = 0; i < upgradeInfo.proposal.calls.length; i++) {
        const call = upgradeInfo.proposal.calls[i]
        output.push(chalk.cyan(`\nTarget ${i+1}: ${call.target}`))
        output.push(`  Value: ${ethers.utils.formatEther(call.value)} ETH`)
        output.push(`  Calldata: ${this.formatCalldata(call.data)}`)
      }

      output.push(chalk.bold("\nExecutor: ") + upgradeInfo.proposal.executor)

      // Show upgrade state and status
      if (upgradeState !== null) {
        output.push(chalk.bold("\nL1 Upgrade State: ") + this.formatUpgradeState(upgradeState))
      }

      if (upgradeStatus) {
        output.push(chalk.bold("\nUpgrade Timeline:"))

        const creationTime = new Date(upgradeStatus.creationTimestamp * 1000)
        output.push(`  Creation: ${creationTime.toISOString()} (${this.formatTimeDistance(creationTime)})`)

        // Calculate and show time periods based on the upgrade state
        const vetoEndTime = new Date(
          (upgradeStatus.creationTimestamp + 
            (upgradeStatus.guardiansExtendedLegalVeto ? EXTENDED_LEGAL_VETO_PERIOD : STANDARD_LEGAL_VETO_PERIOD)
          ) * 1000
        )
        output.push(`  Legal Veto Period End: ${vetoEndTime.toISOString()} (${this.formatTimeDistance(vetoEndTime)})`)

        if (upgradeStatus.securityCouncilApprovalTimestamp > 0) {
          const scApprovalTime = new Date(upgradeStatus.securityCouncilApprovalTimestamp * 1000)
          output.push(`  Security Council Approval: ${scApprovalTime.toISOString()} (${this.formatTimeDistance(scApprovalTime)})`)

          const readyTime = new Date((upgradeStatus.securityCouncilApprovalTimestamp + UPGRADE_DELAY_PERIOD) * 1000)
          output.push(`  Ready for Execution: ${readyTime.toISOString()} (${this.formatTimeDistance(readyTime)})`)
        } else {
          // If Security Council didn't approve, show waiting period and guardian approval info
          const waitingEndTime = new Date(
            (upgradeStatus.creationTimestamp + 
              (upgradeStatus.guardiansExtendedLegalVeto ? EXTENDED_LEGAL_VETO_PERIOD : STANDARD_LEGAL_VETO_PERIOD) + 
              UPGRADE_WAIT_OR_EXPIRE_PERIOD
            ) * 1000
          )

          if (upgradeStatus.guardiansApproval) {
            output.push(`  Guardians Approval: Yes`)
            output.push(`  Ready for Execution: ${waitingEndTime.toISOString()} (${this.formatTimeDistance(waitingEndTime)})`)
          } else {
            output.push(`  Guardians Approval: No`)
            output.push(`  Expires If Not Approved By: ${waitingEndTime.toISOString()} (${this.formatTimeDistance(waitingEndTime)})`)
          }
        }

        // Additional status flags
        output.push(chalk.bold("\nStatus Flags:"))
        output.push(`  Extended Legal Veto: ${upgradeStatus.guardiansExtendedLegalVeto ? 'Yes' : 'No'}`)
        output.push(`  Executed: ${upgradeStatus.executed ? 'Yes' : 'No'}`)
      }
    } else {
      output.push(chalk.yellow("\nL1 Upgrade not yet started or not found"))
    }
  }

  /**
   * Format a proposal state with color
   */
  private formatProposalState(state: ProposalState): string {
    const stateNames = [
      "Pending", "Active", "Canceled", "Defeated", 
      "Succeeded", "Queued", "Expired", "Executed"
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
      "None", "LegalVetoPeriod", "Waiting", "ExecutionPending", 
      "Ready", "Expired", "Done"
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
   * Format calldata for display
   */
  private formatCalldata(data: string): string {
    if (!data || data === '0x') return '(none)'
    if (data.length <= 66) return data
    return `${data.substring(0, 62)}...`
  }

  /**
   * Display the output in terminal
   */
  private displayOutput(output: string[]): void {
    console.log(output.join('\n'))
  }

  /**
   * Write output to markdown file
   */
  private async writeToMarkdownFile(output: string[]): Promise<void> {
    // Convert chalk colored strings to markdown
    const markdownOutput = output.map(line => {
      // Remove chalk color codes for markdown
      return line.replace(/\x1b\[[0-9;]*m/g, '')
    })

    // Join and write to file
    fs.writeFileSync(path.resolve(this.outputPath), markdownOutput.join('\n'))
  }
}
