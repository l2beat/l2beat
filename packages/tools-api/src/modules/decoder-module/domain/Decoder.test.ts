import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { expect } from 'earl'
import { describe } from 'mocha'
import { toFunctionSelector } from 'viem'
import { getShortChainName } from '../../../config/address'
import chainList from '../../../config/chains.json'
import { type Address, Chain } from '../../../config/types'
import type {
  AddressInfo,
  FunctionAbi,
  IAddressService,
} from './AddressService'
import { Decoder } from './Decoder'
import type { ISignatureService } from './SignatureService'

const ethereum = Chain.parse(chainList[0])
const chains = v.array(Chain).parse(chainList)

class TestAddressService implements IAddressService {
  private names = new Map<Address, string>()
  private abis = new Map<Address, FunctionAbi[]>()
  private tokens = new Map<Address, { name: string; decimals: number }>()
  private chains = chains

  clear() {
    this.names.clear()
    this.abis.clear()
    this.tokens.clear()
  }

  setName(address: Address, name: string) {
    this.names.set(address, name)
    return this
  }

  setAbi(address: Address, abi: string[]) {
    this.abis.set(
      address,
      abi
        .filter((x) => x.startsWith('function '))
        .filter((x, i, a) => a.indexOf(x) === i)
        .map(
          (x): FunctionAbi => ({
            selector: toFunctionSelector(x),
            signature: x,
          }),
        ),
    )
    return this
  }

  setToken(address: Address, token: { name: string; decimals: number }) {
    this.tokens.set(address, token)
    return this
  }

  lookup(address: Address): Promise<AddressInfo> {
    const shortChainName = getShortChainName(address)
    const chain = this.chains.find((x) => x.shortName === shortChainName)
    assert(chain, `No chain found for ${shortChainName}`)
    return Promise.resolve({
      address,
      name: this.names.get(address),
      abi: this.abis.get(address) ?? [],
      explorerLink: `${chain.explorerUrl}/address/${address.split(':')[1]}`,
      token: this.tokens.get(address),
    })
  }
}

class TestSignatureService implements ISignatureService {
  private signatures = new Map<`0x${string}`, string[]>()

  clear() {
    this.signatures.clear()
  }

  add(signature: string) {
    const selector = toFunctionSelector(signature)
    const array = this.signatures.get(selector) ?? []
    array.push(signature)
    this.signatures.set(selector, array)
    return selector
  }

  lookup(selector: `0x${string}`): Promise<string[]> {
    return Promise.resolve(this.signatures.get(selector) ?? [])
  }

  lookupWellKnown(_: `0x${string}`): string | undefined {
    return undefined
  }

  getInterface(_: `0x${string}`): string | undefined {
    return undefined
  }
}

