import { parseAbiItem, toFunctionSelector } from 'viem'

export const ERC20ROUTER_TRANSACTION_SIGNATURE = parseAbiItem(
  'function delegatecallMulticall(address[] targets, bytes[] datas, uint256[] values, address refundTo)',
)
export const ERC20ROUTER_TRANSACTION_SELECTOR = toFunctionSelector(
  ERC20ROUTER_TRANSACTION_SIGNATURE,
)
