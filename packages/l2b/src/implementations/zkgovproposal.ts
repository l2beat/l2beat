// packages/l2b/src/implementations/zkgovproposal.ts
import { IProvider } from '@l2beat/discovery'
import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { ethers } from 'ethers'
import { getProvider } from './common/GetProvider'
import { promises as fs } from 'fs'

interface ZkGovProposalConfig {
  l2RpcUrl: string
  l1RpcUrl: string
  executionDelay: number
  outputPath?: string
}

interface ProposalCreatedEvent {
  proposalId: string
  proposer: string
  targets: string[]
  values: bigint[]
  signatures: string[]
  calldatas: string[]
  voteStart: bigint
  voteEnd: bigint
  description: string
}

interface ProposalData {
  l2: {
    proposalId: string
    proposer: string
    targets: string[]
    values: bigint[]
    signatures: string[]
    calldatas: string[]
    voteStart: bigint
    voteEnd: bigint
    description: string
    state: string
    executedTx?: string
    executedBlock?: number
    executedTimestamp?: number
  },
  l1?: {
    hash: string
    upgradeState: string
    status: {
      creationTimestamp: number
      securityCouncilApprovalTimestamp: number
      guardiansApproval: boolean
      guardiansExtendedLegalVeto: boolean
      executed: boolean
    }
    calls: {
      target: string
      value: bigint
      data: string
    }[]
    executor?: string
  }
}

export class ZkGovProposalAnalyzer {
  private l2Provider: IProvider | undefined
  private l1Provider: IProvider | undefined
  private outputContent: string[] = []

  // Contract addresses and constants
  private readonly ZK_PROTOCOL_GOVERNOR = EthereumAddress('0x76705327e682F2d96943280D99464Ab61219e34f')
  private readonly L1_MESSENGER = EthereumAddress('0x0000000000000000000000000000000000008008')
  private readonly PROTOCOL_UPGRADE_HANDLER = EthereumAddress('0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3')

  // Contract event signatures
  private readonly EVENT_PROPOSAL_CREATED = '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0'
  private readonly EVENT_PROPOSAL_EXECUTED = '0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f'
  private readonly EVENT_L1_MESSAGE_SENT = '0x3a421b27a721a0764e8736f253ec148059d64acef58292558fe637220f75881a'
  private readonly EVENT_UPGRADE_STARTED = '0x71a79729ed8b7db17b27c5dfe0ae24cf41d52b08c8dfc82592fc7db23010c879'
  private readonly EVENT_UPGRADE_LEGAL_VETO_EXTENDED = '0x6679375a2761fa72f4163ccf9a92a514bfd3adff8eb1f2f17256f25834dc46ca'

  // Proposal states
  private readonly L2_PROPOSAL_STATES = [
    'Pending',
    'Active',
    'Canceled',
    'Defeated',
    'Succeeded',
    'Queued',
    'Expired',
    'Executed'
  ]

  private readonly L1_UPGRADE_STATES = [
    'None',
    'LegalVetoPeriod',
    'Waiting',
    'ExecutionPending',
    'Ready',
    'Expired',
    'Done'
  ]

  // Time constants (in seconds)
  private readonly STANDARD_LEGAL_VETO_PERIOD = 3 * 24 * 60 * 60 // 3 days
  private readonly EXTENDED_LEGAL_VETO_PERIOD = 7 * 24 * 60 * 60 // 7 days
  private readonly UPGRADE_DELAY_PERIOD = 1 * 24 * 60 * 60 // 1 day
  private readonly UPGRADE_WAIT_OR_EXPIRE_PERIOD = 30 * 24 * 60 * 60 // 30 days

  constructor(private config: ZkGovProposalConfig) {}

  async analyzeProposal(proposalId: string): Promise<void> {
    try {
      this.log(chalk.blue(`🔍 Analyzing ZKsync governance proposal: ${proposalId}`))

      // Initialize providers
      this.l2Provider = await getProvider(this.config.l2RpcUrl)
      this.l1Provider = await getProvider(this.config.l1RpcUrl)

      // Get the proposal data
      const proposalData = await this.gatherProposalData(proposalId)

      // Format and display the data
      await this.displayProposalData(proposalData)

      // Output to markdown if requested
      if (this.config.outputPath) {
        await this.saveToMarkdown(this.config.outputPath)
      }

    } catch (error) {
      this.log(chalk.red(`❌ Error analyzing proposal: ${error instanceof Error ? error.message : String(error)}`))
    }
  }

