import { assert } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { Bytes } from '../../utils/Bytes'
import { EthereumAddress } from '../../utils/EthereumAddress'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { addressToBytes32 } from './address'
import { FunctionSelectorDecoder } from './FunctionSelectorDecoder'

describe(FunctionSelectorDecoder.name, () => {
  const EIP2535_CALLDATA = Bytes.fromHex('0x52ef6b2c')
  const EIP1967_IMPLEMENTATION_SLOT = Bytes.fromHex(
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
  )

  const BLOCK_NUMBER = 1234

  const abiCoder = utils.defaultAbiCoder

  describe(FunctionSelectorDecoder.prototype.fetchTargets.name, () => {
    it('can fetch a single target address that is not a proxy', async () => {
      const target = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target])

      expect(provider.getMetadata).toHaveBeenCalledTimes(1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target)
    })

    it('can fetch a two target addresses that are not a proxy', async () => {
      const target1 = EthereumAddress.random()
      const target2 = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getMetadata).toHaveBeenCalledTimes(2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(2, target2)
    })

    it('can fetch a single target address that is an eip1967 proxy', async () => {
      const target = EthereumAddress.random()
      const implementation = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn()
          .given(target, EIP1967_IMPLEMENTATION_SLOT, BLOCK_NUMBER)
          .returnsOnce(addressToBytes32(implementation))
          .returns(Bytes.fromHex('0'.repeat(66))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(66))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target])

      expect(provider.getMetadata).toHaveBeenCalledTimes(2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(2, implementation)
    })

    it('can fetch a single target address that is an eip2535 proxy', async () => {
      const target = EthereumAddress.random()
      const implementation1 = EthereumAddress.random()
      const implementation2 = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().returns(Bytes.fromHex('0'.repeat(66))),
        call: mockFn()
          .given(target, EIP2535_CALLDATA, BLOCK_NUMBER)
          .resolvesToOnce(
            abiCoder.encode(
              ['address[]'],
              [[implementation1, implementation2]],
            ),
          )
          .resolvesTo(Bytes.fromHex('0'.repeat(66))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target])

      expect(provider.getMetadata).toHaveBeenCalledTimes(3)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(2, implementation1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(3, implementation2)
    })

    it('can fetch a two target addresses that are both a eip1967 proxy', async () => {
      const target1 = EthereumAddress.random()
      const target2 = EthereumAddress.random()
      const implementation1 = EthereumAddress.random()
      const implementation2 = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn()
          .given(target1, EIP1967_IMPLEMENTATION_SLOT, BLOCK_NUMBER)
          .returnsOnce(addressToBytes32(implementation1))
          .given(target2, EIP1967_IMPLEMENTATION_SLOT, BLOCK_NUMBER)
          .returnsOnce(addressToBytes32(implementation2))
          .resolvesTo(Bytes.fromHex('0'.repeat(88))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getMetadata).toHaveBeenCalledTimes(4)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(2, target2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(3, implementation1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(4, implementation2)
    })

    it('can fetch a two target addresses that are both a eip2535 proxy', async () => {
      const target1 = EthereumAddress.random()
      const target2 = EthereumAddress.random()
      const implementation1 = EthereumAddress.random()
      const implementation2 = EthereumAddress.random()
      const implementation3 = EthereumAddress.random()
      const implementation4 = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().returns(Bytes.fromHex('0'.repeat(66))),
        call: mockFn()
          .given(target1, EIP2535_CALLDATA, BLOCK_NUMBER)
          .resolvesToOnce(
            abiCoder.encode(
              ['address[]'],
              [[implementation1, implementation2]],
            ),
          )
          .given(target2, EIP2535_CALLDATA, BLOCK_NUMBER)
          .resolvesToOnce(
            abiCoder.encode(
              ['address[]'],
              [[implementation3, implementation4]],
            ),
          )
          .resolvesTo(Bytes.fromHex('0'.repeat(66))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getMetadata).toHaveBeenCalledTimes(6)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(2, target2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(3, implementation1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(4, implementation2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(5, implementation3)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(6, implementation4)
    })

    it('can fetch a two target addresses that are an eip1967 and an eip2535', async () => {
      const target1 = EthereumAddress.random()
      const target2 = EthereumAddress.random()
      const implementation1 = EthereumAddress.random()
      const implementation2 = EthereumAddress.random()
      const implementation3 = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn()
          .given(target1, EIP1967_IMPLEMENTATION_SLOT, BLOCK_NUMBER)
          .returnsOnce(addressToBytes32(implementation1))
          .returns(Bytes.fromHex('0'.repeat(66))),
        call: mockFn()
          .given(target2, EIP2535_CALLDATA, BLOCK_NUMBER)
          .resolvesToOnce(
            abiCoder.encode(
              ['address[]'],
              [[implementation2, implementation3]],
            ),
          )
          .resolvesTo(Bytes.fromHex('0'.repeat(66))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getMetadata).toHaveBeenCalledTimes(5)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(2, target2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(3, implementation1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(4, implementation2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(5, implementation3)
    })
  })

  describe(FunctionSelectorDecoder.prototype.fetchTargets.name, () => {
    const FunctionDeclA = 'function test(bytes32 id)'
    const FunctionDeclB = 'function testSecond(bytes32 id)'
    const FunctionDeclC = 'function doesNotExist(uint256 phoneNumber)'
    const FunctionA = getFunctionBody(FunctionDeclA)
    const FunctionB = getFunctionBody(FunctionDeclB)
    const FunctionC = getFunctionBody(FunctionDeclC)
    const FunctionSigA = getFunctionSelector(FunctionDeclA)
    const FunctionSigB = getFunctionSelector(FunctionDeclB)
    const FunctionSigC = getFunctionSelector(FunctionDeclC)

    it('can decode a single selector that is already known', async () => {
      const target = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclA, FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target])
      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionA)
      expect(provider.getMetadata).toHaveBeenCalledTimes(1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target)
    })

    it('handles decoding a wrong selector in a contract that is already known', async () => {
      const target = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target])
      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionSigA)
      expect(provider.getMetadata).toHaveBeenCalledTimes(1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target)
    })

    it('can decode a single selector that is not known', async () => {
      const target = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionSigA)
      expect(provider.getMetadata).toHaveBeenCalledTimes(1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target)
    })

    it('handles decoding a wrong selector in a contract that is not known', async () => {
      const target = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        call: mockFn().resolvesTo(Bytes.fromHex('0'.repeat(88))),
        getMetadata: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionSigA)
      expect(provider.getMetadata).toHaveBeenCalledTimes(1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target)
    })

    it('can decoder selectors of two target addresses that are an eip1967 and an eip2535', async () => {
      const target1 = EthereumAddress.random()
      const target2 = EthereumAddress.random()
      const implementation1 = EthereumAddress.random()
      const implementation2 = EthereumAddress.random()
      const implementation3 = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        getStorage: mockFn()
          .given(target1, EIP1967_IMPLEMENTATION_SLOT, BLOCK_NUMBER)
          .returnsOnce(addressToBytes32(implementation1))
          .returns(Bytes.fromHex('0'.repeat(66))),
        call: mockFn()
          .given(target2, EIP2535_CALLDATA, BLOCK_NUMBER)
          .resolvesToOnce(
            abiCoder.encode(
              ['address[]'],
              [[implementation2, implementation3]],
            ),
          )
          .resolvesTo(Bytes.fromHex('0'.repeat(66))),
        getMetadata: mockFn()
          .given(target1)
          .resolvesToOnce({
            name: 'name',
            isVerified: true,
            abi: [FunctionDeclA],
            source: 'name',
          })
          .given(implementation1)
          .resolvesToOnce({
            name: 'name',
            isVerified: true,
            abi: [FunctionDeclB],
            source: 'name',
          })
          .given(target2)
          .resolvesToOnce({
            name: 'name',
            isVerified: true,
            abi: [FunctionDeclA],
            source: 'name',
          })
          .given(implementation2)
          .resolvesToOnce({
            name: 'name',
            isVerified: true,
            abi: [FunctionDeclB],
            source: 'name',
          })
          .given(implementation3)
          .resolvesToOnce({
            name: 'name',
            isVerified: true,
            abi: [FunctionDeclC],
            source: 'name',
          })
          .resolvesTo({
            name: 'name',
            isVerified: true,
            abi: [],
            source: 'name',
          }),
      })
      const decoder = new FunctionSelectorDecoder(provider, BLOCK_NUMBER)

      await decoder.fetchTargets([target1])

      const result1 = await decoder.decodeSelector(target1, FunctionSigA)
      const result2 = await decoder.decodeSelector(target1, FunctionSigB)
      const result3 = await decoder.decodeSelector(target1, FunctionSigC)
      const result4 = await decoder.decodeSelector(target2, FunctionSigA)
      const result5 = await decoder.decodeSelector(target2, FunctionSigB)
      const result6 = await decoder.decodeSelector(target2, FunctionSigC)

      expect(result1).toEqual(FunctionA)
      expect(result2).toEqual(FunctionB)
      expect(result3).toEqual(FunctionSigC)
      expect(result4).toEqual(FunctionA)
      expect(result5).toEqual(FunctionB)
      expect(result6).toEqual(FunctionC)
      expect(provider.getMetadata).toHaveBeenCalledTimes(5)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(2, implementation1)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(3, target2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(4, implementation2)
      expect(provider.getMetadata).toHaveBeenNthCalledWith(5, implementation3)
    })
  })
})

function getFunctionSelector(functionDecl: string) {
  const iface = new utils.Interface([functionDecl])
  const key = Object.keys(iface.functions)[0]
  assert(key)
  return iface.getSighash(key)
}

function getFunctionBody(functionDecl: string) {
  const iface = new utils.Interface([functionDecl])
  const key = Object.keys(iface.functions)[0]
  assert(key)
  return key
}
