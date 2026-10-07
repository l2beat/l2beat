import { providers } from 'ethers'
import { type EthereumDaTracking, matchDaTracking } from './daTracking'

interface RpcBlock {
  number: string
  transactions: Array<{
    type: string
    hash: string
    from: string
    to?: string
    blobVersionedHashes?: string[]
  }>
}

export interface BlobSender {
  address: string
  txCount: number
  blobCount: number
  firstBlock: number
  lastBlock: number
  receivers: Map<string, number> // to address -> count
  attributedBlobs: Map<string, number> // DA-tracked project -> blob count
  unattributedBlobs: number
}

export interface BlobSendersResult {
  senders: BlobSender[]
  // false when the RPC refused eth_getLogs, so topic-tracked projects
  // (e.g. Aztec) could not be matched
  topicsChecked: boolean
}

export async function getBlobSenders(
  rpcUrl: string,
  blockCount: number,
  daTracking: EthereumDaTracking[],
  onProgress?: (current: number, total: number, senderCount: number) => void,
): Promise<BlobSendersResult> {
  const provider = new providers.StaticJsonRpcProvider(rpcUrl)
  const latestBlock = await provider.getBlockNumber()
  const fromBlock = latestBlock - blockCount + 1
  const { topicsByTx, topicsChecked } = await getTrackedTopicsByTx(
    provider,
    daTracking,
    fromBlock,
    latestBlock,
  )

  const senders = new Map<string, BlobSender>()
  const batchSize = 20

  for (let start = fromBlock; start <= latestBlock; start += batchSize) {
    const end = Math.min(start + batchSize - 1, latestBlock)
    const blockPromises: Promise<RpcBlock | null>[] = []

    for (let blockNum = start; blockNum <= end; blockNum++) {
      blockPromises.push(
        provider.send('eth_getBlockByNumber', [
          '0x' + blockNum.toString(16),
          true,
        ]),
      )
    }

    const blocks = await Promise.all(blockPromises)

    for (const block of blocks) {
      if (!block?.transactions) continue

      for (const tx of block.transactions) {
        // Type 3 = blob transaction (EIP-4844)
        if (tx.type !== '0x3') continue

        const from = tx.from.toLowerCase()
        const to = tx.to?.toLowerCase() ?? ''
        const blockNum = Number.parseInt(block.number, 16)
        const blobCount = tx.blobVersionedHashes?.length ?? 0
        const projects = matchDaTracking(
          {
            from,
            to,
            blockNumber: blockNum,
            topics: topicsByTx.get(tx.hash.toLowerCase()) ?? new Set(),
          },
          daTracking,
        )

        let existing = senders.get(from)
        if (existing) {
          existing.txCount++
          existing.blobCount += blobCount
          existing.firstBlock = Math.min(existing.firstBlock, blockNum)
          existing.lastBlock = Math.max(existing.lastBlock, blockNum)
          existing.receivers.set(to, (existing.receivers.get(to) ?? 0) + 1)
        } else {
          const receivers = new Map<string, number>()
          receivers.set(to, 1)
          existing = {
            address: from,
            txCount: 1,
            blobCount,
            firstBlock: blockNum,
            lastBlock: blockNum,
            receivers,
            attributedBlobs: new Map(),
            unattributedBlobs: 0,
          }
          senders.set(from, existing)
        }
        if (projects.length === 0) {
          existing.unattributedBlobs += blobCount
        }
        for (const project of projects) {
          existing.attributedBlobs.set(
            project,
            (existing.attributedBlobs.get(project) ?? 0) + blobCount,
          )
        }
      }
    }

    onProgress?.(end - fromBlock + 1, blockCount, senders.size)
  }

  return {
    senders: [...senders.values()].sort((a, b) => b.blobCount - a.blobCount),
    topicsChecked,
  }
}

const LOGS_CHUNK = 1000

// Topic-tracked projects are matched by the events their blob txs emit, so
// the logs for those topics are fetched once for the whole range. Configured
// topics are event signatures, hence the topic0 filter.
async function getTrackedTopicsByTx(
  provider: providers.StaticJsonRpcProvider,
  daTracking: EthereumDaTracking[],
  fromBlock: number,
  toBlock: number,
): Promise<{ topicsByTx: Map<string, Set<string>>; topicsChecked: boolean }> {
  const topicsByTx = new Map<string, Set<string>>()
  const topics = [...new Set(daTracking.flatMap((c) => c.topics))]
  if (topics.length === 0) {
    return { topicsByTx, topicsChecked: true }
  }
  try {
    for (let start = fromBlock; start <= toBlock; start += LOGS_CHUNK) {
      const end = Math.min(start + LOGS_CHUNK - 1, toBlock)
      const logs: { transactionHash: string; topics: string[] }[] =
        await provider.send('eth_getLogs', [
          {
            fromBlock: '0x' + start.toString(16),
            toBlock: '0x' + end.toString(16),
            topics: [topics],
          },
        ])
      for (const log of logs) {
        const hash = log.transactionHash.toLowerCase()
        const set = topicsByTx.get(hash) ?? new Set<string>()
        for (const topic of log.topics) set.add(topic.toLowerCase())
        topicsByTx.set(hash, set)
      }
    }
    return { topicsByTx, topicsChecked: true }
  } catch {
    return { topicsByTx, topicsChecked: false }
  }
}
