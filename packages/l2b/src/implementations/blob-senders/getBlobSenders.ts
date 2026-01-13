import { providers } from 'ethers'

export interface BlobSender {
  address: string
  txCount: number
  blobCount: number
  firstBlock: number
  lastBlock: number
}

export async function getBlobSenders(
  rpcUrl: string,
  blockCount: number,
  onProgress?: (current: number, total: number, senderCount: number) => void,
): Promise<BlobSender[]> {
  const provider = new providers.StaticJsonRpcProvider(rpcUrl)
  const latestBlock = await provider.getBlockNumber()
  const fromBlock = latestBlock - blockCount + 1

  const senders = new Map<string, BlobSender>()
  const batchSize = 20

  for (let start = fromBlock; start <= latestBlock; start += batchSize) {
    const end = Math.min(start + batchSize - 1, latestBlock)
    const blockPromises: Promise<any>[] = []

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
        const blockNum = parseInt(block.number, 16)
        const blobCount = tx.blobVersionedHashes?.length ?? 0

        const existing = senders.get(from)
        if (existing) {
          existing.txCount++
          existing.blobCount += blobCount
          existing.firstBlock = Math.min(existing.firstBlock, blockNum)
          existing.lastBlock = Math.max(existing.lastBlock, blockNum)
        } else {
          senders.set(from, {
            address: from,
            txCount: 1,
            blobCount,
            firstBlock: blockNum,
            lastBlock: blockNum,
          })
        }
      }
    }

    onProgress?.(end - fromBlock + 1, blockCount, senders.size)
  }

  return [...senders.values()].sort((a, b) => b.blobCount - a.blobCount)
}
