import type { LogLevel } from '@l2beat/backend-tools'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { boolean, command, flag, option, restPositionals } from 'cmd-ts'
import {
  type Configuration,
  findRateLimit,
  type RateLimitResults,
} from '../implementations/checkrpc'
import { HttpUrl, LogLevelValue, PositiveRpcBoundNumber } from './types'

export const CheckRpc = command({
  name: 'check-rpc',
  description: 'Find the rate limit of an ethereum rpc.',
  args: {
    rpcUrls: restPositionals({
      type: HttpUrl,
      displayName: 'rpcUrls',
      description: 'RPC URLs to test',
    }),
    lowerBoundary: option({
      type: PositiveRpcBoundNumber,
      long: 'lower-boundary',
      short: 'l',
      defaultValue: () => 300,
      defaultValueIsSerializable: true,
    }),
    upperBoundary: option({
      type: PositiveRpcBoundNumber,
      long: 'upper-boundary',
      short: 'u',
      defaultValue: () => 5000,
      defaultValueIsSerializable: true,
    }),
    logLevel: option({
      type: LogLevelValue,
      long: 'log-level',
      short: 'v',
      description: 'Log level to use, choose between NONE, INFO and DEBUG',
      defaultValue: () => 'INFO' as LogLevel,
      defaultValueIsSerializable: true,
    }),
    batchOnly: flag({
      type: boolean,
      long: 'batch-only',
      description: 'Only test batch support, skip rate limit check',
      defaultValue: () => false,
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const results: Record<string, RateLimitResults> = {}
    for (const rpcUrl of args.rpcUrls) {
      const config: Configuration = {
        rpcUrl,
        lowerBoundary: args.lowerBoundary,
        upperBoundary: args.upperBoundary,
        method: 'eth_getBlockByNumber',
        batchDurationMs: 60000,
        retryDelayMs: 60000,
        maxBatches: 10,
        timeoutMs: 3000,
        minSuccessRatio: 0.95,
        maxFailureRatio: 0.2,
        minCallsToAbort: 100,
        logLevel: args.logLevel,
        batchOnly: args.batchOnly,
      }

      results[rpcUrl] = await findRateLimit(config)
    }

    const headers = ['RPC URL', 'Batch Size', 'Rate Limit']
    const rows: string[][] = Object.entries(results).map(([rpcUrl, result]) => {
      const rateLimit = result.rateLimit?.toString() ?? 'N/A'
      return [rpcUrl, result.batchSize.toString(), rateLimit]
    })

    console.log('Results:')
    console.log(formatAsAsciiTable(headers, rows))
  },
})
