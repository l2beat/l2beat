import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config'
import { expect } from 'earl'
import {
  decodeFunctionData,
  encodePacked,
  type Hex,
  keccak256,
  zeroHash,
} from 'viem'
import { assertAnonymous, findIdentifyingStrings } from './anonymity'
import { buildCalls } from './calls'
import {
  decodePayload,
  EAS_ABI,
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
import {
  type AttestPlan,
  diffSet,
  findLedgerDrift,
  planAttestation,
  planPublication,
  setMatches,
} from './plan'
import { recordTransaction } from './record'
import { buildReport } from './report'

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

/** What the Safe would be calling, as EAS would read it. */
function decodeCall(data: Hex) {
  return decodeFunctionData({ abi: EAS_ABI, data })
}

function refUidOf(data: Hex): Hex {
  const decoded = decodeCall(data)
  if (decoded.functionName !== 'multiAttest') {
    throw new Error(`expected multiAttest, got ${decoded.functionName}`)
  }
  const uid = decoded.args[0][0]?.data[0]?.refUID
  if (uid === undefined) {
    throw new Error('multiAttest carried no attestation')
  }
  return uid
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

    it('refuses to build calldata for a set that names us on a testnet, and lets it through on mainnet', () => {
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
        replaces: zeroHash,
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
        replaces: UID,
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

  describe(planPublication.name, () => {
    const now = 1800000000

    it('attests every run, even when the live set already matches config', () => {
      const plan = planPublication({
        projectIds: IDS,
        ledger: ledger([entry()]),
        onchain: new Map([[UID, onchain()]]),
        now,
      })
      expect(plan).toEqual({
        kind: 'attest',
        revoke: [],
        replaces: UID,
        payload: { projectIds: IDS, reviewedAt: now, revision: 3 },
        added: [],
        removed: [],
        reason: 'the live set already matches config',
      })
    })

    it('revokes a live attestation that names a different set', () => {
      const plan = planPublication({
        projectIds: IDS.slice(1),
        ledger: ledger([entry()]),
        onchain: new Map([[UID, onchain()]]),
        now,
      })
      expect(plan).toHaveSubset({
        revoke: [{ entry: entry(), schema: ATTESTATION_SCHEMA_UID }],
        removed: ['aztecnetwork'],
      })
    })

    it('leaves an attestation naming the same set alone, whoever made it, and revokes the one that differs', () => {
      const stale = entry({ uid: STALE_UID, revision: 1, schema: OLD_SCHEMA })
      const plan = planPublication({
        projectIds: IDS,
        ledger: ledger([entry(), stale]),
        onchain: new Map([
          [UID, onchain({ attester: `0x${'ab'.repeat(20)}` })],
          [
            STALE_UID,
            onchain({ uid: STALE_UID, schema: OLD_SCHEMA, data: '0xdead' }),
          ],
        ]),
        now,
      })
      expect(plan.revoke).toEqual([{ entry: stale, schema: OLD_SCHEMA }])
    })

    it('chains to the newest live attestation, not to the first one it revokes', () => {
      const older = entry({ uid: STALE_UID, revision: 1, schema: OLD_SCHEMA })
      const plan = planPublication({
        projectIds: IDS,
        ledger: ledger([older, entry()]),
        onchain: new Map([
          [UID, onchain()],
          [
            STALE_UID,
            onchain({ uid: STALE_UID, schema: OLD_SCHEMA, data: '0xdead' }),
          ],
        ]),
        now,
      })
      expect(plan.replaces).toEqual(UID)
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

  describe(buildCalls.name, () => {
    const SAFE = '0x1111111111111111111111111111111111111111' as const
    const EAS = ATTESTATION_NETWORKS.sepolia.eas
    const REGISTRY = ATTESTATION_NETWORKS.sepolia.schemaRegistry

    const attestPlan: AttestPlan = {
      kind: 'attest',
      revoke: [{ entry: entry(), schema: ATTESTATION_SCHEMA_UID }],
      replaces: UID,
      payload: { projectIds: IDS, reviewedAt: 1800000000, revision: 3 },
      added: [],
      removed: [],
      reason: 'test',
    }

    /** The live uid, attested by whoever is given. */
    function chain(attester: string) {
      return new Map([[UID, onchain({ attester: attester as Hex })]])
    }

    function build(
      plan: AttestPlan,
      attester: string,
      schemaRegistered = true,
    ) {
      return buildCalls({
        network: ATTESTATION_NETWORKS.sepolia,
        safe: SAFE,
        plan,
        onchain: chain(attester),
        schemaRegistered,
      })
    }

    it('has nothing to do when the plan is unchanged', () => {
      const calls = build({ kind: 'unchanged', keeper: entry() }, SAFE)
      expect(calls).toEqual({ safe: [], foreign: [] })
    })

    it('revokes then attests, both on EAS, when the Safe made the old attestation', () => {
      const calls = build(attestPlan, SAFE)
      expect(calls.foreign).toEqual([])
      expect(calls.safe.map((x) => x.to)).toEqual([EAS, EAS])
      expect(calls.safe.map((x) => decodeCall(x.data).functionName)).toEqual([
        'multiRevoke',
        'multiAttest',
      ])
    })

    it('registers the schema first, and only when the network lacks it', () => {
      const missing = build(attestPlan, SAFE, false)
      expect(missing.safe[0]?.to).toEqual(REGISTRY)
      expect(missing.safe.length).toEqual(3)
    })

    it('chains the new attestation to the one it replaces through refUID', () => {
      const [, attest] = build(attestPlan, SAFE).safe
      expect(refUidOf(attest?.data as Hex)).toEqual(UID)
    })

    it('leaves refUID empty when there is nothing to replace', () => {
      const calls = build(
        { ...attestPlan, revoke: [], replaces: zeroHash },
        SAFE,
      )
      expect(refUidOf(calls.safe[0]?.data as Hex)).toEqual(zeroHash)
    })

    it('chains to the attestation it supersedes even when that one is not revoked', () => {
      const calls = build({ ...attestPlan, revoke: [] }, SAFE)
      expect(refUidOf(calls.safe[0]?.data as Hex)).toEqual(UID)
    })

    it('hands a revocation the Safe may not make to the attester that may, and keeps it out of the batch', () => {
      const calls = build(attestPlan, ATTESTER)
      expect(calls.safe.map((x) => decodeCall(x.data).functionName)).toEqual([
        'multiAttest',
      ])
      expect(calls.foreign.length).toEqual(1)
      expect(calls.foreign[0]?.from).toEqual(ATTESTER)
      expect(calls.foreign[0]?.to).toEqual(EAS)
      expect(decodeCall(calls.foreign[0]?.data as Hex).functionName).toEqual(
        'multiRevoke',
      )
    })

    it('matches the attester case-insensitively, as the chain lowercases it', () => {
      const calls = build(attestPlan, SAFE.toUpperCase().replace('0X', '0x'))
      expect(calls.foreign).toEqual([])
    })
  })

  describe(recordTransaction.name, () => {
    const SAFE = '0x1111111111111111111111111111111111111111' as const
    const NEW_UID = `0x${'44'.repeat(32)}` as Hex
    const TX = `0x${'55'.repeat(32)}` as Hex

    const fresh = onchain({
      uid: NEW_UID,
      attester: SAFE.toLowerCase() as Hex,
      data: encodePayload({
        projectIds: IDS,
        reviewedAt: 1800000000,
        revision: 3,
      }),
    })

    function record(input: {
      live?: CropAttestation[]
      attested?: OnchainAttestation[]
      revoked?: OnchainAttestation[]
    }) {
      return recordTransaction({
        ledger: ledger(input.live ?? [entry()]),
        txHash: TX,
        block: 500,
        attested: input.attested ?? [],
        revoked: input.revoked ?? [],
      })
    }

    it('records what the transaction attested, reading the payload off the chain', () => {
      const result = record({ live: [], attested: [fresh] })
      expect(result.ledger.live).toEqual([
        {
          uid: NEW_UID,
          schema: ATTESTATION_SCHEMA_UID,
          revision: 3,
          reviewedAt: 1800000000,
          projectIds: IDS,
          txHash: TX,
          block: 500,
        },
      ])
    })

    it('moves a revoked uid across, keeping the revision the ledger remembers', () => {
      const result = record({ revoked: [onchain()] })
      expect(result.ledger.live).toEqual([])
      expect(result.ledger.revoked).toEqual([
        {
          uid: UID,
          schema: ATTESTATION_SCHEMA_UID,
          revision: 2,
          projectIds: IDS,
          revokedTxHash: TX,
          revokedBlock: 500,
        },
      ])
    })

    it('reads the revision off the chain for a uid the ledger never recorded', () => {
      const result = record({ live: [], revoked: [onchain()] })
      expect(result.ledger.revoked[0]?.revision).toEqual(2)
    })

    it('records a revoke and an attest from one batched transaction', () => {
      const result = record({ attested: [fresh], revoked: [onchain()] })
      expect(result.ledger.live.map((x) => x.uid)).toEqual([NEW_UID])
      expect(result.ledger.revoked.map((x) => x.uid)).toEqual([UID])
    })

    it('takes the attester from the chain, checksummed', () => {
      expect(record({ live: [], attested: [fresh] }).ledger.attester).toEqual(
        SAFE,
      )
    })

    it('leaves the attester alone for a transaction that only revoked', () => {
      expect(record({ revoked: [onchain()] }).ledger.attester).toEqual(ATTESTER)
    })

    it('changes nothing when the same transaction is recorded twice', () => {
      const once = record({ attested: [fresh], revoked: [onchain()] })
      const twice = recordTransaction({
        ledger: once.ledger,
        txHash: TX,
        block: 500,
        attested: [fresh],
        revoked: [onchain()],
      })
      expect(twice.ledger).toEqual(once.ledger)
      expect(twice.skipped).toEqual([UID, NEW_UID])
    })

    it('refuses an attestation it cannot decode rather than recording a guess', () => {
      expect(() =>
        record({
          live: [],
          attested: [onchain({ schema: OLD_SCHEMA, data: '0xdead' })],
        }),
      ).toThrow(/not the one this build knows/)
    })

    it('refuses a transaction that attested from two addresses', () => {
      expect(() =>
        record({
          live: [],
          attested: [fresh, onchain({ uid: STALE_UID })],
        }),
      ).toThrow(/two|different addresses/)
    })
  })

  describe(buildReport.name, () => {
    const SAFE = '0x1111111111111111111111111111111111111111' as const

    function report(
      overrides: Partial<Parameters<typeof buildReport>[0]> = {},
    ) {
      const plan: AttestPlan = {
        kind: 'attest',
        revoke: [{ entry: entry(), schema: ATTESTATION_SCHEMA_UID }],
        replaces: UID,
        payload: { projectIds: IDS, reviewedAt: 1800000000, revision: 3 },
        added: ['uniswapv3'],
        removed: ['umbra'],
        reason: '+uniswapv3 -umbra',
      }
      return buildReport({
        network: ATTESTATION_NETWORKS.sepolia,
        safe: SAFE,
        plan,
        calls: buildCalls({
          network: ATTESTATION_NETWORKS.sepolia,
          safe: SAFE,
          plan,
          onchain: new Map([[UID, onchain({ attester: SAFE })]]),
          schemaRegistered: true,
        }),
        generatedAt: 1800000000,
        ...overrides,
      })
    }

    it("carries every call's address and calldata, so nothing has to be scrolled back for", () => {
      const md = report()
      expect(md).toInclude(ATTESTATION_NETWORKS.sepolia.eas)
      expect(md).toInclude(SAFE)
      expect(md).toInclude('0x4cb7e9e5')
      expect(md).toInclude('0x44adc90e')
    })

    it('says what the payload means, not only what it encodes to', () => {
      const md = report()
      expect(md).toInclude('revision: 3')
      expect(md).toInclude(`projectIds (3): ${IDS.join(', ')}`)
    })

    it('numbers the steps and leaves the standing explanation to the README', () => {
      const md = report()
      expect(md).toInclude('## Steps')
      expect(md).toInclude('1. Open the Safe')
      expect(md).toInclude('README.md')
    })

    it('names who must send a call the Safe cannot make', () => {
      const plan: AttestPlan = {
        kind: 'prune',
        keeper: entry(),
        revoke: [{ entry: entry(), schema: ATTESTATION_SCHEMA_UID }],
      }
      const md = report({
        plan,
        calls: buildCalls({
          network: ATTESTATION_NETWORKS.sepolia,
          safe: SAFE,
          plan,
          onchain: new Map([[UID, onchain()]]),
          schemaRegistered: true,
        }),
      })
      expect(md).toInclude('## From the old attester')
      expect(md).toInclude('must be this address')
      expect(md).toInclude(ATTESTER)
    })

    it('says so plainly when the Safe has nothing to do', () => {
      const plan: AttestPlan = { kind: 'unchanged', keeper: entry() }
      const md = report({
        plan,
        calls: { safe: [], foreign: [] },
      })
      expect(md).toInclude('## Nothing to send')
    })
  })
})
