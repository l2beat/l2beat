import {
  assert,
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import type { IProvider } from '../provider/IProvider'
import { FunctionSelectorDecoder } from './FunctionSelectorDecoder'

describe(FunctionSelectorDecoder.name, () => {
  const EIP2535_METHOD =
    'function facetAddresses() external view returns (address[] memory facetAd)'
  const EIP1967_IMPLEMENTATION_SLOT = Bytes.fromHex(
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
  )

  const callMethodStub = async <T>(
    _address: ChainSpecificAddress,
    abi: string | utils.FunctionFragment,
  ) => {
    const coder = new utils.Interface([abi])
    const functionName = Object.values(coder.functions)[0]?.name
    assert(functionName !== undefined)
    // This is a hack to get around the problem with detecting EIP2535 proxies
    try {
      return coder.decodeFunctionResult(
        functionName,
        coder.encodeFunctionData(functionName, [0]),
      ) as T
    } catch {
      return undefined
    }
  }

  describe(FunctionSelectorDecoder.prototype.fetchTargets.name, () => {
    it('can fetch a single target address that is not a proxy', async () => {
      const target = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().resolvesTo(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn().executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target])

      expect(provider.getSource).toHaveBeenCalledTimes(1)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target)
    })

    it('can fetch a two target addresses that are not a proxy', async () => {
      const target1 = ChainSpecificAddress.random()
      const target2 = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().resolvesTo(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn().executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getSource).toHaveBeenCalledTimes(2)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getSource).toHaveBeenNthCalledWith(2, target2)
    })

    it('can fetch a single target address that is an eip1967 proxy', async () => {
      const target = ChainSpecificAddress.random()
      const implementation = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn()
          .given(target, EIP1967_IMPLEMENTATION_SLOT)
          .returnsOnce(implementation)
          .returns(ChainSpecificAddress.ZERO('ethereum')),
        callMethod: mockFn().executes(callMethodStub),
        getLogs: mockFn().returns([]),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target])

      expect(provider.getSource).toHaveBeenCalledTimes(2)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target)
      expect(provider.getSource).toHaveBeenNthCalledWith(2, implementation)
    })

    it('can fetch a single target address that is an eip2535 proxy', async () => {
      const target = ChainSpecificAddress.random()
      const implementation1 = EthereumAddress.random()
      const implementation2 = EthereumAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().returns(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn()
          .given(target, EIP2535_METHOD, [])
          .resolvesToOnce([implementation1, implementation2])
          .executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
        getLogs: mockFn().resolvesTo([]),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target])

      expect(provider.getSource).toHaveBeenCalledTimes(3)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target)
      expect(provider.getSource).toHaveBeenNthCalledWith(
        2,
        ChainSpecificAddress.from('eth', implementation1),
      )
      expect(provider.getSource).toHaveBeenNthCalledWith(
        3,
        ChainSpecificAddress.from('eth', implementation2),
      )
    })

    it('can fetch a two target addresses that are both a eip1967 proxy', async () => {
      const target1 = ChainSpecificAddress.random()
      const target2 = ChainSpecificAddress.random()
      const implementation1 = ChainSpecificAddress.random()
      const implementation2 = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn()
          .given(target1, EIP1967_IMPLEMENTATION_SLOT)
          .returnsOnce(implementation1)
          .given(target2, EIP1967_IMPLEMENTATION_SLOT)
          .returnsOnce(implementation2)
          .resolvesTo(ChainSpecificAddress.ZERO('ethereum')),
        callMethod: mockFn().executes(callMethodStub),
        getLogs: mockFn().returns([]),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getSource).toHaveBeenCalledTimes(4)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getSource).toHaveBeenNthCalledWith(2, target2)
      expect(provider.getSource).toHaveBeenNthCalledWith(3, implementation1)
      expect(provider.getSource).toHaveBeenNthCalledWith(4, implementation2)
    })

    it('can fetch a two target addresses that are both a eip2535 proxy', async () => {
      const target1 = ChainSpecificAddress.random()
      const target2 = ChainSpecificAddress.random()
      const implementation1 = ChainSpecificAddress.random()
      const implementation2 = ChainSpecificAddress.random()
      const implementation3 = ChainSpecificAddress.random()
      const implementation4 = ChainSpecificAddress.random()
      const implementation1_r = ChainSpecificAddress.address(implementation1)
      const implementation2_r = ChainSpecificAddress.address(implementation2)
      const implementation3_r = ChainSpecificAddress.address(implementation3)
      const implementation4_r = ChainSpecificAddress.address(implementation4)
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().returns(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn()
          .given(target1, EIP2535_METHOD, [])
          .resolvesToOnce([implementation1_r, implementation2_r])
          .given(target2, EIP2535_METHOD, [])
          .resolvesToOnce([implementation3_r, implementation4_r])
          .executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
        getLogs: mockFn().resolvesTo([]),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getSource).toHaveBeenCalledTimes(6)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getSource).toHaveBeenNthCalledWith(2, target2)
      expect(provider.getSource).toHaveBeenNthCalledWith(3, implementation1)
      expect(provider.getSource).toHaveBeenNthCalledWith(4, implementation2)
      expect(provider.getSource).toHaveBeenNthCalledWith(5, implementation3)
      expect(provider.getSource).toHaveBeenNthCalledWith(6, implementation4)
    })

    it('can fetch a two target addresses that are an eip1967 and an eip2535', async () => {
      const target1 = ChainSpecificAddress.random()
      const target2 = ChainSpecificAddress.random()
      const implementation1 = ChainSpecificAddress.random()
      const implementation2 = ChainSpecificAddress.random()
      const implementation3 = ChainSpecificAddress.random()
      const implementation2_r = ChainSpecificAddress.address(implementation2)
      const implementation3_r = ChainSpecificAddress.address(implementation3)
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn()
          .given(target1, EIP1967_IMPLEMENTATION_SLOT)
          .returnsOnce(implementation1)
          .returns(ChainSpecificAddress.ZERO('ethereum')),
        callMethod: mockFn()
          .given(target2, EIP2535_METHOD, [])
          .resolvesToOnce([implementation2_r, implementation3_r])
          .executes(callMethodStub),
        getLogs: mockFn().returns([]),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target1, target2])

      expect(provider.getSource).toHaveBeenCalledTimes(5)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getSource).toHaveBeenNthCalledWith(2, target2)
      expect(provider.getSource).toHaveBeenNthCalledWith(3, implementation2)
      expect(provider.getSource).toHaveBeenNthCalledWith(4, implementation3)
      expect(provider.getSource).toHaveBeenNthCalledWith(5, implementation1)
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
      const target = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().resolvesTo(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn().executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclA, FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target])
      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionA)
      expect(provider.getSource).toHaveBeenCalledTimes(1)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target)
    })

    it('handles decoding a wrong selector in a contract that is already known', async () => {
      const target = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().resolvesTo(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn().executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      await decoder.fetchTargets([target])
      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionSigA)
      expect(provider.getSource).toHaveBeenCalledTimes(1)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target)
    })

    it('can decode a single selector that is not known', async () => {
      const target = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().resolvesTo(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn().executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionSigA)
      expect(provider.getSource).toHaveBeenCalledTimes(1)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target)
    })

    it('handles decoding a wrong selector in a contract that is not known', async () => {
      const target = ChainSpecificAddress.random()
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn().resolvesTo(
          ChainSpecificAddress.ZERO('ethereum'),
        ),
        callMethod: mockFn().executes(callMethodStub),
        getSource: mockFn().resolvesTo({
          name: 'name',
          isVerified: true,
          abi: [FunctionDeclB],
          source: 'name',
        }),
      })
      const decoder = new FunctionSelectorDecoder(provider)

      const result = await decoder.decodeSelector(target, FunctionSigA)

      expect(result).toEqual(FunctionSigA)
      expect(provider.getSource).toHaveBeenCalledTimes(1)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target)
    })

    it('can decoder selectors of two target addresses that are an eip1967 and an eip2535', async () => {
      const target1 = ChainSpecificAddress.random()
      const target2 = ChainSpecificAddress.random()
      const implementation1 = ChainSpecificAddress.random()
      const implementation2 = ChainSpecificAddress.random()
      const implementation3 = ChainSpecificAddress.random()
      const implementation2_r = ChainSpecificAddress.address(implementation2)
      const implementation3_r = ChainSpecificAddress.address(implementation3)
      const provider = mockObject<IProvider>({
        chain: 'ethereum',
        getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
        getDeployment: mockFn().resolvesTo(undefined),
        getStorageAsAddress: mockFn()
          .given(target1, EIP1967_IMPLEMENTATION_SLOT)
          .returnsOnce(implementation1)
          .returns(ChainSpecificAddress.ZERO('ethereum')),
        callMethod: mockFn()
          .given(target2, EIP2535_METHOD, [])
          .resolvesToOnce([implementation2_r, implementation3_r])
          .executes(callMethodStub),
        getLogs: mockFn().returns([]),
        getSource: mockFn()
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
      const decoder = new FunctionSelectorDecoder(provider)

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
      expect(provider.getSource).toHaveBeenCalledTimes(5)
      expect(provider.getSource).toHaveBeenNthCalledWith(1, target1)
      expect(provider.getSource).toHaveBeenNthCalledWith(2, implementation1)
      expect(provider.getSource).toHaveBeenNthCalledWith(3, target2)
      expect(provider.getSource).toHaveBeenNthCalledWith(4, implementation2)
      expect(provider.getSource).toHaveBeenNthCalledWith(5, implementation3)
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
