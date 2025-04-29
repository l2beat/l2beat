import { parseAbiItem } from 'abitype'
import { decodeFunctionData, encodeFunctionData } from 'viem'
import type { Address, Chain } from '../config/types'
import type { AddressInfo, IAddressService } from './AddressService'
import type { DecodedCall, DecodedResult, DecodedValue } from './DecodedResult'
import type { ISignatureService } from './SignatureService'
import { mix } from './mix'

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
        decoded: await this.decodeBytes(tx.data, known),
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
        return decodeFunction(data, selector, signature)
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
  selector: `0x${string}`,
  signature: string,
): DecodedCall {
  const abiItem = parseAbiItem(signature)
  if (abiItem.type !== 'function') {
    throw new Error('Abi provided is not a function')
  }
  const decoded = decodeFunctionData({
    abi: [abiItem],
    data,
  })
  const encoded = encodeFunctionData({
    abi: [abiItem],
    ...decoded,
  })
  if (!data.startsWith(encoded)) {
    throw new Error('Invalid encoding')
  }
  const extra = data.slice(encoded.length).toLowerCase()
  const values = mix(abiItem.inputs, decoded.args)
  if (extra) {
    values.push({
      name: 'extra data',
      abi: 'bytes',
      encoded: `0x${extra}`,
      decoded: { type: 'bytes', value: `0x${extra}` },
    })
  }

  return {
    type: 'call',
    abi: signature,
    selector,
    arguments: values,
  }
}
