import { command, option, positional } from 'cmd-ts'
import { findRateLimit } from '../implementations/checkrpc'
import { HttpUrl, PositiveRpcBoundNumber } from './types'

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
  },
  handler: async (args) => {
    const method = 'eth_getBlockByNumber'
    const batchDuration = 60000 // Batch duration in ms
    const batchDelay = 60000 // Delay after unsuccessful batches (to let rpc recover)
    const maxBatches = 10 // Maximum number of batches to run
    const timeout = 3000 // Timeout for each RPC call in milliseconds
    const minSuccessRatio = 0.95 // Minimum success ratio to consider a batch successful
    const abortFailureThreshold = 0.2 // Failure rate threshold to abort a batch
    const minCallsToAbort = 100 // Minimum number of calls before considering aborting a batch
    const verbosity = 1 // 0 = silent, 1 = basic, 2 = detailed

    // Run the rate limit finder with sensible defaults
    await findRateLimit({
      rpcUrl: args.rpcUrl,
      method,
      lowerBoundary: args.lowerBoundary,
      upperBoundary: args.upperBoundary,
      batchDuration,
      batchDelay,
      maxBatches,
      timeout,
      minSuccessRatio,
      abortFailureThreshold,
      minCallsToAbort,
      verbosity,
    }).catch(console.error)
  },
})
