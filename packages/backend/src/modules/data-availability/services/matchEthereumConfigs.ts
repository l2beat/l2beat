import type { EthereumDaTrackingConfig } from '@l2beat/config'

/** Who sent a blob transaction, where to, and the topics of the events it emitted */
export interface EthereumBlobTx {
  inbox: string
  sequencer: string
  topics: string[]
}

/**
 * The configs that claim a blob transaction of `blockNumber`. Projects change
 * inboxes and sequencers over time, so only configs in force at that block
 * count
 */
export function matchEthereumConfigs<T extends EthereumDaTrackingConfig>(
  configs: T[],
  blockNumber: number,
  tx: EthereumBlobTx,
): T[] {
  return configs.filter(
    (c) => isInForceAt(c, blockNumber) && matchEthereumProject(tx, c),
  )
}

function isInForceAt(config: EthereumDaTrackingConfig, blockNumber: number) {
  return (
    config.sinceBlock <= blockNumber &&
    (config.untilBlock === undefined || blockNumber <= config.untilBlock)
  )
}

export function matchEthereumProject(
  tx: EthereumBlobTx,
  config: EthereumDaTrackingConfig,
) {
  if (config.topics) {
    const hasTopicMatch = config.topics.some((topic) =>
      tx.topics.includes(topic.toLowerCase()),
    )

    if (hasTopicMatch) {
      return true
    }
  }

  const hasInboxMatch = config.inbox.toLowerCase() === tx.inbox.toLowerCase()

  if (!config.sequencers || config.sequencers.length === 0) {
    return hasInboxMatch
  }

  const hasMatchingSequencer = config.sequencers.some(
    (sequencer) => sequencer.toLowerCase() === tx.sequencer.toLowerCase(),
  )

  return hasInboxMatch && hasMatchingSequencer
}