  private async gatherProposalData(proposalId: string): Promise<ProposalData> {
    // Initialize result object
    const proposalData: ProposalData = {
      l2: {
        proposalId,
        proposer: '',
        targets: [],
        values: [],
        signatures: [],
        calldatas: [],
        voteStart: 0n,
        voteEnd: 0n,
        description: '',
        state: ''
      }
    }

    // Get proposal creation event
    this.log(chalk.yellow('⏳ Fetching proposal creation details from L2...'))
    const proposalCreated = await this.getProposalCreatedEvent(proposalId)
    if (!proposalCreated) {
      throw new Error(`Proposal with ID ${proposalId} not found on ZKsync Era`)
    }

    // Update L2 data
    proposalData.l2 = {
      ...proposalData.l2,
      ...proposalCreated
    }

    // Get proposal state
    proposalData.l2.state = await this.getProposalState(proposalId)
    this.log(chalk.green(`✅ Found proposal in state: ${chalk.cyan(proposalData.l2.state)}`))

    // If the proposal is executed, track the execution transaction
    if (proposalData.l2.state === 'Executed') {
      this.log(chalk.yellow('⏳ Fetching execution details...'))
      const executionData = await this.getProposalExecutionData(proposalId)

      if (executionData) {
        proposalData.l2.executedTx = executionData.transactionHash
        proposalData.l2.executedBlock = executionData.blockNumber
        proposalData.l2.executedTimestamp = executionData.timestamp

        // Check if the proposal was sent to L1
        const l1MessageData = await this.getL1MessageData(executionData.transactionHash)

        if (l1MessageData) {
          this.log(chalk.green(`✅ Found L1 message in execution transaction`))

          // Wait for the L1 proposal to be processed
          const l1ExecutionTime = executionData.timestamp + (this.config.executionDelay * 60 * 60)
          const currentTime = Math.floor(Date.now() / 1000)

          if (currentTime < l1ExecutionTime) {
            this.log(chalk.yellow(`⏳ L1 processing will happen at ${new Date(l1ExecutionTime * 1000).toISOString()}`))
            this.log(chalk.yellow(`⏳ Remaining time: ${formatTimeDelta(l1ExecutionTime - currentTime)}`))
          } else {
            // Get L1 upgrade data
            this.log(chalk.yellow(`⏳ Fetching L1 upgrade data for hash: ${l1MessageData.hash}`))
            const l1UpgradeData = await this.getL1UpgradeData(l1MessageData.hash)

            if (l1UpgradeData) {
              proposalData.l1 = {
                hash: l1MessageData.hash,
                upgradeState: this.L1_UPGRADE_STATES[l1UpgradeData.state],
                status: l1UpgradeData.status,
                calls: l1UpgradeData.proposal.calls,
                executor: l1UpgradeData.proposal.executor
              }
              this.log(chalk.green(`✅ Found L1 upgrade in state: ${chalk.cyan(proposalData.l1.upgradeState)}`))
            } else {
              this.log(chalk.yellow(`⚠️ No L1 upgrade found for hash: ${l1MessageData.hash}`))
            }
          }
        } else {
          this.log(chalk.yellow(`⚠️ No L1 message found in execution transaction - this is likely an L2-only proposal`))
        }
      }
    }

    return proposalData
  }

  private async getProposalCreatedEvent(proposalId: string): Promise<ProposalCreatedEvent | null> {
    if (!this.l2Provider) throw new Error('L2 provider not initialized')

    // Fetch all ProposalCreated events
    const logs = await this.l2Provider.getLogs(
      this.ZK_PROTOCOL_GOVERNOR,
      [this.EVENT_PROPOSAL_CREATED]
    )

    // Parse the logs
    for (const log of logs) {
      // Need to decode the log data manually since the proposalId is not indexed
      const data = log.data
      const decodedData = ethers.utils.defaultAbiCoder.decode(
        [
          'uint256', // proposalId
          'address', // proposer
          'address[]', // targets
          'uint256[]', // values
          'string[]', // signatures
          'bytes[]', // calldatas
          'uint256', // voteStart
          'uint256', // voteEnd
          'string' // description
        ],
        data
      )

      // Check if this is the proposal we're looking for
      if (decodedData[0].toString() === proposalId) {
        return {
          proposalId: decodedData[0].toString(),
          proposer: decodedData[1],
          targets: decodedData[2],
          values: decodedData[3],
          signatures: decodedData[4],
          calldatas: decodedData[5],
          voteStart: decodedData[6],
          voteEnd: decodedData[7],
          description: decodedData[8]
        }
      }
    }

    return null
  }

