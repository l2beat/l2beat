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

const ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]
const IFACE = new utils.Interface(ABI)
const TRANSFER_TOPIC = IFACE.getEventTopic('Transfer')

export async function getMintTransactions(
  provider: IProvider,
  address: ChainSpecificAddress,
) {
  const topics = IFACE.encodeFilterTopics('Transfer', [EthereumAddress.ZERO])

  const logs = await provider.getLogs(address, topics)

  return {
    logsCount: logs.length,
    transactions: [...new Set(logs.map((log) => log.transactionHash))],
  }
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

    return eventTopic === TRANSFER_TOPIC && from === Hash256.ZERO
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
