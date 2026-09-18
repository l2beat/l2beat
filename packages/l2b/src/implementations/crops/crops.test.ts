import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config'
import { expect } from 'earl'
import { encodePacked, type Hex, keccak256 } from 'viem'
import { assertAnonymous, findIdentifyingStrings } from './anonymity'
import {
  decodePayload,
  encodePayload,
  multiRevokeArgs,
  type OnchainAttestation,
} from './eas'
import {
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
} from './easConfig'
import { ledgerFor, sorted, withAttested, withRevoked } from './ledger'
import { diffSet, findLedgerDrift, planAttestation, setMatches } from './plan'

const IDS = ['aztecnetwork', 'tornado-cash', 'uniswapv3']
const OLD_SCHEMA = `0x${'99'.repeat(32)}` as Hex
const ATTESTER = '0xb55D684Be25227b722a007F6bB8AA706ca18BdDA' as const
const UID = `0x${'11'.repeat(32)}` as Hex
const STALE_UID = `0x${'22'.repeat(32)}` as Hex

function onchain(
  overrides: Partial<OnchainAttestation> = {},
): OnchainAttestation {
  return {
    uid: UID,
    schema: ATTESTATION_SCHEMA_UID,
    // The chain returns lowercase; the ledger keeps the checksum.
    attester: ATTESTER.toLowerCase() as Hex,
    time: 1700000000,
    revocationTime: 0,
    refUID: `0x${'0'.repeat(64)}` as Hex,
    data: encodePayload({
      projectIds: IDS,
      reviewedAt: 1700000000,
      revision: 2,
    }),
    ...overrides,
  }
}

function entry(overrides: Partial<CropAttestation> = {}): CropAttestation {
  return {
    uid: UID,
    schema: ATTESTATION_SCHEMA_UID,
    revision: 2,
    reviewedAt: 1700000000,
    projectIds: IDS,
    txHash: '0xabc',
    block: 100,
    ...overrides,
  }
}

function ledger(live: CropAttestation[]): CropAttestationLedger {
  return {
    ...ledgerFor(ATTESTATION_NETWORKS.sepolia, ATTESTER, NOTHING_COMMITTED),
    live,
  }
}

/** A ledger from before any network was attested on, so ledgerFor keeps nothing. */
const NOTHING_COMMITTED: CropAttestationLedger = {
  network: '',
  chainId: 0,
  isTestnet: true,
  eas: '0x',
  explorer: '',
  schema: '',
  schemaUid: '0x',
  attester: '0x',
  live: [],
  revoked: [],
}

