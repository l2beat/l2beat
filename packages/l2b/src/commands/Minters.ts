import {
  type DiscoveryChainConfig,
  getChainConfig,
  type IProvider,
  ProxyDetector,
} from '@l2beat/discovery'
import type {
  DebugTransactionCall,
  DebugTransactionCallResponse,
} from '@l2beat/discovery/dist/discovery/provider/DebugTransactionTrace'
import { Hash256 } from '@l2beat/shared-pure'
import { command, positional, restPositionals, type Type } from 'cmd-ts'
import { id } from 'ethers/lib/utils'
import { writeFileSync } from 'fs'
import { Listr } from 'listr2'
import { getProvider } from '../implementations/common/GetProvider'
import { getMintTransactions } from '../implementations/minters/getMinters'
import { EthereumAddressValue } from './types'

const baseSignatures = ['mint(address,uint256)', 'mint(uint256)']

export const SignatureValue: Type<string, string> = {
  from(str): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        toSigHash(str)
        resolve(str)
      } catch {
        reject('Invalid signature: ' + str)
      }
    })
  },
}

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
      type: SignatureValue,
      displayName: 'additional signatures you want to search for (optional)',
    }),
  },
  handler: async (args) => {
    const chain = getChainConfig(args.chain)

    const provider = await getProvider(chain.rpcUrl, chain.explorer)
    Object.assign(provider, { chain: args.chain })

    const proxyDetector = new ProxyDetector()

    interface Ctx {
      provider: IProvider
      proxyDetector: ProxyDetector
      chain: DiscoveryChainConfig
      transactions: string[]
      traces: Record<string, DebugTransactionCallResponse>
      minters: string[]
      selectors: Set<string>
    }

    const tasks = new Listr<Ctx>([
      {
        title: 'Setting up provider',
        task: (ctx) => {
          ctx.provider = provider
          ctx.chain = chain
          ctx.proxyDetector = proxyDetector
        },
      },
      {
        title: 'Setting up selectors',
        task: (ctx, task) => {
          const sigs = baseSignatures.concat(args.signatures)
          const r = sigs.reduce(
            (acc, sig) => {
              acc[sig] = toSigHash(sig)
              return acc
            },
            {} as Record<string, string>,
          )

          const outputLines = [
            'Signatures:',
            ...Object.entries(r).map(([sig, hash]) => `- ${sig}: ${hash}`),
          ]

          ctx.selectors = new Set(Object.values(r))
          task.title = outputLines.join('\n')
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

          ctx.transactions = ctx.transactions.slice(0, 1)
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
                writeFileSync(
                  `./l2b-minters-trace-${txHash}.json`,
                  JSON.stringify(ctx.traces[txHash], null, 2),
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
              for (const { sender } of walk(
                call,
                [],
                args.address,
                ctx.selectors,
              )) {
                sendersSet.add(sender.toLowerCase())
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
  stack: string[],
  address: string,
  selectors: Set<string>,
): IterableIterator<{ sender: string }> {
  if (
    call.to.toLowerCase() === address.toLowerCase() &&
    selectors.has(call.input.slice(0, 10).toLowerCase())
  ) {
    yield { sender: call.from }
  }

  const nextStack = [...stack, call.from]

  for (const nested of call.calls ?? []) {
    yield* walk(nested, nextStack, address, selectors)
  }
}

function printList(list: string[]) {
  for (const item of list) {
    console.log(`• ${item}`)
  }
}

function toSigHash(sig: string) {
  return id(sig).slice(0, 10)
}