  private async getProposalState(proposalId: string): Promise<string> {
    if (!this.l2Provider) throw new Error('L2 provider not initialized')

    // Call the state function on the governor contract
    const stateResult = await this.l2Provider.callMethod<number>(
      this.ZK_PROTOCOL_GOVERNOR,
      'function state(uint256 _proposalId) view returns (uint8)',
      [proposalId]
    )

    return stateResult !== undefined 
      ? this.L2_PROPOSAL_STATES[stateResult] 
      : 'Unknown'
  }

  private async getProposalExecutionData(proposalId: string): Promise<{
    transactionHash: string,
    blockNumber: number,
    timestamp: number
  } | null> {
    if (!this.l2Provider) throw new Error('L2 provider not initialized')

    // Fetch all ProposalExecuted events for this proposal
    const logs = await this.l2Provider.getLogs(
      this.ZK_PROTOCOL_GOVERNOR,
      [this.EVENT_PROPOSAL_EXECUTED]
    )

    // Find the event for this proposal
    for (const log of logs) {
      const data = log.data
      const decodedData = ethers.utils.defaultAbiCoder.decode(
        ['uint256'], // proposalId
        data
      )

      if (decodedData[0].toString() === proposalId) {
        // Get the block timestamp
        const block = await this.l2Provider.getBlock(log.blockNumber)
        if (!block) throw new Error(`Block ${log.blockNumber} not found`)

        return {
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
          timestamp: block.timestamp
        }
      }
    }

    return null
  }

  private async getL1MessageData(transactionHash: string): Promise<{
    hash: string,
    message: string
  } | null> {
    if (!this.l2Provider) throw new Error('L2 provider not initialized')

    // Fetch the transaction receipt to get logs
    const tx = await this.l2Provider.getTransaction(Hash256(transactionHash))
    if (!tx) return null

    // Get L1MessageSent events from the transaction
    const logs = await this.l2Provider.getLogs(
      this.L1_MESSENGER,
      [this.EVENT_L1_MESSAGE_SENT]
    )

    // Filter logs from this transaction
    const txLogs = logs.filter(log => log.transactionHash === transactionHash)

    if (txLogs.length === 0) return null

    // Get the hash from the event (this will be our L1 proposal ID)
    const log = txLogs[0]
    const topics = log.topics

    // The hash is the second topic (index 1)
    const hash = topics[1]

    return {
      hash,
      message: log.data
    }
  }

  private async getL1UpgradeData(hash: string): Promise<{
    state: number,
    status: {
      creationTimestamp: number,
      securityCouncilApprovalTimestamp: number,
      guardiansApproval: boolean,
      guardiansExtendedLegalVeto: boolean,
      executed: boolean
    },
    proposal: {
      calls: Array<{
        target: string,
        value: bigint,
        data: string
      }>,
      executor: string
    }
  } | null> {
    if (!this.l1Provider) throw new Error('L1 provider not initialized')

    // Get the upgrade state
    const stateResult = await this.l1Provider.callMethod<number>(
      this.PROTOCOL_UPGRADE_HANDLER,
      'function upgradeState(bytes32 _id) view returns (uint8)',
      [hash]
    )

    if (stateResult === undefined || stateResult === 0) return null

    // Get the upgrade status
    const statusResult = await this.l1Provider.callMethod<[
      number, // creationTimestamp
      number, // securityCouncilApprovalTimestamp
      boolean, // guardiansApproval
      boolean, // guardiansExtendedLegalVeto
      boolean // executed
    ]>(
      this.PROTOCOL_UPGRADE_HANDLER,
      'function upgradeStatus(bytes32 upgradeId) view returns (uint48 creationTimestamp, uint48 securityCouncilApprovalTimestamp, bool guardiansApproval, bool guardiansExtendedLegalVeto, bool executed)',
      [hash]
    )

    if (!statusResult) return null

    // Get the upgrade proposal details from the UpgradeStarted event
    const logs = await this.l1Provider.getLogs(
      this.PROTOCOL_UPGRADE_HANDLER,
      [[this.EVENT_UPGRADE_STARTED, hash]]
    )

    if (logs.length === 0) return null

    // Parse the event data to get the proposal details
    const log = logs[0]
    const data = log.data

    // The format is complex with nested tuples, so we decode in stages
    const decodedData = ethers.utils.defaultAbiCoder.decode(
      ['tuple(tuple(address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt)'],
      data
    )

    const proposalData = decodedData[0]
    const calls = proposalData.calls.map((call: any) => ({
      target: call.target,
      value: call.value,
      data: call.data
    }))

    return {
      state: stateResult,
      status: {
        creationTimestamp: statusResult[0],
        securityCouncilApprovalTimestamp: statusResult[1],
        guardiansApproval: statusResult[2],
        guardiansExtendedLegalVeto: statusResult[3],
        executed: statusResult[4]
      },
      proposal: {
        calls,
        executor: proposalData.executor
      }
    }
  }

