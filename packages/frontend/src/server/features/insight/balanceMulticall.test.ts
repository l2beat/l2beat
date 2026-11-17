import { MulticallV3Client } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  balanceOfCall,
  decodeTryAggregate,
  encodeTryAggregate,
  getEthBalanceCall,
  MULTICALL3_ADDRESS,
} from './balanceMulticall'

// Methodology: the hand-written coder is checked against the generic ABI
// coder of `MulticallV3Client`, which it replaces, on calldata and on a
// result recorded from Ethereum mainnet at block 22,020,096 for vitalik.eth:
// ETH, USDC, an address without code (empty return) and the beacon deposit
// contract (no `balanceOf`, so the call reverts).
describe('balanceMulticall', () => {
  const holder = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
  const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  const noCode = '0x0000000000000000000000000000000000000001'
  const depositContract = '0x00000000219ab540356cbb839cbe05303d7705fa'
  const reference = new MulticallV3Client(
    EthereumAddress(MULTICALL3_ADDRESS),
    14_353_601,
    500,
  )

  describe(encodeTryAggregate.name, () => {
    it('encodes the same calldata as the generic coder', () => {
      const tokens = [usdc, noCode, depositContract]
      const encoded = encodeTryAggregate([
        getEthBalanceCall(holder),
        ...tokens.map((token) => balanceOfCall(token, holder)),
      ])

      const batches = reference.encodeBatches([
        reference.encodeGetEthBalance(holder),
        ...tokens.map((token) => ({
          to: EthereumAddress(token),
          input: Bytes.fromHex(balanceOfCall(token, holder).callData),
        })),
      ])
      expect(batches.length).toEqual(1)
      expect(encoded).toEqual(
        batches.map((batch) => batch.input.toString().toLowerCase()).join(''),
      )
    })

    it('rejects a checksummed token or holder', () => {
      const checksummed = EthereumAddress(usdc).toString()
      expect(() =>
        encodeTryAggregate([balanceOfCall(checksummed, holder)]),
      ).toThrow('Lowercase address')
      expect(() => balanceOfCall(usdc, checksummed)).toThrow(
        'Lowercase address',
      )
    })
  })

  describe(decodeTryAggregate.name, () => {
    it('decodes a mainnet result like the generic coder', () => {
      const balances = decodeTryAggregate(MAINNET_RESULT, 4)

      expect(balances).toEqual([
        700_902_557_624_395_571_068n,
        12_999_316_655n,
        undefined,
        undefined,
      ])
      const expected = reference
        .decode(Bytes.fromHex(MAINNET_RESULT))
        .map((response) =>
          response.success && response.data.length === 32
            ? BigInt(response.data.toString())
            : undefined,
        )
      expect(balances).toEqual(expected)
    })

    it('rejects a result with another number of calls', () => {
      expect(() => decodeTryAggregate(MAINNET_RESULT, 3)).toThrow(
        'Multicall result count mismatch',
      )
    })

    it('rejects a truncated result', () => {
      expect(() =>
        decodeTryAggregate(MAINNET_RESULT.slice(0, 2 + 64 * 7), 4),
      ).toThrow('Malformed multicall result')
    })

    it('rejects an offset past the end', () => {
      const pastEnd = `0x${'f'.repeat(64)}`
      expect(() => decodeTryAggregate(pastEnd, 1)).toThrow(
        'Malformed multicall result',
      )
    })
  })
})

const MAINNET_RESULT = `0x${[
  '20',
  '4',
  '80',
  '100',
  '180',
  '1e0',
  // ETH: success, data at 0x40, 32 bytes.
  '1',
  '40',
  '20',
  '25fefa1a9e54db1f7c',
  // USDC.
  '1',
  '40',
  '20',
  '306d1d4af',
  // No code: success, nothing returned.
  '1',
  '40',
  '0',
  // Reverted, nothing returned.
  '0',
  '40',
  '0',
]
  .map((word) => word.padStart(64, '0'))
  .join('')}`
