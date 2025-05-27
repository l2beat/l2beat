import { parseAbiItem, toFunctionSelector } from 'viem'

export const EIP_7821_TRANSACTION_SIGNATURE = parseAbiItem(
  'function execute(bytes32 mode, bytes calldata executionData)',
)
export const EIP_7821_TRANSACTION_SELECTOR = toFunctionSelector(
  EIP_7821_TRANSACTION_SIGNATURE,
)

export const WHITEBIT_TRANSACTION_SIGNATURE = parseAbiItem('function batch()')
export const WHITEBIT_TRANSACTION_SELECTOR = toFunctionSelector(
  WHITEBIT_TRANSACTION_SIGNATURE,
)
