import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { FourBytesApi } from './FourBytesApi'

const remove0x = (str: string): string => {
  if (str === undefined) {
    return str
  }
  return str.startsWith('0x') ? str.slice(2) : str
}

const add0x = (str: string): string => {
  if (str === undefined) {
    return str
  }
  return str.startsWith('0x') ? str : '0x' + str
}

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

const trimLong = (str: string): string => {
  if (str.length < 20) {
    return str
  }
  return str.slice(0, 10) + '...' + str.slice(str.length - 10, str.length - 1)
}

const decodeAppendSequencerBatch = async (
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
      const methodName = await fourBytesApi.getMethodName(methodHash)
      transactions.push(add0x(raw))
      offset += raw.length

      console.log('  ', trimLong(add0x(raw)), methodHash, methodName)
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

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}

dotenv.config()

export async function run() {
  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  console.log(rpcUrl)
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const fourBytesApi = new FourBytesApi()
  const txId =
    '0xd74125855bda2ee25d89e67e1fd537e4573f898b84f76dea7fee3c777cf1d854' // OPTIMISM OVM 2.0
  //txId = "0x82d4965f687faf9424bf55086f01fa61643ba2468cffa6a4bf860d2ba8a623e8"; // https://optimistic.etherscan.io/txs?batch=8856&p=2
  //txId = "0xee381396fdc483890ab31bf6c2d4d6d6d8da76b08e7112f64e1f7bc12991db37" // OPTIMISM OVM 1.0
  // txId = '0xa979f1fa90b4ecf41a0eaf8109b4ce121025c350e1326988445e9724ed34f570' // METIS
  //txId = "0x55e01e7c1ca89701540f441b0e26286a773a54ef391eae77ebdc7d73387a3c2b" // BOBA
  const tx = await provider.getTransaction(txId)
  await decodeAppendSequencerBatch('METIS', tx.data, fourBytesApi)
}
