import { assertUnreachable } from '@l2beat/shared-pure'
import type { Address, Chain } from '../config/types'
import type { AddressInfo, IAddressService } from './AddressService'
import type {
  DecodedCall,
  DecodedResult,
  DecodedValue,
  Value,
} from './DecodedResult'
import type { ISignatureService } from './SignatureService'
import { type AbiValue, decodeType } from './encoding'

export interface Transaction {
  to?: Address
  chain: Chain
  data: `0x${string}`
}

interface Known {
  addresses: Map<Address, AddressInfo>
  signatures: Map<`0x${string}`, string[]>
}

export class Decoder {
  constructor(
    private addressService: IAddressService,
    private signatureService: ISignatureService,
  ) {}

  async decode(tx: Transaction) {
    const known: Known = { addresses: new Map(), signatures: new Map() }
    if (tx.to) {
      await this.knowSafe(tx.to, tx.chain, known)
    }
    return this.decodeKnown(tx, known)
  }

  private async knowSafe(address: Address, chain: Chain, known: Known) {
    try {
      await this.know(address, chain, known)
    } catch (e) {
      console.error(e)
    }
  }

  private async know(address: Address, chain: Chain, known: Known) {
    if (known.addresses.has(address)) {
      return
    }
    const info = await this.addressService.lookup(address, chain)
    known.addresses.set(address, info)
    for (const { selector, signature } of info.abi) {
      const array = known.signatures.get(selector) ?? []
      if (!array.includes(signature)) {
        array.push(signature)
      }
      known.signatures.set(selector, array)
    }
  }

  private async decodeKnown(
    tx: Transaction,
    known: Known,
  ): Promise<DecodedResult> {
    const toInfo = tx.to && known.addresses.get(tx.to)
    return {
      data: {
        name: 'data',
        abi: 'bytes',
        encoded: tx.data,
        decoded: await this.decodeBytes(tx.data, tx.chain, known),
      },
      to: toInfo && {
        type: 'address',
        name: toInfo.name,
        value: toInfo.address,
        discovered: toInfo.fromDiscovery,
        explorerLink: toInfo.explorerLink,
      },
      chainId: tx.chain.chainId,
    }
  }

  private async decodeBytes(
    data: `0x${string}`,
    chain: Chain,
    known: Known,
  ): Promise<DecodedValue> {
    const selector = getSelector(data)
    if (!selector) {
      return { type: 'bytes', value: data, dynamic: true }
    }
    const signatures =
      known.signatures.get(selector) ??
      (await this.signatureService.lookup(selector))
    for (const signature of signatures) {
      try {
        return await this.decodeFunction(data, signature, chain, known)
      } catch {}
    }
    return { type: 'bytes', value: data, dynamic: true }
  }

  async decodeFunction(
    data: `0x${string}`,
    signature: string,
    chain: Chain,
    known: Known,
  ): Promise<DecodedCall> {
    if (!signature.startsWith('function ')) {
      throw new Error('Abi provided is not a function')
    }
    const { decoded } = decodeType(signature, data)
    if (decoded.type !== 'call') {
      throw new Error('Programmer error, decoding failed')
    }
    const result: DecodedCall = {
      type: 'call',
      abi: signature,
      selector: decoded.selector,
      arguments: decoded.parameters.map((x) => toResultValue(x, chain)),
    }
    const addresses = getAddresses(result)
    await Promise.all(addresses.map((x) => this.knowSafe(x, chain, known)))

    for (const value of result.arguments) {
      await this.decodeNested(value, chain, known)
    }

    return result
  }

  async decodeNested(value: Value, chain: Chain, known: Known) {
    console.log('nested', value)
    if (value.decoded?.type === 'array') {
      for (const v of value.decoded.values) {
        if (v.decoded) {
          await this.decodeNested(v, chain, known)
        }
      }
    }
    if (value.decoded?.type === 'call') {
      for (const v of value.decoded.arguments) {
        if (v.decoded) {
          await this.decodeNested(v, chain, known)
        }
      }
    }
    if (value.decoded?.type === 'bytes' && value.decoded.dynamic) {
      value.decoded = await this.decodeBytes(value.decoded.value, chain, known)
    }
  }
}

function getSelector(data: `0x${string}`): `0x${string}` | undefined {
  const selector = data.slice(0, 10) as `0x${string}`
  if (selector.length < 10) {
    return undefined
  }
  return selector
}

function toResultValue(value: AbiValue, chain: Chain): Value {
  const common = {
    abi: value.abi,
    name: value.name,
    encoded: value.encoded,
  }
  if (value.decoded.type === 'address') {
    return {
      ...common,
      decoded: {
        type: 'address',
        value: `${chain.shortName}:${value.decoded.value}`,
        explorerLink: `${chain.explorerUrl}/address/${value.decoded.value}`,
      },
    }
  }
  if (value.decoded.type === 'number') {
    return {
      ...common,
      decoded: { type: 'number', value: value.decoded.value },
    }
  }
  if (value.decoded.type === 'string') {
    return {
      ...common,
      decoded: {
        type: 'string',
        value: value.decoded.value,
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  if (value.decoded.type === 'bytes') {
    return {
      ...common,
      decoded: {
        type: 'bytes',
        dynamic: value.decoded.dynamic,
        value: value.decoded.value,
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  if (value.decoded.type === 'bool') {
    return {
      ...common,
      decoded: { type: 'boolean', value: value.decoded.value },
    }
  }
  if (value.decoded.type === 'array') {
    return {
      ...common,
      decoded: {
        type: 'array',
        values: value.decoded.value.map((x) => toResultValue(x, chain)),
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  if (value.decoded.type === 'call') {
    return {
      ...common,
      decoded: {
        type: 'call',
        abi: value.abi,
        selector: value.decoded.selector,
        arguments: value.decoded.parameters.map((x) => toResultValue(x, chain)),
        extra: value.decoded.extra !== '0x' ? value.decoded.extra : undefined,
      },
    }
  }
  assertUnreachable(value.decoded)
}

function getAddresses(value: DecodedValue): Address[] {
  if (value.type === 'address') {
    return [value.value]
  }
  if (value.type === 'array') {
    return value.values.flatMap((x) =>
      x.decoded ? getAddresses(x.decoded) : [],
    )
  }
  if (value.type === 'call') {
    return value.arguments.flatMap((x) =>
      x.decoded ? getAddresses(x.decoded) : [],
    )
  }
  return []
}
