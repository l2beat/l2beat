import { parseAbiItem, toFunctionSelector } from 'viem'

export const EIP_7821_TRANSACTION_SIGNATURE = parseAbiItem(
  'function execute(bytes32 mode, bytes calldata executionData)',
)
export const EIP_7821_TRANSACTION_SELECTOR = toFunctionSelector(
  EIP_7821_TRANSACTION_SIGNATURE,
)
