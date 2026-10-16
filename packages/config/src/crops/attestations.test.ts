import { expect } from 'earl'
import { utils } from 'ethers'
import { CROP_ATTESTATION_SOURCE } from './attestations'

describe('crop attestation source', () => {
  it('names the schema by the uid SchemaRegistry gives it', () => {
    // keccak256(abi.encodePacked(schema, resolver, revocable)), with no resolver and revocable.
    const uid = utils.solidityKeccak256(
      ['string', 'address', 'bool'],
      [
        CROP_ATTESTATION_SOURCE.schema,
        '0x0000000000000000000000000000000000000000',
        true,
      ],
    )
    expect(uid).toEqual(CROP_ATTESTATION_SOURCE.schemaUid)
  })

  it('has checksummed addresses', () => {
    for (const address of [
      CROP_ATTESTATION_SOURCE.eas,
      CROP_ATTESTATION_SOURCE.attester,
    ]) {
      expect(utils.getAddress(address)).toEqual(address)
    }
  })
})
