import type { EVMTransaction, RpcTransaction } from '@l2beat/shared'
import { assert, EthereumAddress, type Transaction } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  getInteropTransactionDataCandidates,
  getInteropTransactionTargetCallValue,
  toInteropTransaction,
} from './interopTransaction'

describe('interopTransaction', () => {
  describe('supported envelopes', () => {
    it('creates the canonical variant', () => {
      const tx = toInteropTransaction(
        makeTransaction({
          type: '2',
          to: ADDRESS_2,
          data: '0x1234',
          value: 7n,
        }),
      )

      expect(tx).toEqual({
        kind: 'canonical',
        hash: HASH_1,
        from: ADDRESS_1,
        to: ADDRESS_2,
        data: '0x1234',
        type: '2',
        value: 7n,
      })
    })

    it('creates the bundle variant', () => {
      const tx = toInteropTransaction(
        makeRpcTransaction({
          type: 118n,
          input: undefined,
          value: undefined,
          to: null,
          calls: [
            {
              to: EthereumAddress(ADDRESS_3),
              value: 7n,
              input: '0xbeef',
            },
          ],
        }),
      )

      assert(tx.kind === 'bundle')
      expect(tx.type).toEqual('118')
      expect(tx.calls).toEqual([{ to: ADDRESS_3, value: 7n, data: '0xbeef' }])
    })

    it('rejects unsupported custom envelope types', () => {
      expect(() =>
        toInteropTransaction({
          imBad: true,
        } as any),
      ).toThrow()
    })
  })

  describe('supported upstream types', () => {
    it('creates an interop transaction from shared-pure Transaction', () => {
      const upstream: Transaction = makeTransaction({
        type: '2',
        data: '0x1234',
        value: 7n,
      })

      expect(toInteropTransaction(upstream)).toEqual({
        kind: 'canonical',
        hash: HASH_1,
        from: ADDRESS_1,
        to: ADDRESS_2,
        data: '0x1234',
        type: '2',
        value: 7n,
      })
    })

    it('creates an interop transaction from shared EVMTransaction', () => {
      const upstream: EVMTransaction = makeEvmTransaction({
        type: '2',
        data: '0x1234',
        value: 7n,
      })

      expect(toInteropTransaction(upstream)).toEqual({
        kind: 'canonical',
        hash: HASH_1,
        from: ADDRESS_1,
        to: ADDRESS_2,
        data: '0x1234',
        type: '2',
        value: 7n,
      })
    })

    it('creates an interop transaction from shared RpcTransaction', () => {
      const upstream: RpcTransaction = makeRpcTransaction({
        type: 2n,
        input: '0x1234',
        value: 7n,
      })

      expect(toInteropTransaction(upstream)).toEqual({
        kind: 'canonical',
        hash: HASH_1,
        from: ADDRESS_1,
        to: ADDRESS_2,
        data: '0x1234',
        type: '2',
        value: 7n,
      })
    })
  })

  describe('helpers', () => {
    it('collects unique calldata candidates from the tx and bundle calls', () => {
      const tx = toInteropTransaction(
        makeRpcTransaction({
          type: 118n,
          input: '0x1234',
          value: undefined,
          to: null,
          calls: [
            {
              to: EthereumAddress(ADDRESS_3),
              value: 0n,
              input: '0x1234',
            },
            {
              to: EthereumAddress(ADDRESS_4),
              value: 1n,
              input: '0x5678',
            },
          ],
        }),
      )

      expect(getInteropTransactionDataCandidates(tx)).toEqual([
        '0x1234',
        '0x5678',
      ])
    })

    it('finds matching target call value inside the bundle envelope', () => {
      expect(
        getInteropTransactionTargetCallValue(
          toInteropTransaction(
            makeRpcTransaction({
              type: 118n,
              input: undefined,
              value: undefined,
              to: null,
              calls: [
                {
                  to: EthereumAddress(ADDRESS_3),
                  value: 9n,
                  input: '0xdeadbeef',
                },
                {
                  to: EthereumAddress(ADDRESS_4),
                  value: 0n,
                  input: '0xdeadbeef',
                },
              ],
            }),
          ),
          [ADDRESS_3],
        ),
      ).toEqual(9n)
    })
  })
})

const ADDRESS_1 = '0x1111111111111111111111111111111111111111'
const ADDRESS_2 = '0x2222222222222222222222222222222222222222'
const ADDRESS_3 = '0x3333333333333333333333333333333333333333'
const ADDRESS_4 = '0x4444444444444444444444444444444444444444'
const HASH_1 = `0x${'11'.repeat(32)}`
const BLOCK_HASH_1 = `0x${'22'.repeat(32)}`

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    hash: HASH_1,
    from: ADDRESS_1,
    to: ADDRESS_2,
    data: '0x',
    type: '2',
    value: 0n,
    ...overrides,
  }
}

function makeEvmTransaction(
  overrides: Partial<EVMTransaction> = {},
): EVMTransaction {
  return mockObject<EVMTransaction>({
    hash: HASH_1,
    from: ADDRESS_1,
    to: ADDRESS_2,
    data: '0x',
    type: '2',
    value: 0n,
    blockNumber: 1,
    ...overrides,
  })
}

function makeRpcTransaction(
  overrides: Partial<RpcTransaction> = {},
): RpcTransaction {
  return {
    blockHash: BLOCK_HASH_1,
    blockNumber: 1n,
    from: EthereumAddress(ADDRESS_1),
    gas: 21_000n,
    hash: HASH_1,
    input: '0x',
    to: EthereumAddress(ADDRESS_2),
    transactionIndex: 0n,
    value: 0n,
    type: 2n,
    ...overrides,
  }
}
