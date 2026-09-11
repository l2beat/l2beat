import { expect } from 'earl'
import { utils } from 'ethers'
import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
} from './eas'

describe('ATTESTATION_SCHEMA_UID', () => {
  it('is keccak256(abi.encodePacked(schema, resolver, revocable)), as SchemaRegistry computes it', () => {
    const computed = utils.keccak256(
      utils.solidityPack(
        ['string', 'address', 'bool'],
        [
          ATTESTATION_SCHEMA,
          ATTESTATION_SCHEMA_RESOLVER,
          ATTESTATION_SCHEMA_REVOCABLE,
        ],
      ),
    )
    expect(computed).toEqual(ATTESTATION_SCHEMA_UID)
  })
})
