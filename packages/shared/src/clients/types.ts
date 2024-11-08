import { FuelClient } from './fuel/FuelClient'
import { LoopringClient } from './loopring/LoopringClient'
import { RpcClient2 } from './rpc/RpcClient2'
import { ZksyncLiteClient } from './zksynclite/ZksyncLiteClient'

export type BlockClient =
  | RpcClient2
  | ZksyncLiteClient
  | FuelClient
  | LoopringClient
