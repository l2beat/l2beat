import {
  RpcTransactionApi,
  SimpleTransactionApi,
  StarkexTransactionApi,
} from '../../common'

export type Layer2TransactionApi =
  | SimpleTransactionApi<'starknet'>
  | SimpleTransactionApi<'aztec'>
  | SimpleTransactionApi<'zksync'>
  | SimpleTransactionApi<'loopring'>
  | SimpleTransactionApi<'degate'>
  | RpcTransactionApi
  | StarkexTransactionApi
