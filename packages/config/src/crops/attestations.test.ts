import { expect } from 'earl'
import { utils } from 'ethers'
import type { CropAttestation, CropAttestationLedger } from '../types'
import {
  ATTESTATION_NETWORK,
  ATTESTATION_SCHEMA,
  getCropAttestations,
} from './attestations'

describe('crop attestations', () => {
  describe('schema', () => {
    it('the hardcoded uid is what SchemaRegistry computes for the definition', () => {
      const { definition, resolver, revocable, uid } = ATTESTATION_SCHEMA
      // SchemaRegistry._getUID: keccak256(abi.encodePacked(schema, resolver, revocable))
      const computed = utils.solidityKeccak256(
        ['string', 'address', 'bool'],
        [definition, resolver, revocable],
      )
      expect(computed).toEqual(uid)
    })

    it('attests the set and nothing about a rating', () => {
      expect(ATTESTATION_SCHEMA.definition).toEqual(
        'string[] projectIds,uint64 reviewedAt,uint32 revision',
      )
    })
  })

  describe(getCropAttestations.name, () => {
    const current = attestation({
      uid: `0x${'11'.repeat(32)}`,
      schema: ATTESTATION_SCHEMA.uid,
    })
    const superseded = attestation({
      uid: `0x${'22'.repeat(32)}`,
      schema: `0x${'99'.repeat(32)}`,
    })

    it('picks the live attestation under the current schema', () => {
      const result = getCropAttestations({
        [ATTESTATION_NETWORK]: ledger([superseded, current]),
      })
      expect(result.current).toEqual(current)
      expect(result.network).toEqual(ATTESTATION_NETWORK)
    })

    it('has no current attestation while only superseded ones are live', () => {
      const result = getCropAttestations({
        [ATTESTATION_NETWORK]: ledger([superseded]),
      })
      expect(result.current).toEqual(undefined)
    })

    it('has no current attestation when nothing was attested yet', () => {
      expect(getCropAttestations({}).current).toEqual(undefined)
    })
  })
})

function attestation(overrides: Partial<CropAttestation>): CropAttestation {
  return {
    uid: `0x${'00'.repeat(32)}`,
    schema: ATTESTATION_SCHEMA.uid,
    revision: 1,
    reviewedAt: 1700000000,
    projectIds: ['aztecnetwork'],
    txHash: `0x${'aa'.repeat(32)}`,
    block: 100,
    ...overrides,
  }
}

function ledger(live: CropAttestation[]): CropAttestationLedger {
  return {
    network: ATTESTATION_NETWORK,
    attester: '0xb55D684Be25227b722a007F6bB8AA706ca18BdDA',
    firstBlock: 100,
    live,
    revoked: [],
  }
}
