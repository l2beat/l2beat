import { functionSelector } from '../defineMethod'

export const ERC20ROUTER_TRANSACTION_SIGNATURE =
  'function delegatecallMulticall(address[] targets, bytes[] datas, uint256[] values, address refundTo)'
export const ERC20ROUTER_TRANSACTION_SELECTOR = functionSelector(
  ERC20ROUTER_TRANSACTION_SIGNATURE,
)
