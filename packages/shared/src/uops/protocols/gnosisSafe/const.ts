import { parseAbiItem, toFunctionSelector } from 'viem'

export const SAFE_MULTI_SEND_1_3_0 =
  '0xa238cbeb142c10ef7ad8442c6d1f9e89e07e7761'
export const SAFE_MULTI_SEND_CALL_ONLY_1_3_0 =
  '0x40a2accbd92bca938b02010e17a5b8929b49130d'
export const SAFE_SINGLETON_1_3_0 = '0xd9db270c1b5e3bd161e8c8503c55ceabee709552'

export const SAFE_EXEC_TRANSACTION_SIGNATURE = parseAbiItem(
  'function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
)
export const SAFE_EXEC_TRANSACTION_SELECTOR = toFunctionSelector(
  SAFE_EXEC_TRANSACTION_SIGNATURE,
)
