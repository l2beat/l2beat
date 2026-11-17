import { expect } from 'earl'
import { utils } from 'ethers'
import {
  decodeEnsAddrResult,
  encodeEnsAddrCall,
  ensUniversalResolverInterface,
  isEnsNotResolvedRevert,
  parseEnsName,
} from './ensUniversalResolver'

// Vectors come from EIP-137 and from mainnet: return and revert data below
// were recorded from `eth_call`s to the Universal Resolver.
describe('ensUniversalResolver', () => {
  describe(parseEnsName.name, () => {
    it('hashes names like EIP-137', () => {
      expect(parseEnsName('eth')?.namehash).toEqual(
        '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
      )
      expect(parseEnsName('foo.eth')?.namehash).toEqual(
        '0xde9b09fd7c5f901e23a3f19fecc54828e9c848539801e86591bd9801b019f84f',
      )
      expect(parseEnsName('vitalik.eth')?.namehash).toEqual(
        '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835',
      )
    })

    it('DNS-encodes names', () => {
      expect(parseEnsName('vitalik.eth')?.dnsEncoded).toEqual(
        '0x07766974616c696b0365746800',
      )
    })

    it('normalizes case', () => {
      expect(parseEnsName('Nick.ETH')).toEqual(parseEnsName('nick.eth'))
      expect(parseEnsName('Nick.ETH')?.name).toEqual('nick.eth')
    })

    it('keeps emoji and agrees with ethers on namehash', () => {
      const name = '🦇🔊.eth'

      const parsed = parseEnsName(name)

      expect(parsed?.name).toEqual(name)
      expect(parsed?.namehash).toEqual(utils.namehash(name))
    })

    it('rejects invalid names', () => {
      for (const name of ['', '.', 'a..eth', 'eth.', 'vitalik .eth']) {
        expect(parseEnsName(name)).toEqual(undefined)
      }
      expect(parseEnsName('ab--cd.eth')).toEqual(undefined)
      expect(parseEnsName('a/b.eth')).toEqual(undefined)
    })
  })

  describe(encodeEnsAddrCall.name, () => {
    it('wraps addr(namehash) in resolve(dnsName, data)', () => {
      const ensName = parseEnsName('vitalik.eth')
      expect(ensName).not.toEqual(undefined)
      if (ensName === undefined) return

      const calldata = encodeEnsAddrCall(ensName)

      expect(calldata.slice(0, 10)).toEqual('0x9061b923')
      const [name, data] = ensUniversalResolverInterface.decodeFunctionData(
        'resolve',
        calldata,
      )
      expect(name).toEqual(ensName.dnsEncoded)
      // `addr(bytes32)` selector followed by the namehash.
      expect(data).toEqual(`0x3b3b57de${ensName.namehash.slice(2)}`)
    })
  })

  describe(decodeEnsAddrResult.name, () => {
    it('decodes the address', () => {
      const vitalikEth =
        '0x0000000000000000000000000000000000000000000000000000000000000040' +
        '000000000000000000000000394d8eb4a4fdf599384deab25f31d111d755c398' +
        '0000000000000000000000000000000000000000000000000000000000000020' +
        '000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045'

      expect(decodeEnsAddrResult(vitalikEth)).toEqual(
        '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      )
    })

    it('returns undefined for an empty result', () => {
      expect(decodeEnsAddrResult(encodeResolveResult('0x'))).toEqual(undefined)
    })

    it('returns undefined for the zero address', () => {
      const zero = `0x${'00'.repeat(32)}`
      expect(decodeEnsAddrResult(encodeResolveResult(zero))).toEqual(undefined)
    })

    it('throws for a result that is not one address word', () => {
      const short = `0x${'11'.repeat(20)}`
      const dirty = `0x${'01'.repeat(12)}${'11'.repeat(20)}`

      expect(() => decodeEnsAddrResult(encodeResolveResult(short))).toThrow(
        'Invalid ENS addr result',
      )
      expect(() => decodeEnsAddrResult(encodeResolveResult(dirty))).toThrow(
        'Invalid ENS addr result',
      )
      expect(() => decodeEnsAddrResult('0x1234')).toThrow(
        'Invalid ENS resolve result',
      )
    })
  })

  describe(isEnsNotResolvedRevert.name, () => {
    it('treats a missing resolver and an offchain name as not resolved', () => {
      // ResolverNotFound("thisnamedoesnotexist-zz9.eth"), truncated.
      expect(isEnsNotResolvedRevert('0x77209fe80000')).toEqual(true)
      // OffchainLookup for brantly.cb.id, truncated.
      expect(isEnsNotResolvedRevert('0x556f18300000')).toEqual(true)
      expect(isEnsNotResolvedRevert('0x1e9535f2')).toEqual(true)
      expect(isEnsNotResolvedRevert('0x7b1c461b')).toEqual(true)
      expect(isEnsNotResolvedRevert('0x95C0C752')).toEqual(true)
    })

    it('does not treat other reverts as not resolved', () => {
      // Error(string), HttpError(uint16,string), no data.
      expect(isEnsNotResolvedRevert('0x08c379a00000')).toEqual(false)
      expect(isEnsNotResolvedRevert('0x01800152')).toEqual(false)
      expect(isEnsNotResolvedRevert('0x')).toEqual(false)
    })
  })
})

function encodeResolveResult(result: string): string {
  return ensUniversalResolverInterface.encodeFunctionResult('resolve', [
    result,
    '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63',
  ])
}
