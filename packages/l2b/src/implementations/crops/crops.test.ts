import type { ProjectCrops } from '@l2beat/config'
import { toCanonicalCrops } from '@l2beat/config/build/crops/canonicalCrops'
import { ATTESTATION_SCHEMA_UID } from '@l2beat/config/build/crops/eas'
import { expect } from 'earl'
import type { Hex } from 'viem'
import { findIdentifyingStrings } from './anonymity'
import { diffAttestations } from './diff'
import type { OnchainAttestation } from './easClient'
import {
  type CropSubject,
  decodePayload,
  encodePayload,
  hashEvaluation,
  toPayload,
} from './payload'
import { assertSchemaUid, computeSchemaUid } from './schema'

const CROPS: ProjectCrops = {
  censorshipResistance: { sentiment: 'good', points: ['immutable pools'] },
  openSource: { sentiment: 'good' },
  privacy: { status: 'notReviewed' },
  security: { sentiment: 'warning', status: 'partiallyReviewed' },
}

function subject(id = 'uniswapv3', crops = CROPS): CropSubject {
  const canonical = toCanonicalCrops(id, 'Uniswap V3', crops)
  return {
    projectId: id,
    projectName: 'Uniswap V3',
    canonical,
    evaluationHash: hashEvaluation(canonical),
  }
}

describe('crop attestations', () => {
  describe('schema', () => {
    it('the uid committed in config matches the schema string', () => {
      expect(() => assertSchemaUid()).not.toThrow()
      expect(computeSchemaUid()).toEqual(ATTESTATION_SCHEMA_UID as Hex)
    })

    it('a different schema hashes to a different uid', () => {
      expect(computeSchemaUid('string projectId')).not.toEqual(
        ATTESTATION_SCHEMA_UID as Hex,
      )
    })

    it('revocability is part of the uid', () => {
      expect(
        computeSchemaUid(
          undefined,
          '0x0000000000000000000000000000000000000000',
          false,
        ),
      ).not.toEqual(ATTESTATION_SCHEMA_UID as Hex)
    })
  })

  describe('payload', () => {
    it('round trips through abi encoding', () => {
      const payload = toPayload(subject(), 1700000000, 3)
      expect(decodePayload(encodePayload(payload))).toEqual(payload)
    })

    it('carries the resolved ratings, not the raw config', () => {
      const payload = toPayload(subject(), 1700000000, 1)
      // privacy is notReviewed, so it must read neutral rather than empty.
      expect(payload.ratings).toEqual([
        ['good', 'reviewed'],
        ['good', 'reviewed'],
        ['neutral', 'notReviewed'],
        ['warning', 'partiallyReviewed'],
      ])
    })
  })

  describe('anonymity guard', () => {
    it('accepts the ratings vocabulary', () => {
      expect(
        findIdentifyingStrings('uniswapv3 Uniswap V3 good reviewed neutral'),
      ).toEqual([])
    })

    it('rejects anything naming us or the framework', () => {
      expect(findIdentifyingStrings('reviewed by L2BEAT')).toEqual(['l2beat'])
      expect(findIdentifyingStrings('CROPS framework')).toEqual(['crops'])
    })

    it('refuses to encode a payload that names us', () => {
      const named = subject('l2beat-test')
      expect(() => encodePayload(toPayload(named, 1, 1))).toThrow(
        /must not appear onchain/,
      )
    })
  })

  describe(diffAttestations.name, () => {
    const now = 1800000000
    const uid = `0x${'11'.repeat(32)}`

    function onchain(
      data: Hex,
      overrides: Partial<OnchainAttestation> = {},
    ): OnchainAttestation {
      return {
        uid: uid as Hex,
        schema: ATTESTATION_SCHEMA_UID as Hex,
        attester: '0x0000000000000000000000000000000000000001',
        time: 1700000000,
        revocationTime: 0,
        refUID: `0x${'0'.repeat(64)}` as Hex,
        data,
        ...overrides,
      }
    }

    const ledger = {
      projectId: 'uniswapv3',
      uid,
      revision: 2,
      reviewedAt: 1700000000,
      evaluationHash: hashEvaluation(subject().canonical),
      txHash: '0xabc',
      block: 100,
    }

    it('reports a project with no attestation as new at revision 1', () => {
      const diff = diffAttestations({
        subjects: [subject()],
        ledger: [],
        onchain: new Map(),
        now,
      })
      expect(diff.length).toEqual(1)
      expect(diff[0]?.kind).toEqual('new')
      expect(diff[0]?.payload?.revision).toEqual(1)
      expect(diff[0]?.revoke).toEqual(undefined)
    })

    it('reports an unchanged evaluation as unchanged, with nothing to publish', () => {
      const live = encodePayload(toPayload(subject(), 1700000000, 2))
      const diff = diffAttestations({
        subjects: [subject()],
        ledger: [ledger],
        onchain: new Map([[uid, onchain(live)]]),
        now,
      })
      expect(diff[0]?.kind).toEqual('unchanged')
      expect(diff[0]?.payload).toEqual(undefined)
      expect(diff[0]?.revoke).toEqual(undefined)
    })

    it('bumps the revision and revokes the old uid when the rating changes', () => {
      const live = encodePayload(toPayload(subject(), 1700000000, 2))
      const changed = subject('uniswapv3', {
        ...CROPS,
        security: { sentiment: 'bad', status: 'reviewed' },
      })
      const diff = diffAttestations({
        subjects: [changed],
        ledger: [ledger],
        onchain: new Map([[uid, onchain(live)]]),
        now,
      })
      expect(diff[0]?.kind).toEqual('changed')
      expect(diff[0]?.payload?.revision).toEqual(3)
      expect(diff[0]?.payload?.reviewedAt).toEqual(now)
      expect(diff[0]?.revoke).toEqual(uid as Hex)
    })

    it('re-attests when the ledger uid was revoked out of band', () => {
      const live = encodePayload(toPayload(subject(), 1700000000, 2))
      const diff = diffAttestations({
        subjects: [subject()],
        ledger: [ledger],
        onchain: new Map([
          [uid, onchain(live, { revocationTime: 1750000000 })],
        ]),
        now,
      })
      expect(diff[0]?.kind).toEqual('new')
      expect(diff[0]?.payload?.revision).toEqual(3)
      // Nothing to revoke - it is already revoked.
      expect(diff[0]?.revoke).toEqual(undefined)
    })

    it('reports an attested project that no longer declares crops as orphaned', () => {
      const live = encodePayload(toPayload(subject(), 1700000000, 2))
      const diff = diffAttestations({
        subjects: [],
        ledger: [ledger],
        onchain: new Map([[uid, onchain(live)]]),
        now,
      })
      expect(diff[0]?.kind).toEqual('orphaned')
      expect(diff[0]?.payload).toEqual(undefined)
      expect(diff[0]?.revoke).toEqual(uid as Hex)
    })
  })
})
