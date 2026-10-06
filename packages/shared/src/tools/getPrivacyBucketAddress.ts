import { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface PrivacyBucketChainAddress {
  chain: string
  address: string
}

/**
 * Privacy buckets keep EVM addresses in their ERC-3770 form and use an
 * explicit chain/address pair where ERC-3770 does not apply. Both the backend
 * indexer configs and the frontend series derive the same chain and address
 * through this helper, so configuration ids match on both sides.
 */
export function getPrivacyBucketAddress(
  address: ChainSpecificAddress | PrivacyBucketChainAddress,
): PrivacyBucketChainAddress {
  if (typeof address !== 'string') {
    return address
  }
  return {
    chain: ChainSpecificAddress.longChain(address),
    address: ChainSpecificAddress.address(address).toString(),
  }
}
