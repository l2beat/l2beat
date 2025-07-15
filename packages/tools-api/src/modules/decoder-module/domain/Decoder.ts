import { getShortChainName } from '../../../config/address'
import type { Address, Chain, TokenConfig } from '../../../config/types'
import type { AddressInfo, IAddressService } from './AddressService'
import type {
  DecodedAddress,
  DecodedCall,
  DecodedResult,
  DecodedValue,
  Value,
} from './DecodedResult'
import { decode } from './decode'
import { plugins } from './plugins/plugins'
import type { ISignatureService } from './SignatureService'

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
    private hashes: Record<`0x${string}`, string>,
    private chains: Chain[],
  ) {}

  async decode(tx: Transaction) {
    const known: Known = { addresses: new Map(), signatures: new Map() }
    if (tx.to) {
      await this.knowSafe(tx.to, known)
    }
    return this.decodeKnown(tx, known)
  }

  private async knowSafe(address: Address, known: Known) {
    try {
      await this.know(address, known)
    } catch (e) {
      console.error(e)
    }
  }

  private async know(address: Address, known: Known) {
    if (known.addresses.has(address)) {
      return
    }
    const info = await this.addressService.lookup(address)
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
        decoded: await this.decodeBytes(
          tx.data,
          undefined,
          tx.to,
          tx.chain,
          known,
        ),
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
    extra: `0x${string}` | undefined,
    to: Address | undefined,
    chain: Chain,
    known: Known,
  ): Promise<DecodedValue> {
    const selector = getSelector(data)
    if (!selector) {
      return { type: 'bytes', value: data, extra, dynamic: true }
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
        const call = await this.decodeCall(data, signature, to, chain, known)
        return { ...call, extra }
      } catch (e) {
        console.error(e)
      }
    }
    return { type: 'bytes', value: data, extra, dynamic: true }
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
    await Promise.all(
      nested
        .map((x) => x.to)
        .filter((x) => x !== undefined)
        .map((x) => this.knowSafe(x, known)),
    )
    await Promise.all(addresses.map((x) => this.knowSafe(x.value, known)))

    const hashes = result.arguments.map(getBytes32).flat(1)
    for (const hash of hashes) {
      if (hash.decoded?.type === 'bytes') {
        let preImage = this.hashes[hash.decoded.value]
        if (preImage) {
          hash.decoded = { type: 'hash', value: preImage }
          continue
        }
        const plusOne: `0x${string}` = `0x${(BigInt(hash.decoded.value) + 1n).toString(16).padStart(64, '0')}`
        preImage = this.hashes[plusOne]
        if (preImage) {
          hash.decoded = { type: 'hash', value: preImage, minusOne: true }
          continue
        }
      }
    }

    for (const value of nested) {
      if (value.data.decoded?.type !== 'bytes') {
        continue
      }

      let nestedChain = chain
      if (value.to !== undefined) {
        const shortChainName = getShortChainName(value.to)
        const newChain = this.chains.find((x) => x.shortName === shortChainName)
        if (newChain !== undefined) {
          nestedChain = newChain
        }
      }

      value.data.decoded = await this.decodeBytes(
        value.data.decoded.value,
        value.data.decoded.extra,
        value.to,
        nestedChain,
        known,
      )
    }

    for (const address of addresses) {
      const info = known.addresses.get(address.value)

      address.name = info?.name

      if (info?.fromDiscovery) {
        address.discovered = true
      }
    }

    return result
  }

  private applyPlugins(
    result: DecodedCall,
    to: Address | undefined,
    chain: Chain,
  ) {
    for (const plugin of plugins) {
      const nested = plugin(result, chain, to, this.tokens, this.chains)
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

function getAddresses(value: DecodedValue): DecodedAddress[] {
  if (value.type === 'address') {
    return [value]
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

function getBytes32(value: Value): Value[] {
  if (
    value.decoded?.type === 'bytes' &&
    !value.decoded.dynamic &&
    value.decoded.value.length === 66
  ) {
    return [value]
  }
  if (value.decoded?.type === 'array') {
    return value.decoded.values.flatMap(getBytes32)
  }
  if (value.decoded?.type === 'call') {
    return value.decoded.arguments.flatMap(getBytes32)
  }
  return []
}
