import type { CropAttestationSchema, HexString } from '@l2beat/config'
import { encodePacked, keccak256 } from 'viem'

/**
 * The same computation SchemaRegistry._getUID performs:
 * keccak256(abi.encodePacked(schema, resolver, revocable)).
 */
export function computeSchemaUid(
  schema: Omit<CropAttestationSchema, 'uid'>,
): HexString {
  return keccak256(
    encodePacked(
      ['string', 'address', 'bool'],
      [schema.definition, schema.resolver, schema.revocable],
    ),
  )
}

/** The uid in @l2beat/config is hardcoded; this stops it drifting from the definition. */
export function assertSchemaUid(schema: CropAttestationSchema): void {
  const computed = computeSchemaUid(schema)
  if (computed !== schema.uid) {
    throw new Error(
      `The attestation schema uid is stale: the definition hashes to ${computed}, config says ${schema.uid}. Update packages/config/src/crops/attestations.ts.`,
    )
  }
}
