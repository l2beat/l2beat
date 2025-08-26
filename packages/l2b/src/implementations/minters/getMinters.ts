import type { IProvider } from '@l2beat/discovery'
import type {
  DebugTransactionCall,
  DebugTransactionCallResponse,
} from '@l2beat/discovery/dist/discovery/provider/DebugTransactionTrace'
import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'

const abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]
const iface = new utils.Interface(abi)
const topic0 = iface.getEventTopic('Transfer')

export async function getMintTransactions(
  provider: IProvider,
  address: ChainSpecificAddress,
) {
  const topics = iface.encodeFilterTopics('Transfer', [EthereumAddress.ZERO])

  const logs = await provider.getLogs(address, topics)

  return [...new Set(logs.map((log) => log.transactionHash))]
}

export function getDebugTraces(
  provider: IProvider,
  transactions: string[],
  onFetch?: (txHash: string) => void,
) {
  return Promise.all(
    transactions.map(async (txHash) => {
      const result = await provider.getDebugTrace(Hash256(txHash))
      onFetch?.(txHash)
      return result
    }),
  )
}

export function traverseTrace(trace: DebugTransactionCallResponse) {
  const sendersSet = new Set<string>()

  for (const call of trace.calls ?? []) {
    for (const { sender } of walk(call, call.from)) {
      sendersSet.add(sender)
    }
  }

  return [...sendersSet]
}

function* walk(
  call: DebugTransactionCall,
  lastCallSender: string,
): IterableIterator<{ sender: string }> {
  const isMint = call.logs?.some((log) => {
    const [eventTopic, from] = log.topics

    return eventTopic === topic0 && from === Hash256.ZERO
  })

  if (isMint) {
    const sender = call.type === 'DELEGATECALL' ? lastCallSender : call.from
    yield { sender: sender.toLowerCase() }
  }

  const nextLastCallSender = call.type === 'CALL' ? call.from : lastCallSender

  for (const nested of call.calls ?? []) {
    yield* walk(nested, nextLastCallSender)
  }
}

export async function fetchAndAnalyze(provider: IProvider, txHash: string) {
  const trace = await provider.getDebugTrace(Hash256(txHash))
  const minters = traverseTrace(trace)

  return minters.map((minter) =>
    ChainSpecificAddress.fromLong(provider.chain, minter),
  )
}