describe(Decoder.name, () => {
  const addressService = new TestAddressService()
  const signatureService = new TestSignatureService()
  const decoder = new Decoder(addressService, signatureService, {}, {}, chains)

  beforeEach(() => {
    addressService.clear()
    signatureService.clear()
  })

  it('data too short', async () => {
    const result = await decoder.decode({
      data: '0x',
      chain: ethereum,
    })
    expect(result).toEqual({
      data: {
        name: 'data',
        abi: 'bytes',
        encoded: '0x',
        decoded: {
          type: 'bytes',
          value: '0x',
          extra: undefined,
          dynamic: true,
        },
      },
      to: undefined,
      chainId: 1,
    })
  })

  it('call no arguments', async () => {
    const selector = signatureService.add('function foo()')

    const result = await decoder.decode({
      data: selector,
      chain: ethereum,
    })
    expect(result).toEqual({
      data: {
        name: 'data',
        abi: 'bytes',
        encoded: selector,
        decoded: {
          type: 'call',
          abi: 'function foo()',
          selector: selector,
          arguments: [],
          extra: undefined,
        },
      },
      to: undefined,
      chainId: 1,
    })
  })

  it('call with arguments', async () => {
    const selector = signatureService.add('function foo(uint256 bar)')
    const data: `0x${string}` = `${selector}${'1234'.padStart(64, '0')}`

    const result = await decoder.decode({
      data: data,
      chain: ethereum,
    })
    expect(result).toEqual({
      data: {
        name: 'data',
        abi: 'bytes',
        encoded: data,
        decoded: {
          type: 'call',
          abi: 'function foo(uint256 bar)',
          selector: selector,
          arguments: [
            {
              name: 'bar',
              abi: 'uint256',
              encoded: `0x${'1234'.padStart(64, '0')}`,
              decoded: { type: 'number', value: (0x1234).toString() },
            },
          ],
          extra: undefined,
        },
      },
      to: undefined,
      chainId: 1,
    })
  })

  it('nested call', async () => {
    const selectorA = signatureService.add('function aaa(bytes call)')
    const selectorB = signatureService.add('function bbb()')
    const data = [
      selectorA,
      '20'.padStart(64, '0'), // offset
      '4'.padStart(64, '0'), // length
      selectorB
        .slice(2)
        .padEnd(64, '0'), // bytes
    ].join('') as `0x${string}`

    const result = await decoder.decode({
      data: data,
      chain: ethereum,
    })
    expect(result).toEqual({
      data: {
        name: 'data',
        abi: 'bytes',
        encoded: data,
        decoded: {
          type: 'call',
          abi: 'function aaa(bytes call)',
          selector: selectorA,
          arguments: [
            {
              name: 'call',
              abi: 'bytes',
              encoded: `0x${'4'.padStart(64, '0')}${selectorB.slice(2).padEnd(64, '0')}`,
              decoded: {
                type: 'call',
                abi: 'function bbb()',
                selector: selectorB,
                arguments: [],
                extra: undefined,
              },
            },
          ],
          extra: undefined,
        },
      },
      to: undefined,
      chainId: 1,
    })
  })

  it('multiple occurrences of same address get consistent names', async () => {
    const contractAddress: Address =
      'eth:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779'
    addressService.setName(contractAddress, 'FiatTokenV2_2')

    const selector = signatureService.add(
      'function multiTransfer(address[] recipients, address token, address from)',
    )

    const tokenAddress = '0x2Ce6311ddAE708829bc0784C967b7d77D19FD779' // Same as contractAddress
    const fromAddress = '0x2Ce6311ddAE708829bc0784C967b7d77D19FD779' // Same as contractAddress

    const data = [
      selector,
      '60'.padStart(64, '0'), // offset to recipients array
      tokenAddress
        .slice(2)
        .padStart(64, '0'), // token address
      fromAddress
        .slice(2)
        .padStart(64, '0'), // from address
      '2'.padStart(64, '0'), // recipients array length
      tokenAddress
        .slice(2)
        .padStart(64, '0'), // recipients[0] - same address again
      tokenAddress
        .slice(2)
        .padStart(64, '0'), // recipients[1] - same address again
    ].join('') as `0x${string}`

    const result = await decoder.decode({
      data: data,
      chain: ethereum,
    })

    assert(result.data.decoded?.type === 'call')

    const decodedCall = result.data.decoded

    expect(decodedCall.arguments.length).toBeGreaterThanOrEqual(3)

    const recipientsArg = decodedCall.arguments[0] // recipients array
    const tokenArg = decodedCall.arguments[1] // token address
    const fromArg = decodedCall.arguments[2] // from address

    assert(recipientsArg?.decoded?.type === 'array')
    expect(recipientsArg.decoded.values.length).toBeGreaterThanOrEqual(2)
    const recipient0 = recipientsArg.decoded.values[0]
    const recipient1 = recipientsArg.decoded.values[1]

    expect(recipient0?.decoded?.type).toEqual('address')
    expect(recipient1?.decoded?.type).toEqual('address')

    assert(recipient0?.decoded?.type === 'address')
    assert(recipient1?.decoded?.type === 'address')

    // Check token address
    expect(tokenArg?.decoded?.type).toEqual('address')
    assert(tokenArg?.decoded?.type === 'address')
    expect(tokenArg?.decoded?.name).toEqual('FiatTokenV2_2')

    // Check from address
    expect(fromArg?.decoded?.type).toEqual('address')
    assert(fromArg?.decoded?.type === 'address')
    expect(fromArg.decoded.name).toEqual('FiatTokenV2_2')
  })
})
