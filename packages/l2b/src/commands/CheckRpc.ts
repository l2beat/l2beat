import type { LogLevel } from '@l2beat/backend-tools'
import { command, option, positional } from 'cmd-ts'
import { type Configuration, findRateLimit } from '../implementations/checkrpc'
import { HttpUrl, LogLevelValue, PositiveRpcBoundNumber } from './types'

export const CheckRpc = command({
  name: 'check-rpc',
  description: 'Find the rate limit of an ethereum rpc.',
  args: {
    rpcUrl: positional({
      displayName: 'rpcUrl',
      type: HttpUrl,
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
  },
  handler: async (args) => {
    const config: Configuration = {
      rpcUrl: args.rpcUrl,
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
    }

    await findRateLimit(config).catch(console.error)
  },
})
