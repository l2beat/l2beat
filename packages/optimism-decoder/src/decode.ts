import { ethers } from 'ethers'

import { FourBytesApi } from './FourBytesApi'
import { add0x, remove0x, trimLong } from './utils'

interface BatchContext {
  numSequencedTransactions: number
  numSubsequentQueueTransactions: number
  timestamp: number
  blockNumber: number
}
interface AppendSequencerBatchParams {
  shouldStartAtElement: number // 5 bytes -- starts at batch
  totalElementsToAppend: number // 3 bytes -- total_elements_to_append
  contexts: BatchContext[] // total_elements[fixed_size[]]
  transactions: string[] // total_size_bytes[],total_size_bytes[]
}
export const decodeAppendSequencerBatch = async (
  kind: string,
  b: string,
  fourBytesApi: FourBytesApi
): Promise<AppendSequencerBatchParams> => {
  console.log('Decoding', kind, 'L1 Sequencer transaction batch...')

  b = remove0x(b)
  const methodName = b.slice(0, 8)
  const shouldStartAtElement = b.slice(8, 18)
  const totalElementsToAppend = b.slice(18, 24)
  const contextHeader = b.slice(24, 30)
  const contextCount = parseInt(contextHeader, 16)

  console.log('MethodName:', '0x' + methodName)
  console.log(
    'Should start at Element:',
    shouldStartAtElement,
    parseInt(shouldStartAtElement, 16)
  )
  console.log('Total Elements to Append:', parseInt(totalElementsToAppend, 16))
  console.log('ContextHeader:', contextHeader, contextCount)

  let offset = 30
  const contexts = []
  for (let i = 0; i < contextCount; i++) {
    const numSequencedTransactions = b.slice(offset, offset + 6)
    offset += 6
    const numSubsequentQueueTransactions = b.slice(offset, offset + 6)
    offset += 6
    const timestamp = b.slice(offset, offset + 10)
    offset += 10
    const blockNumber = b.slice(offset, offset + 10)
    offset += 10
    contexts.push({
      numSequencedTransactions: parseInt(numSequencedTransactions, 16),
      numSubsequentQueueTransactions: parseInt(
        numSubsequentQueueTransactions,
        16
      ),
      timestamp: parseInt(timestamp, 16),
      blockNumber: parseInt(blockNumber, 16),
    })
  }

  const transactions = []
  for (const context of contexts) {
    console.log('Block:', context.blockNumber, 'Timestamp:', context.timestamp)
    for (let i = 0; i < context.numSequencedTransactions; i++) {
      const size = b.slice(offset, offset + 6)
      offset += 6
      const raw = b.slice(offset, offset + parseInt(size, 16) * 2)
      const t = ethers.utils.parseTransaction(add0x(raw))
      const methodHash = t.data.slice(0, 10)
      const methodSignature = await fourBytesApi.getMethodSignature(methodHash)
      transactions.push(add0x(raw))
      offset += raw.length

      console.log('  ', trimLong(add0x(raw)), methodHash, methodSignature)
    }
  }

  console.log('Decoded', transactions.length, 'transactions')
  console.log('Done decoding...')

  //console.log(ethers.utils.parseTransaction(transactions[0]))
  return {
    shouldStartAtElement: parseInt(shouldStartAtElement, 16),
    totalElementsToAppend: parseInt(totalElementsToAppend, 16),
    contexts,
    transactions,
  }
}
