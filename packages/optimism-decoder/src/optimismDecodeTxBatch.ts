/* Sample myCallData encoding
'0xd0f8934400   // appendSequencerBatch() 
00000b       // total Elements to append ??? (11)
4e00007b       // ???
each context is:
  numSequencedTransactions (6)
  numSubsequencedQueueTranaactions(6)
  timestamp(10)
  blockNumber(10)
7b
000013   // number of contexts (context header), below there are 19 contexts
0000010000000060d4a2bb0000c1c005
00000f0000000060d4a41f0000c1c01e
0000020000000060d4a5510000c1c032
0000060000000060d4a6830000c1c046
00000d0000000060d4a7cb0000c1c063
0000020000010060d4a90c0000c1c07b
0000020000000060d4a90f0000c1c07c
00000a0000000060d4aa410000c1c094
00000d0000000060d4ab6e0000c1c0a8
00000b0000000060d4acc30000c1c0bd
0000070000000060d4ae0b0000c1c0d8
0000080000000060d4af3a0000c1c0ea
0000030000000060d4b0790000c1c104
00000a0000000060d4b1f60000c1c11c
00000a0000000060d4b3240000c1c130
0000030000000060d4b4540000c1c148
0000010000000060d4b5890000c1c15a
0000020000000060d4b6c10000c1c16a
0000030000000060d4b7f30000c1c179
0000aaf8a80683e4e1c083dc7d6394420000000000000000000000000000000000000680b844a9059cbb000000000000000000000000970529c5bec494f9ec0b5dc5adaa7ceeb1253be8000000000000000000000000000000000000000000000000000000000000000038a0958279a7d94edcf7af6d3502f4a84155a8b7f6f3f685ce14588a02ffd1b6548ca013d25a90198c9a4a101c25f4a751a2b5808bcd865674180b6893b527abb9a7e500014bf9014882c72680840105623494631e93a0fb06b5ec6d52c0a2d89a3f9672d6ba6480b8e4bfa005ce000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000060d4a1aa0000000000000000000000000000000000000000000000000000000000000001534e58000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000005d90654783af000037a09fe1a376fa37344384eabb7bb56aece47504f9b30ba37b5e4a105eed80f8b099a046e96738e40710683ef30223e1b109f4c2ba61273d21a6f4b9570467e9dd0515000066f864218083e3d1e7948700daec35af8ff88c16bdf0418774cb3d7599b48084974


And then there are transactions
*/

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
  let txId =
    '0xd74125855bda2ee25d89e67e1fd537e4573f898b84f76dea7fee3c777cf1d854' // OPTIMISM OVM 2.0
  //txId = "0x82d4965f687faf9424bf55086f01fa61643ba2468cffa6a4bf860d2ba8a623e8"; // https://optimistic.etherscan.io/txs?batch=8856&p=2
  //txId = "0xee381396fdc483890ab31bf6c2d4d6d6d8da76b08e7112f64e1f7bc12991db37" // OPTIMISM OVM 1.0
  txId = '0xa979f1fa90b4ecf41a0eaf8109b4ce121025c350e1326988445e9724ed34f570' // METIS
  //txId = "0x55e01e7c1ca89701540f441b0e26286a773a54ef391eae77ebdc7d73387a3c2b" // BOBA
  const tx = await provider.getTransaction(txId)
  await decodeAppendSequencerBatch('METIS', tx.data, fourBytesApi)
}
