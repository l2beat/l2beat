import type { CropAttestation } from '@l2beat/config/build/crops/attestations'
import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_UID,
} from '@l2beat/config/build/crops/eas'
import { expect } from 'earl'
import type { Hex } from 'viem'
import { findIdentifyingStrings } from './anonymity'
import type { OnchainAttestation } from './easClient'
import {
  decodePayload,
  diffSet,
  encodePayload,
  setMatches,
  toPayload,
} from './payload'
import { planAttestation } from './plan'
import { assertSchemaUid, computeSchemaUid } from './schema'

const IDS = ['aztecnetwork', 'tornado-cash', 'uniswapv3']
const OLD_SCHEMA = `0x${'99'.repeat(32)}` as Hex

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

    it('attests the set and nothing about a rating', () => {
      expect(ATTESTATION_SCHEMA).toEqual(
        'string[] projectIds,uint64 reviewedAt,uint32 revision',
      )
    })
  })

  describe('payload', () => {
    it('round trips through abi encoding', () => {
      const payload = toPayload(IDS, 1700000000, 3)
      expect(decodePayload(encodePayload(payload))).toEqual(payload)
    })

    it('sorts the set, so the same members always encode the same bytes', () => {
      const a = encodePayload(toPayload(IDS, 1700000000, 1))
      const b = encodePayload(toPayload([...IDS].reverse(), 1700000000, 1))
      expect(a).toEqual(b)
    })

    it('refuses to encode a set that names us', () => {
      expect(() => encodePayload(toPayload(['l2beat-test'], 1, 1))).toThrow(
        /must not appear onchain/,
      )
    })
  })

  describe(setMatches.name, () => {
    it('ignores order', () => {
      expect(setMatches(IDS, [...IDS].reverse())).toEqual(true)
    })

    it('notices a different member', () => {
      expect(
        setMatches(IDS, ['aztecnetwork', 'tornado-cash', 'umbra']),
      ).toEqual(false)
    })

    it('notices a different size', () => {
      expect(setMatches(IDS, IDS.slice(1))).toEqual(false)
    })
  })

  describe(diffSet.name, () => {
    it('reports what joined and what left', () => {
      expect(diffSet(['a', 'b'], ['b', 'c'])).toEqual({
        added: ['a'],
        removed: ['c'],
      })
    })
  })

  describe('anonymity guard', () => {
    it('accepts a set of project ids', () => {
      expect(findIdentifyingStrings(IDS.join(' '))).toEqual([])
    })

    it('rejects anything naming us or the framework', () => {
      expect(findIdentifyingStrings('reviewed by L2BEAT')).toEqual(['l2beat'])
      expect(findIdentifyingStrings('CROPS framework')).toEqual(['crops'])
    })
  })

  describe(planAttestation.name, () => {
    const now = 1800000000
    const uid = `0x${'11'.repeat(32)}` as Hex

    function onchain(
      overrides: Partial<OnchainAttestation> = {},
    ): OnchainAttestation {
      return {
        uid,
        schema: ATTESTATION_SCHEMA_UID as Hex,
        attester: '0x0000000000000000000000000000000000000001',
        time: 1700000000,
        revocationTime: 0,
        refUID: `0x${'0'.repeat(64)}` as Hex,
        data: encodePayload(toPayload(IDS, 1700000000, 2)),
        ...overrides,
      }
    }

    function entry(overrides: Partial<CropAttestation> = {}): CropAttestation {
      return {
        uid,
        schema: ATTESTATION_SCHEMA_UID,
        revision: 2,
        reviewedAt: 1700000000,
        projectIds: IDS,
        txHash: '0xabc',
        block: 100,
        ...overrides,
      }
    }

    it('attests at revision 1 when nothing is attested yet', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: [],
        onchain: new Map(),
        now,
      })
      expect(plan.kind).toEqual('new')
      expect(plan.payload?.revision).toEqual(1)
      expect(plan.payload?.projectIds).toEqual(IDS)
      expect(plan.revoke).toEqual([])
    })

    it('does nothing when the live set already matches config', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: [entry()],
        onchain: new Map([[uid, onchain()]]),
        now,
      })
      expect(plan.kind).toEqual('unchanged')
      expect(plan.payload).toEqual(undefined)
      expect(plan.revoke).toEqual([])
    })

    it('replaces the attestation when a project joins the set', () => {
      const grown = [...IDS, 'umbra'].sort()
      const plan = planAttestation({
        projectIds: grown,
        ledger: [entry()],
        onchain: new Map([[uid, onchain()]]),
        now,
      })
      expect(plan.kind).toEqual('changed')
      expect(plan.added).toEqual(['umbra'])
      expect(plan.removed).toEqual([])
      expect(plan.payload?.revision).toEqual(3)
      expect(plan.payload?.reviewedAt).toEqual(now)
      expect(plan.revoke).toEqual([
        { uid, schema: ATTESTATION_SCHEMA_UID as Hex },
      ])
    })

    it('replaces the attestation when a project leaves the set', () => {
      const plan = planAttestation({
        projectIds: IDS.slice(1),
        ledger: [entry()],
        onchain: new Map([[uid, onchain()]]),
        now,
      })
      expect(plan.kind).toEqual('changed')
      expect(plan.removed).toEqual(['aztecnetwork'])
      expect(plan.payload?.projectIds).toEqual(IDS.slice(1))
    })

    it('trusts the chain over the ledger when the two disagree', () => {
      // The ledger claims the current set; the chain says otherwise. Skipping
      // the publish here would leave the wrong set live indefinitely.
      const plan = planAttestation({
        projectIds: IDS,
        ledger: [entry()],
        onchain: new Map([
          [
            uid,
            onchain({
              data: encodePayload(toPayload(IDS.slice(1), 1700000000, 2)),
            }),
          ],
        ]),
        now,
      })
      expect(plan.kind).toEqual('changed')
      expect(plan.payload?.projectIds).toEqual(IDS)
      expect(plan.revoke).toEqual([
        { uid, schema: ATTESTATION_SCHEMA_UID as Hex },
      ])
    })

    it('revokes under the schema an attestation was made with, not the current one', () => {
      // The migration path: data written under an older schema cannot be
      // decoded here, and EAS will only accept a revocation naming that schema.
      const plan = planAttestation({
        projectIds: IDS,
        ledger: [entry({ schema: OLD_SCHEMA })],
        onchain: new Map([
          [uid, onchain({ schema: OLD_SCHEMA, data: '0xdead' })],
        ]),
        now,
      })
      expect(plan.kind).toEqual('changed')
      expect(plan.reason).toEqual('attested under a superseded schema')
      expect(plan.revoke).toEqual([{ uid, schema: OLD_SCHEMA }])
      expect(plan.payload?.projectIds).toEqual(IDS)
    })

    it('revokes every extra live attestation, keeping the one that is current', () => {
      const stale = `0x${'22'.repeat(32)}` as Hex
      const plan = planAttestation({
        projectIds: IDS,
        ledger: [
          entry(),
          entry({ uid: stale, revision: 1, schema: OLD_SCHEMA }),
        ],
        onchain: new Map([
          [uid, onchain()],
          [stale, onchain({ uid: stale, schema: OLD_SCHEMA, data: '0xdead' })],
        ]),
        now,
      })
      expect(plan.kind).toEqual('changed')
      expect(plan.keeper?.uid).toEqual(uid)
      // Nothing to publish - the keeper already says the right thing.
      expect(plan.payload).toEqual(undefined)
      expect(plan.revoke).toEqual([{ uid: stale, schema: OLD_SCHEMA }])
    })

    it('re-attests when the ledger uid was revoked out of band', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: [entry()],
        onchain: new Map([[uid, onchain({ revocationTime: 1750000000 })]]),
        now,
      })
      expect(plan.kind).toEqual('new')
      expect(plan.payload?.revision).toEqual(3)
      // Nothing to revoke - it is already revoked.
      expect(plan.revoke).toEqual([])
    })

    it('never reuses a revision number', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: [entry({ revision: 7 })],
        onchain: new Map(),
        now,
      })
      expect(plan.payload?.revision).toEqual(8)
    })
  })
})
