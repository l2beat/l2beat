import { functionSelector } from '../defineMethod'

export const EIP_7821_TRANSACTION_SIGNATURE =
  'function execute(bytes32 mode, bytes calldata executionData)'
export const EIP_7821_TRANSACTION_SELECTOR = functionSelector(
  EIP_7821_TRANSACTION_SIGNATURE,
)

export const WHITEBIT_TRANSACTION_SIGNATURE = 'function batch()'
export const WHITEBIT_TRANSACTION_SELECTOR = functionSelector(
  WHITEBIT_TRANSACTION_SIGNATURE,
)
