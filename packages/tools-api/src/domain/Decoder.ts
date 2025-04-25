import type { Address, Chain } from '../config/types'
import type { AddressInfo, AddressService } from './AddressService'

export interface Transaction {
  to?: Address
  chain: Chain
  data: `0x${string}`
}

export class Decoder {
  constructor(private addressService: AddressService) {}

  async decode(tx: Transaction) {
    const known = new Map<Address, AddressInfo>()
    if (tx.to) {
      known.set(tx.to, await this.addressService.lookup(tx.to, tx.chain))
    }
    return this.decodeKnown(tx, known)
  }

  async decodeKnown(_tx: Transaction, _known: Map<Address, AddressInfo>) {}
}
