import { ethers } from 'ethers'

import { ByteReader } from './ByteReader'
import { FourBytesApi } from './FourBytesApi'
import { add0x, trimLong } from './utils'

interface BatchContext {
  sequencerTxCount: number
  queueTxCount: number
  timestamp: number
  blockNumber: number
}

interface AppendSequencerBatchParams {
  shouldStartAtElement: number // 5 bytes -- starts at batch
  totalElementsToAppend: number // 3 bytes -- total_elements_to_append
  contexts: BatchContext[] // total_elements[fixed_size[]]
  transactions: string[] // total_size_bytes[], total_size_bytes[]
}

export async function decodeSequencerBatch(
  kind: string,
  data: string,
  fourBytesApi: FourBytesApi
): Promise<AppendSequencerBatchParams> {
  console.log('Decoding', kind, 'L1 Sequencer transaction batch...')
  const reader = new ByteReader(data)

  const methodName = reader.getBytes(4)
  console.log('MethodName:', methodName)

  if (kind === 'Metis') {
    const chainId = reader.getNumber(32)
    console.log('ChainId:', chainId)
  }
  const shouldStartAtElement = reader.getNumber(5)
  const totalElementsToAppend = reader.getNumber(3)
  const contextCount = reader.getNumber(3)

  console.log('Should start at Element:', shouldStartAtElement)
  console.log('Total Elements to Append:', totalElementsToAppend)
  console.log('contextCount:', contextCount)

  const contexts = []
  for (let i = 0; i < contextCount; i++) {
    const sequencerTxCount = reader.getNumber(3)
    const queueTxCount = reader.getNumber(3)
    const timestamp = reader.getNumber(5)
    const blockNumber = reader.getNumber(5)
    contexts.push({
      sequencerTxCount,
      queueTxCount,
      timestamp,
      blockNumber,
    })
  }

  const transactions = []
  for (const context of contexts) {
    console.log('Block:', context.blockNumber, 'Timestamp:', context.timestamp)
    for (let i = 0; i < context.sequencerTxCount; i++) {
      const size = reader.getNumber(3)
      const raw = reader.getBytes(size)
      const parsed = ethers.utils.parseTransaction(add0x(raw))
      const methodHash = parsed.data.slice(0, 10)
      const methodSignature = await fourBytesApi.getMethodSignature(methodHash)
      transactions.push(add0x(raw))
      console.log('  ', trimLong(add0x(raw)), methodHash, methodSignature)
    }
  }

  console.log('Decoded', transactions.length, 'transactions')
  console.log('Done decoding...')

  return {
    shouldStartAtElement,
    totalElementsToAppend,
    contexts,
    transactions,
  }
}
