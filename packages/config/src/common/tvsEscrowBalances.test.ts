import { expect } from 'earl'
import type { TvsToken } from '../types'
import { getEscrowBalances, getSummedEscrowBalances } from './tvsEscrowBalances'

const A = { type: 'balanceOfEscrow', chain: 'ethereum' }
const B = { type: 'starknetBalanceOf', chain: 'starknet' }

describe(getEscrowBalances.name, () => {
  it('takes one escrow balance, or a sum of them', () => {
    expect(getEscrowBalances(token(A))).toEqual([A] as never)
    expect(getEscrowBalances(token(sum(A, sum(B))))).toEqual([A, B] as never)
  })

  it('has none for a formula that is not only escrow balances', () => {
    expect(getEscrowBalances(token({ type: 'totalSupply' }))).toEqual(undefined)
    expect(getEscrowBalances(token(sum(A, { type: 'totalSupply' })))).toEqual(
      undefined,
    )
    expect(
      getEscrowBalances(
        token({ type: 'calculation', operator: 'diff', arguments: [A, B] }),
      ),
    ).toEqual(undefined)
  })
})

describe(getSummedEscrowBalances.name, () => {
  it('leaves out a token of a single escrow', () => {
    expect(getSummedEscrowBalances(token(A))).toEqual([])
    expect(getSummedEscrowBalances(token(sum(A, B)))).toEqual([A, B] as never)
  })
})

function sum(...args: object[]) {
  return { type: 'calculation', operator: 'sum', arguments: args }
}

function token(amount: object) {
  return { amount } as Pick<TvsToken, 'amount'>
}
