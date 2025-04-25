import type { Address, Chain } from '../config/types'
import type { AddressInfo, AddressService } from './AddressService'
import type { SignatureService } from './SignatureService'
import type { DecodedResult } from './decode/DecodedResult'
import { decode } from './decode/decode'

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
    private addressService: AddressService,
    private signatureService: SignatureService,
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
    const selector = getSelector(tx.data)
    if (!selector) {
      return {
        type: 'error',
        error: 'Data too short',
      }
    }
    const signatures =
      known.signatures.get(selector) ??
      (await this.signatureService.lookup(selector))
    return decode(tx.data, signatures)
  }
}

function getSelector(data: `0x${string}`): `0x${string}` | undefined {
  const selector = data.slice(0, 10) as `0x${string}`
  if (selector.length < 10) {
    return undefined
  }
  return selector
}