  private async displayProposalData(data: ProposalData): Promise<void> {
    // Basic proposal info
    this.log('\n' + chalk.bgBlue.white(' PROPOSAL DETAILS '))
    this.log(`${chalk.yellow('Proposal ID:')} ${data.l2.proposalId}`)
    this.log(`${chalk.yellow('Proposer:')} ${data.l2.proposer}`)
    this.log(`${chalk.yellow('Description:')} ${data.l2.description}`)

    // Vote timing
    this.log(`${chalk.yellow('Vote Start:')} ${formatDate(Number(data.l2.voteStart))}`)
    this.log(`${chalk.yellow('Vote End:')} ${formatDate(Number(data.l2.voteEnd))}`)

    // L2 State
    this.log('\n' + chalk.bgBlue.white(' L2 STATE '))
    this.log(`${chalk.yellow('Current State:')} ${this.getStateWithColor(data.l2.state)}`)

    if (data.l2.executedTx) {
      this.log(`${chalk.yellow('Executed at:')} ${formatDate(data.l2.executedTimestamp || 0)}`)
      this.log(`${chalk.yellow('Execution Tx:')} ${data.l2.executedTx}`)
    }

    // L1 State (if present)
    if (data.l1) {
      this.log('\n' + chalk.bgBlue.white(' L1 STATE '))
      this.log(`${chalk.yellow('L1 Hash:')} ${data.l1.hash}`)
      this.log(`${chalk.yellow('Upgrade State:')} ${this.getStateWithColor(data.l1.upgradeState)}`)

      const status = data.l1.status
      this.log(`${chalk.yellow('Creation Timestamp:')} ${formatDate(status.creationTimestamp)}`)

      if (status.securityCouncilApprovalTimestamp > 0) {
        this.log(`${chalk.yellow('Security Council Approval:')} ${formatDate(status.securityCouncilApprovalTimestamp)}`)
      }

      this.log(`${chalk.yellow('Guardians Approval:')} ${status.guardiansApproval ? '✅' : '❌'}`)
      this.log(`${chalk.yellow('Extended Legal Veto:')} ${status.guardiansExtendedLegalVeto ? '✅' : '❌'}`)
      this.log(`${chalk.yellow('Executed:')} ${status.executed ? '✅' : '❌'}`)

      // Calculate and show timing information
      this.displayTimingInfo(data.l1)
    }

    // Proposal targets and calldata
    this.log('\n' + chalk.bgBlue.white(' PROPOSAL ACTIONS '))
    for (let i = 0; i < data.l2.targets.length; i++) {
      this.log(`\n${chalk.yellow(`Action #${i+1}:`)}`)
      this.log(`${chalk.yellow('Target:')} ${data.l2.targets[i]}`)
      this.log(`${chalk.yellow('Value:')} ${data.l2.values[i].toString()}`)
      this.log(`${chalk.yellow('Signature:')} ${data.l2.signatures[i]}`)
      this.log(`${chalk.yellow('Calldata:')} ${this.formatCalldata(data.l2.calldatas[i])}`)
    }

    // Verification of L1 vs L2 calldata if applicable
    if (data.l1 && data.l1.calls.length > 0) {
      const callsMatch = this.verifyCallsMatch(data.l2, data.l1)
      this.log(`\n${chalk.yellow('L1/L2 Calldata Match:')} ${callsMatch ? chalk.green('✅ Verified') : chalk.red('❌ Mismatch')}`)
    }
  }

  private displayTimingInfo(l1Data: NonNullable<ProposalData['l1']>): void {
    const now = Math.floor(Date.now() / 1000)
    const status = l1Data.status

    if (!status.executed) {
      let nextPhaseTime: number | null = null
      let nextPhase: string | null = null

      // Calculate remaining time based on the upgrade state
      switch (l1Data.upgradeState) {
        case 'LegalVetoPeriod':
          const vetoEndTime = status.creationTimestamp + (
            status.guardiansExtendedLegalVeto 
              ? this.EXTENDED_LEGAL_VETO_PERIOD 
              : this.STANDARD_LEGAL_VETO_PERIOD
          )
          nextPhaseTime = vetoEndTime
          nextPhase = 'Waiting'
          break

        case 'Waiting':
          const waitingEndTime = status.creationTimestamp + (
            status.guardiansExtendedLegalVeto 
              ? this.EXTENDED_LEGAL_VETO_PERIOD 
              : this.STANDARD_LEGAL_VETO_PERIOD
          ) + this.UPGRADE_WAIT_OR_EXPIRE_PERIOD

          if (status.guardiansApproval) {
            nextPhaseTime = waitingEndTime
            nextPhase = 'ExecutionPending'
          } else {
            nextPhaseTime = waitingEndTime
            nextPhase = 'Expired'
          }
          break

        case 'ExecutionPending':
          if (status.securityCouncilApprovalTimestamp > 0) {
            nextPhaseTime = status.securityCouncilApprovalTimestamp + this.UPGRADE_DELAY_PERIOD
          } else if (status.guardiansApproval) {
            // Calculate from the waiting period end
            const waitingEndTime = status.creationTimestamp + (
              status.guardiansExtendedLegalVeto 
                ? this.EXTENDED_LEGAL_VETO_PERIOD 
                : this.STANDARD_LEGAL_VETO_PERIOD
            ) + this.UPGRADE_WAIT_OR_EXPIRE_PERIOD

            nextPhaseTime = waitingEndTime + this.UPGRADE_DELAY_PERIOD
          }
          nextPhase = 'Ready'
          break
      }

      if (nextPhaseTime && nextPhase) {
        if (now < nextPhaseTime) {
          this.log(`${chalk.yellow('Next Phase:')} ${this.getStateWithColor(nextPhase)} in ${formatTimeDelta(nextPhaseTime - now)}`)
          this.log(`${chalk.yellow('Estimated Time:')} ${formatDate(nextPhaseTime)}`)
        } else {
          this.log(`${chalk.yellow('Current Status:')} Ready for next phase (${this.getStateWithColor(nextPhase)})`)
        }
      }
    }
  }

  private getStateWithColor(state: string): string {
    switch (state) {
      case 'Pending':
      case 'LegalVetoPeriod':
      case 'Waiting':
      case 'ExecutionPending':
        return chalk.yellow(state)
      case 'Active':
        return chalk.cyan(state)
      case 'Canceled':
      case 'Defeated':
      case 'Expired':
        return chalk.red(state)
      case 'Succeeded':
      case 'Ready':
        return chalk.green(state)
      case 'Queued':
        return chalk.blue(state)
      case 'Executed':
      case 'Done':
        return chalk.green(state)
      default:
        return chalk.gray(state)
    }
  }

  private formatCalldata(data: string): string {
    // Truncate long calldata for display
    if (data.length > 66) {
      return `${data.substring(0, 66)}...`
    }
    return data
  }

  private verifyCallsMatch(l2Data: ProposalData['l2'], l1Data: NonNullable<ProposalData['l1']>): boolean {
    // Check if the number of calls match
    if (l2Data.targets.length !== l1Data.calls.length) {
      return false
    }

    // Check each call
    for (let i = 0; i < l2Data.targets.length; i++) {
      if (
        l2Data.targets[i].toLowerCase() !== l1Data.calls[i].target.toLowerCase() ||
        l2Data.values[i] !== l1Data.calls[i].value ||
        l2Data.calldatas[i] !== l1Data.calls[i].data
      ) {
        return false
      }
    }

    return true
  }

  private log(message: string): void {
    console.log(message)
    this.outputContent.push(this.stripAnsiCodes(message))
  }

  private stripAnsiCodes(text: string): string {
    // Remove ANSI color codes for markdown output
    return text.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '')
  }

  private async saveToMarkdown(filePath: string): Promise<void> {
    try {
      await fs.writeFile(filePath, this.outputContent.join('\n'))
      console.log(chalk.green(`✅ Output saved to ${filePath}`))
    } catch (error) {
      console.error(chalk.red(`Error saving to file: ${error instanceof Error ? error.message : String(error)}`))
    }
  }
}

// Helper functions for common operations
function formatDate(timestamp: number): string {
  if (!timestamp) return 'N/A'
  return new Date(timestamp * 1000).toLocaleString()
}

function formatTimeDelta(seconds: number): string {
  if (seconds <= 0) return 'Already passed'

  const days = Math.floor(seconds / (24 * 60 * 60))
  seconds -= days * 24 * 60 * 60

  const hours = Math.floor(seconds / (60 * 60))
  seconds -= hours * 60 * 60

  const minutes = Math.floor(seconds / 60)
  seconds -= minutes * 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)

  return parts.join(' ')
}