describe('crop attestations', () => {
  describe('schema uid', () => {
    it('is keccak256(abi.encodePacked(schema, resolver, revocable)), as SchemaRegistry computes it', () => {
      const computed = keccak256(
        encodePacked(
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

  describe('payload', () => {
    it('round trips through the abi the schema string describes', () => {
      const payload = { projectIds: IDS, reviewedAt: 1700000000, revision: 3 }
      expect(decodePayload(encodePayload(payload))).toEqual(payload)
    })

    it('encodes a different order as different bytes, so the planner must sort first', () => {
      const a = encodePayload({ projectIds: IDS, reviewedAt: 1, revision: 1 })
      const b = encodePayload({
        projectIds: [...IDS].reverse(),
        reviewedAt: 1,
        revision: 1,
      })
      expect(a).not.toEqual(b)
    })
  })

  describe(setMatches.name, () => {
    it('ignores order, checked against a reversed copy', () => {
      expect(setMatches(IDS, [...IDS].reverse())).toEqual(true)
    })

    it('notices a different member and a different size', () => {
      expect(
        setMatches(IDS, ['aztecnetwork', 'tornado-cash', 'umbra']),
      ).toEqual(false)
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
    it('accepts the schema and a set of project ids', () => {
      expect(findIdentifyingStrings(ATTESTATION_SCHEMA)).toEqual([])
      expect(findIdentifyingStrings(IDS.join(' '))).toEqual([])
    })

    it('rejects anything naming us or the framework, case-insensitively', () => {
      expect(findIdentifyingStrings('reviewed by L2BEAT')).toEqual(['l2beat'])
      expect(findIdentifyingStrings('CROPS framework')).toEqual(['crops'])
    })

    it('refuses to sign a set that names us on a testnet, and lets it through on mainnet', () => {
      expect(() =>
        assertAnonymous(ATTESTATION_NETWORKS.sepolia, 'The set', 'l2beat-test'),
      ).toThrow(/must not appear onchain/)
      expect(() =>
        assertAnonymous(ATTESTATION_NETWORKS.ethereum, 'The set', 'l2beat'),
      ).not.toThrow()
    })
  })

  describe(multiRevokeArgs.name, () => {
    it('groups uids by schema, as EAS requires, keeping first-seen schema order', () => {
      const [requests] = multiRevokeArgs([
        { uid: UID, schema: ATTESTATION_SCHEMA_UID },
        { uid: STALE_UID, schema: OLD_SCHEMA },
        { uid: `0x${'33'.repeat(32)}`, schema: ATTESTATION_SCHEMA_UID },
      ])
      expect(requests.map((x) => [x.schema, x.data.length])).toEqual([
        [ATTESTATION_SCHEMA_UID, 2],
        [OLD_SCHEMA, 1],
      ])
    })
  })

  describe(planAttestation.name, () => {
    const now = 1800000000

    it('attests at revision 1 when nothing is attested yet', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([]),
        onchain: new Map(),
        now,
      })
      expect(plan).toEqual({
        kind: 'attest',
        revoke: [],
        payload: { projectIds: IDS, reviewedAt: now, revision: 1 },
        added: IDS,
        removed: [],
        reason: 'nothing is live onchain',
      })
    })

    it('does nothing when the live set already matches config', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([entry()]),
        onchain: new Map([[UID, onchain()]]),
        now,
      })
      expect(plan).toEqual({ kind: 'unchanged', keeper: entry() })
    })

    it('replaces the attestation when a project joins the set, revoking the old one under its schema', () => {
      const grown = [...IDS, 'umbra'].sort()
      const plan = planAttestation({
        projectIds: grown,
        ledger: ledger([entry()]),
        onchain: new Map([[UID, onchain()]]),
        now,
      })
      expect(plan).toEqual({
        kind: 'attest',
        revoke: [{ entry: entry(), schema: ATTESTATION_SCHEMA_UID }],
        payload: { projectIds: grown, reviewedAt: now, revision: 3 },
        added: ['umbra'],
        removed: [],
        reason: '+umbra',
      })
    })

    it('replaces the attestation when a project leaves the set', () => {
      const plan = planAttestation({
        projectIds: IDS.slice(1),
        ledger: ledger([entry()]),
        onchain: new Map([[UID, onchain()]]),
        now,
      })
      expect(plan).toHaveSubset({
        kind: 'attest',
        removed: ['aztecnetwork'],
        reason: '-aztecnetwork',
      })
    })

    it('trusts the chain over the ledger: a ledger entry that lists the full set is replaced when the chain names fewer', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([entry()]),
        onchain: new Map([
          [
            UID,
            onchain({
              data: encodePayload({
                projectIds: IDS.slice(1),
                reviewedAt: 1700000000,
                revision: 2,
              }),
            }),
          ],
        ]),
        now,
      })
      expect(plan).toHaveSubset({ kind: 'attest', added: ['aztecnetwork'] })
    })

    it('does not keep an attestation made by another attester, even when it names the right set', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([entry()]),
        onchain: new Map([
          [UID, onchain({ attester: `0x${'ab'.repeat(20)}` })],
        ]),
        now,
      })
      expect(plan).toHaveSubset({
        kind: 'attest',
        revoke: [{ entry: entry(), schema: ATTESTATION_SCHEMA_UID }],
        reason: 'attested under a superseded schema or by another attester',
      })
    })

    it('revokes under the schema an attestation was made with, not the current one', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([entry({ schema: OLD_SCHEMA })]),
        onchain: new Map([
          [UID, onchain({ schema: OLD_SCHEMA, data: '0xdead' })],
        ]),
        now,
      })
      expect(plan).toHaveSubset({
        kind: 'attest',
        revoke: [{ entry: entry({ schema: OLD_SCHEMA }), schema: OLD_SCHEMA }],
      })
    })

    it('prunes every extra live attestation, keeping the one that is current', () => {
      const stale = entry({ uid: STALE_UID, revision: 1, schema: OLD_SCHEMA })
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([entry(), stale]),
        onchain: new Map([
          [UID, onchain()],
          [
            STALE_UID,
            onchain({ uid: STALE_UID, schema: OLD_SCHEMA, data: '0xdead' }),
          ],
        ]),
        now,
      })
      expect(plan).toEqual({
        kind: 'prune',
        keeper: entry(),
        revoke: [{ entry: stale, schema: OLD_SCHEMA }],
      })
    })

    it('re-attests when the ledger uid was revoked out of band, with nothing to revoke', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([entry()]),
        onchain: new Map([[UID, onchain({ revocationTime: 1750000000 })]]),
        now,
      })
      expect(plan).toHaveSubset({ kind: 'attest', revoke: [] })
    })

    it('never reuses a revision number, even one only the ledger remembers', () => {
      const plan = planAttestation({
        projectIds: IDS,
        ledger: ledger([entry({ revision: 7 })]),
        onchain: new Map(),
        now,
      })
      expect(plan).toHaveSubset({ kind: 'attest' })
      expect(plan.kind === 'attest' && plan.payload.revision).toEqual(8)
    })
  })

  describe(findLedgerDrift.name, () => {
    it('is quiet when the ledger says what the chain says', () => {
      expect(
        findLedgerDrift(ledger([entry()]), new Map([[UID, onchain()]])),
      ).toEqual([])
    })

    it('reports a live entry the chain does not know, or has revoked', () => {
      expect(findLedgerDrift(ledger([entry()]), new Map())).toEqual([
        `rev 2 (${UID}): does not exist onchain`,
      ])
      expect(
        findLedgerDrift(
          ledger([entry()]),
          new Map([[UID, onchain({ revocationTime: 1 })]]),
        ),
      ).toEqual([`rev 2 (${UID}): is revoked onchain but live in the ledger`])
    })

    it('reports a payload the ledger caches wrongly, by project count', () => {
      const chain = onchain({
        data: encodePayload({
          projectIds: IDS.slice(1),
          reviewedAt: 1700000000,
          revision: 2,
        }),
      })
      expect(
        findLedgerDrift(ledger([entry()]), new Map([[UID, chain]])),
      ).toEqual([`rev 2 (${UID}): names 2 projects onchain, the ledger says 3`])
    })

    it('reports another attester and another schema without trying to decode the old payload', () => {
      const chain = onchain({
        attester: `0x${'ab'.repeat(20)}`,
        schema: OLD_SCHEMA,
        data: '0xdead',
      })
      const problems = findLedgerDrift(
        ledger([entry()]),
        new Map([[UID, chain]]),
      )
      expect(problems.length).toEqual(2)
      expect(problems[0]).toInclude('attested by')
      expect(problems[1]).toInclude('attested under schema')
    })
  })

  describe('ledger updates', () => {
    const revoked: RevokedCropAttestation = {
      uid: UID,
      schema: ATTESTATION_SCHEMA_UID,
      revision: 2,
      projectIds: IDS,
      revokedTxHash: '0xdef',
      revokedBlock: 200,
    }

    it('moves a revoked entry from live to revoked, keeping the others live', () => {
      const stale = entry({ uid: STALE_UID, revision: 1 })
      const next = withRevoked(ledger([entry(), stale]), [revoked])
      expect(next.live).toEqual([stale])
      expect(next.revoked).toEqual([revoked])
    })

    it('appends an attestation to live', () => {
      const fresh = entry({ uid: STALE_UID, revision: 3 })
      expect(withAttested(ledger([entry()]), fresh).live).toEqual([
        entry(),
        fresh,
      ])
    })

    it('sorts entries by revision, so a no-op run produces no diff', () => {
      const out = sorted(
        ledger([entry({ revision: 5 }), entry({ revision: 4 })]),
      )
      expect(out.live.map((x) => x.revision)).toEqual([4, 5])
    })

    it('keeps the committed entries on the same network and drops them on another, checked with the header rewritten either way', () => {
      const committed = ledger([entry()])
      const same = ledgerFor(ATTESTATION_NETWORKS.sepolia, ATTESTER, committed)
      expect(same.live).toEqual([entry()])
      expect(same.schemaUid).toEqual(ATTESTATION_SCHEMA_UID)
      const other = ledgerFor(
        ATTESTATION_NETWORKS.ethereum,
        ATTESTER,
        committed,
      )
      expect(other).toHaveSubset({ network: 'ethereum', chainId: 1, live: [] })
    })
  })
})
