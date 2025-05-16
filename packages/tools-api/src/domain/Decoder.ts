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
      await this.know(tx.to, tx.chain, known)
    }
    return this.decodeKnown(tx, known)
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
      return { type: 'bytes', value: data }
    }
    const signatures =
      known.signatures.get(selector) ??
      (await this.signatureService.lookup(selector))
    for (const signature of signatures) {
      try {
        return decodeFunction(data, signature, chain)
      } catch {}
    }
    return { type: 'bytes', value: data }
  }
}

function getSelector(data: `0x${string}`): `0x${string}` | undefined {
  const selector = data.slice(0, 10) as `0x${string}`
  if (selector.length < 10) {
    return undefined
  }
  return selector
}

function decodeFunction(
  data: `0x${string}`,
  signature: string,
  chain: Chain,
): DecodedCall {
  if (!signature.startsWith('function ')) {
    throw new Error('Abi provided is not a function')
  }
  const result = decodeType(signature, data)
  if (result.decoded.type !== 'call') {
    throw new Error('Programmer error, decoding failed')
  }

  return {
    type: 'call',
    abi: signature,
    selector: result.decoded.selector,
    arguments: result.decoded.parameters.map((x) => toResultValue(x, chain)),
  }
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
      // TODO: handle extra!
      decoded: { type: 'string', value: value.decoded.value },
    }
  }
  if (value.decoded.type === 'bytes') {
    return {
      ...common,
      // TODO: handle extra!
      decoded: { type: 'bytes', value: value.decoded.value },
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
      },
    }
  }
  assertUnreachable(value.decoded)
}
