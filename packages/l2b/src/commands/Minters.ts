import {
  type DiscoveryChainConfig,
  getChainConfig,
  type IProvider,
} from '@l2beat/discovery'
import type {
  DebugTransactionCall,
  DebugTransactionCallResponse,
} from '@l2beat/discovery/dist/discovery/provider/DebugTransactionTrace'
import { Hash256 } from '@l2beat/shared-pure'
import { command, positional, restPositionals, string } from 'cmd-ts'
import { utils } from 'ethers'
import { Listr } from 'listr2'
import { getProvider } from '../implementations/common/GetProvider'
import { getMintTransactions } from '../implementations/minters/getMinters'
import { EthereumAddressValue } from './types'

export const Minters = command({
  name: 'minters',
  description:
    'Find token minters based on event transfers and traces - returns list of msg.senders who called given function.',
  args: {
    chain: positional({
      displayName: 'chain',
    }),
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    signatures: restPositionals({
      type: string,
      displayName: 'additional signatures you want to search for (optional)',
    }),
  },
  handler: async (args) => {
    const chain = getChainConfig(args.chain)

    const provider = await getProvider(chain.rpcUrl, chain.explorer)
    Object.assign(provider, { chain: args.chain })

    interface Ctx {
      provider: IProvider
      chain: DiscoveryChainConfig
      transactions: string[]
      traces: Record<string, DebugTransactionCallResponse>
      minters: string[]
    }

    const tasks = new Listr<Ctx>([
      {
        title: 'Setting up provider',
        task: (ctx) => {
          ctx.provider = provider
          ctx.chain = chain
        },
      },
      {
        title: 'Pulling transactions',
        task: async (ctx, task) => {
          ctx.transactions = await getMintTransactions(
            ctx.provider,
            args.address,
          )
          task.title = `Fetched ${ctx.transactions.length} transaction(s)`

          if (ctx.transactions.length === 0) {
            throw new Error('No transactions found')
          }
        },
      },
      {
        title: 'Pulling debug trace(s)',
        enabled: (ctx) => (ctx.transactions ?? []).length > 0,
        task: (ctx, task) => {
          ctx.traces = {}
          let readyCounter = 0

          function onFinish(txHash: string) {
            readyCounter++
            task.output = txHash
            task.title = `Pulled ${readyCounter}/${ctx.transactions.length} trace(s)`
          }

          return task.newListr(
            (ctx.transactions ?? []).map((txHash) => ({
              task: async () => {
                ctx.traces[txHash] = await ctx.provider.getDebugTrace(
                  Hash256(txHash),
                )

                onFinish(txHash)
              },
            })),
            {
              concurrent: true,
            },
          )
        },
      },
      {
        title: 'Traversing traces',
        enabled: (ctx) => Object.keys(ctx.traces ?? {}).length > 0,
        task: (ctx, task) => {
          const sendersSet = new Set<string>()

          for (const trace of Object.values(ctx.traces)) {
            for (const call of trace.calls ?? []) {
              for (const { sender } of walk(call, call.from)) {
                sendersSet.add(sender)
              }
            }
          }

          ctx.minters = [...sendersSet]
          task.title = `Found ${ctx.minters.length} function caller(s)`
        },
      },
    ])

    const { minters } = await tasks.run()

    printList(minters)
  },
})

function* walk(
  call: DebugTransactionCall,
  lastCallSender: string,
): IterableIterator<{ sender: string }> {
  const abi = [
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ]
  const iface = new utils.Interface(abi)
  const topic0 = iface.getEventTopic('Transfer')

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

function printList(list: string[]) {
  for (const item of list) {
    console.log(`• ${item}`)
  }
}
