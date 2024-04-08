import { UnixTime } from '@l2beat/shared-pure'

export type Layer2FinalityConfig =
  // We require the minTimestamp to be set for all types that will be processed in FinalityIndexer
  | {
      type: 'Linea' | 'zkSyncEra' | 'Scroll' | 'zkSyncLite' | 'Starknet' | 'Loopring'
      minTimestamp: UnixTime
      lag: number
    }
  | {
      type: 'OPStack-blob'
      minTimestamp: UnixTime
      lag: number

      // https://specs.optimism.io/protocol/span-batches.html#how-derivation-works-with-span-batch
      // you can get this values by calling the RPC method optimism_rollupConfig
      // rollup config: curl -X POST -H "Content-Type: application/json" --data \
      // '{"jsonrpc":"2.0","method":"optimism_rollupConfig","params":[],"id":1}'  \
      // <rpc-url> | jq
      genesisTimestamp: UnixTime
      l2BlockTimeSeconds: number
    }
  | {
      type: 'OPStack'
      lag: number
    }

export type FinalityType = Layer2FinalityConfig['type']
