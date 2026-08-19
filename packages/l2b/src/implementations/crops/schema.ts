import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
} from '@l2beat/config/build/crops/eas'
import { encodePacked, type Hex, keccak256 } from 'viem'

/**
 * The same computation SchemaRegistry._getUID performs:
 * keccak256(abi.encodePacked(schema, resolver, revocable)).
 */
export function computeSchemaUid(
  schema = ATTESTATION_SCHEMA,
  resolver = ATTESTATION_SCHEMA_RESOLVER,
  revocable = ATTESTATION_SCHEMA_REVOCABLE,
): Hex {
  return keccak256(
    encodePacked(
      ['string', 'address', 'bool'],
      [schema, resolver as Hex, revocable],
    ),
  )
}

/**
 * The uid in @l2beat/config is hardcoded so the frontend does not need a crypto
 * library. This is what stops it from silently drifting from the schema string.
 */
export function assertSchemaUid(): void {
  const computed = computeSchemaUid()
  if (computed !== ATTESTATION_SCHEMA_UID) {
    throw new Error(
      `ATTESTATION_SCHEMA_UID is stale: schema hashes to ${computed}, config says ${ATTESTATION_SCHEMA_UID}. Update packages/config/src/crops/eas.ts.`,
    )
  }
}
