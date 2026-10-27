import { expect } from 'earl'
import type { CountedTransaction } from './api'
import { compareTransactions } from './compareTransactions'

describe(compareTransactions.name, () => {
  it('orders two transactions with details by type, the same both ways', () => {
    const erc4337 = transaction('ERC-4337 Entry Point 0.7.0')
    const eip7821 = transaction('EIP-7821')

    expect(compareTransactions(erc4337, eip7821)).toEqual(-1)
    expect(compareTransactions(eip7821, erc4337)).toEqual(1)
  })

  it('orders two standard types alphabetically, the same both ways', () => {
    const entryPoint07 = transaction('ERC-4337 Entry Point 0.7.0')
    const entryPoint08 = transaction('ERC-4337 Entry Point 0.8.0')

    expect(compareTransactions(entryPoint07, entryPoint08)).toEqual(-1)
    expect(compareTransactions(entryPoint08, entryPoint07)).toEqual(1)
  })
})

function transaction(type: string): CountedTransaction {
  return {
    from: '0x',
    type,
    hash: type,
    operationsCount: 1,
    details: {
      id: type,
      level: 0,
      methodSelector: '0x',
      count: 1,
      children: [],
    },
  }
}
