import type { Address, Chain, TokenConfig } from '../config/types'
import type { AddressInfo, IAddressService } from './AddressService'
import type { DecodedCall, DecodedResult, DecodedValue } from './DecodedResult'
import type { ISignatureService } from './SignatureService'
import { decode } from './decode'
import { plugins } from './plugins/plugins'

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
    private tokens: TokenConfig,
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
        decoded: await this.decodeBytes(tx.data, tx.to, tx.chain, known),
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
    to: Address | undefined,
    chain: Chain,
    known: Known,
  ): Promise<DecodedValue> {
    const selector = getSelector(data)
    if (!selector) {
      return { type: 'bytes', value: data, dynamic: true }
    }
    let signatures: string[]
    const wellKnown = this.signatureService.lookupWellKnown(selector)
    if (wellKnown) {
      signatures = [wellKnown]
    } else {
      signatures =
        known.signatures.get(selector) ??
        (await this.signatureService.lookup(selector))
    }
    for (const signature of signatures) {
      try {
        return await this.decodeCall(data, signature, to, chain, known)
      } catch {}
    }
    return { type: 'bytes', value: data, dynamic: true }
  }

  private async decodeCall(
    data: `0x${string}`,
    signature: string,
    to: Address | undefined,
    chain: Chain,
    known: Known,
  ): Promise<DecodedCall> {
    const result = decode(signature, data, chain)
    const _interface = this.signatureService.getInterface(result.selector)
    if (_interface) {
      result.interface = _interface
    }
    const nested = this.applyPlugins(result, to, chain)

    const addresses = getAddresses(result)
    await Promise.all(addresses.map((x) => this.knowSafe(x, chain, known)))

    for (const value of nested) {
      if (value.data.decoded?.type !== 'bytes') {
        continue
      }
      value.data.decoded = await this.decodeBytes(
        value.data.decoded.value,
        value.to,
        chain,
        known,
      )
    }

    return result
  }

  private applyPlugins(
    result: DecodedCall,
    to: Address | undefined,
    chain: Chain,
  ) {
    for (const plugin of plugins) {
      const nested = plugin(result, chain, to, this.tokens)
      if (nested) {
        return nested
      }
    }
    return []
  }
}

function getSelector(data: `0x${string}`): `0x${string}` | undefined {
  const selector = data.slice(0, 10) as `0x${string}`
  if (selector.length < 10) {
    return undefined
  }
  return selector
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
