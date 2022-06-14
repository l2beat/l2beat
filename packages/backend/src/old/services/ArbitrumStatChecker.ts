import { utils } from 'ethers'

import { ARBITRUM_INBOX, ARBITRUM_SEQUENCER_INBOX } from '../constants'
import { LogApi } from './api/LogApi'

export interface ArbitrumStats {
  sequencerBatches7d: number
  messageCount7d: number
}

const coder = new utils.Interface([
  'event InboxMessageDelivered(uint256 indexed messageNum, bytes data)',
  'event InboxMessageDeliveredFromOrigin(uint256 indexed messageNum)',
  `event SequencerBatchDelivered(
    uint256 indexed firstMessageNum,
    bytes32 indexed beforeAcc,
    uint256 newMessageCount,
    bytes32 afterAcc,
    bytes transactions,
    uint256[] lengths,
    uint256[] sectionsMetadata,
    uint256 seqBatchIndex,
    address sequencer,
  )`,
  `event SequencerBatchDeliveredFromOrigin(
    uint256 indexed firstMessageNum,
    bytes32 indexed beforeAcc,
    uint256 newMessageCount,
    bytes32 afterAcc,
    uint256 seqBatchIndex,
  )`,
])

function getTopics() {
  return [
    'InboxMessageDelivered',
    'InboxMessageDeliveredFromOrigin',
    'SequencerBatchDelivered',
    'SequencerBatchDeliveredFromOrigin',
  ].map(
    (name) => coder.encodeFilterTopics(coder.getEvent(name), [])[0] as string,
  )
}

export class ArbitrumStatChecker {
  constructor(private logApi: LogApi) {}

  async getStats(fromBlock: number, toBlock: number): Promise<ArbitrumStats> {
    const topics = getTopics()

    const logs = await this.logApi.getLogs(
      {
        address: [ARBITRUM_INBOX, ARBITRUM_SEQUENCER_INBOX],
        fromBlock,
        toBlock,
        topics: [topics],
      },
      'Arbitrum transactions',
    )
    const events = logs.map((log) => coder.parseLog(log))

    let batchCount = 0
    let messageCount = 0
    let minMessageCount = Infinity
    let maxMessageCount = -Infinity
    for (const event of events) {
      if (
        event.name === 'InboxMessageDelivered' ||
        event.name === 'InboxMessageDeliveredFromOrigin'
      ) {
        messageCount += 1
      } else if (
        event.name === 'SequencerBatchDelivered' ||
        event.name === 'SequencerBatchDeliveredFromOrigin'
      ) {
        batchCount += 1
        const newMessageCount = event.args.newMessageCount.toNumber()
        minMessageCount = Math.min(minMessageCount, newMessageCount)
        maxMessageCount = Math.max(maxMessageCount, newMessageCount)
      }
    }

    messageCount += maxMessageCount - minMessageCount

    return {
      sequencerBatches7d: batchCount,
      messageCount7d: messageCount,
    }
  }
}
