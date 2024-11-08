import { FuelClient } from './fuel/FuelClient'
import { RpcClient2 } from './rpc/RpcClient2'
import { StarknetClient } from './starknet/StarknetClient'
import { ZksyncLiteClient } from './zksynclite/ZksyncLiteClient'

export type BlockClient =
  | RpcClient2
  | ZksyncLiteClient
  | FuelClient
  | StarknetClient
