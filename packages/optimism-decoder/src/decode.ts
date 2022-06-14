import { BufferReader } from '@loopx/bufio'
import { ethers } from 'ethers'
import zlib from 'zlib'

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
  fourBytesApi: FourBytesApi,
): Promise<AppendSequencerBatchParams> {
  console.log('Decoding', kind, 'L1 Sequencer transaction batch...')
  let reader = new BufferReader(Buffer.from(data.slice(2), 'hex'))

  const methodName = reader.readBytes(4).toString('hex')
  console.log('MethodName:', methodName)

  if (kind === 'Metis' || kind === 'Metis 2.0') {
    const chainId = reader.readBytes(32).toString('hex')
    console.log('ChainId:', chainId)
  }
  const shouldStartAtElement = reader.readU40BE()
  const totalElementsToAppend = reader.readU24BE()
  const contextCount = reader.readU24BE()

  console.log('Should start at Element:', shouldStartAtElement)
  console.log('Total Elements to Append:', totalElementsToAppend)
  console.log('contextCount:', contextCount)

  const contexts = []
  for (let i = 0; i < contextCount; i++) {
    const sequencerTxCount = reader.readU24BE()
    const queueTxCount = reader.readU24BE()
    const timestamp = reader.readU40BE()
    const blockNumber = reader.readU40BE()
    contexts.push({
      sequencerTxCount,
      queueTxCount,
      timestamp,
      blockNumber,
    })
    console.log(sequencerTxCount, queueTxCount, timestamp, blockNumber)
  }

  if (contexts[0].blockNumber === 0 && kind === 'Optimism OVM 2.0') {
    console.log(
      'Block number = 0 ? Transactions are compressed, nice.... Decompressing....',
    )
    contexts.slice(1) // remove dummy context that indicates compressed transaction data
    const bytes = reader.readBytes(reader.left())
    const inflated = zlib.inflateSync(bytes)
    reader = new BufferReader(inflated)
  }

  const transactions = []
  for (const context of contexts) {
    console.log('Block:', context.blockNumber, 'Timestamp:', context.timestamp)
    for (let i = 0; i < context.sequencerTxCount; i++) {
      const size = reader.readU24BE()
      const raw = reader.readBytes(size).toString('hex')
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
