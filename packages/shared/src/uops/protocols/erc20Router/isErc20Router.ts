import { assert, type Transaction } from '@l2beat/shared-pure'
import isArray from 'lodash/isArray'
import { ERC20ROUTER_TRANSACTION_SELECTOR } from './const'

export function isErc20Router(tx: Transaction): boolean {
  assert(
    tx.data && !isArray(tx.data),
    `Only EVM Transactions are allowed: ${tx.hash}`,
  )
  const selector = tx.data.slice(0, 10)

  return selector === ERC20ROUTER_TRANSACTION_SELECTOR
}
