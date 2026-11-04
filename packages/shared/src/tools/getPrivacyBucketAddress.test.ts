import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getPrivacyBucketAddress } from './getPrivacyBucketAddress'

describe(getPrivacyBucketAddress.name, () => {
  it('splits an ERC-3770 address into its chain and checksummed address', () => {
    const address = EthereumAddress(`0x${'ab'.repeat(20)}`)

    expect(
      getPrivacyBucketAddress(
        ChainSpecificAddress.fromLong('ethereum', address),
      ),
    ).toEqual({ chain: 'ethereum', address: address.toString() })
  })

  it('passes an explicit chain and address pair through unchanged', () => {
    const address = { chain: 'starknet', address: `0x${'0c'.repeat(32)}` }

    expect(getPrivacyBucketAddress(address)).toEqual(address)
  })
})
