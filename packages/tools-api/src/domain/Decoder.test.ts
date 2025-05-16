import { expect } from 'earl'
import { describe } from 'mocha'
import { toFunctionSelector } from 'viem'
import chainList from '../config/chains.json'
import { type Address, Chain } from '../config/types'
import type {
  AddressInfo,
  FunctionAbi,
  IAddressService,
} from './AddressService'
import { Decoder } from './Decoder'
import type { ISignatureService } from './SignatureService'

const ethereum = Chain.parse(chainList[0])

class TestAddressService implements IAddressService {
  private names = new Map<Address, string>()
  private abis = new Map<Address, FunctionAbi[]>()
  private tokens = new Map<Address, { name: string; decimals: number }>()

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

  lookup(address: Address, chain: Chain): Promise<AddressInfo> {
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
}

describe(Decoder.name, () => {
  const addressService = new TestAddressService()
  const signatureService = new TestSignatureService()
  const decoder = new Decoder(addressService, signatureService)

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
        decoded: { type: 'bytes', value: '0x', dynamic: true },
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
        },
      },
      to: undefined,
      chainId: 1,
    })
  })
})
