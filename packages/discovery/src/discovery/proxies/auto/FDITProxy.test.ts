import {
  assert,
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { detectFditProxy } from './FDITProxy'

const PACKAGES_METHOD =
  'function getPackagesUsedByCurrentComponent() external view returns (address[] memory)'
const SELECTORS_METHOD =
  'function getFunctionSelectorsOfPackage(address packageAddress) external view returns (bytes4[] memory)'

const callMethodStub = async <T>(
  _address: ChainSpecificAddress,
  abi: string | utils.FunctionFragment,
) => {
  const coder = new utils.Interface([abi])
  const functionName = Object.values(coder.functions)[0]?.name
  assert(functionName !== undefined)
  try {
    return coder.decodeFunctionResult(
      functionName,
      coder.encodeFunctionData(functionName, [0]),
    ) as T
  } catch {
    return undefined
  }
}

describe(detectFditProxy.name, () => {
  const address = ChainSpecificAddress.random()

  it('returns undefined when no packages are returned', async () => {
    const provider = mockObject<IProvider>({
      callMethod: mockFn().given(address, PACKAGES_METHOD, []).returnsOnce([]),
    })

    const result = await detectFditProxy(provider, address)

    expect(result).toEqual(undefined)
  })

  it('decodes package selectors into facets', async () => {
    const packageA = EthereumAddress.random()
    const packageB = EthereumAddress.random()
    const packageAAddr = ChainSpecificAddress.from('eth', packageA)
    const packageBAddr = ChainSpecificAddress.from('eth', packageB)

    const selectorsA = [
      utils.id('foo(uint256)').slice(0, 10),
      utils.id('bar(address)').slice(0, 10),
    ]
    const selectorsB = [utils.id('baz()').slice(0, 10)]

    const callMethodMock = mockFn()
      .given(address, PACKAGES_METHOD, [])
      .returnsOnce([packageA, packageB])
      .given(address, SELECTORS_METHOD, [packageA])
      .returnsOnce(selectorsA)
      .given(address, SELECTORS_METHOD, [packageB])
      .returnsOnce(selectorsB)
      .executes(callMethodStub)

    const getSourceMock = mockFn().executes((target: ChainSpecificAddress) => {
      if (target === packageAAddr) {
        return {
          name: 'PackageA',
          isVerified: true,
          abi: ['function foo(uint256)', 'function bar(address)'],
          source: 'PackageA',
        }
      }
      if (target === packageBAddr) {
        return {
          name: 'PackageB',
          isVerified: true,
          abi: ['function baz()'],
          source: 'PackageB',
        }
      }
      return {
        name: 'Unknown',
        isVerified: true,
        abi: [],
        source: 'Unknown',
      }
    })

    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: callMethodMock,
      getSource: getSourceMock,
      getBytecode: mockFn().resolvesTo(Bytes.fromHex('0xdeadbeef')),
      getDeployment: mockFn().resolvesTo(undefined),
      getStorageAsAddress: mockFn().resolvesTo(
        ChainSpecificAddress.ZERO('ethereum'),
      ),
      getLogs: mockFn().returns([]),
    })

    const result = await detectFditProxy(provider, address)

    expect(result).toEqual({
      type: 'FDIT proxy',
      values: {
        $implementation: [packageAAddr.toString(), packageBAddr.toString()],
        FDITFacets: {
          [packageAAddr.toString()]: ['foo(uint256)', 'bar(address)'],
          [packageBAddr.toString()]: ['baz()'],
        },
      },
    })
  })
})
