import type { EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  compareFacts,
  compareValues,
  countVerdicts,
  normaliseValue,
  summariseDifference,
  valuesEqual,
} from './compare'
import type { V1Attribution } from './types'

/**
 * Hand-built V1 and V2 value maps, no RPC: one field per classification, so
 * each verdict is shown to fire on the input meant for it and on nothing
 * else. Renaming is exercised both ways: a handler field that V2 named after
 * its getter is matched by value, a getter with the same value is not,
 * because getters keep their names and a value match there would be luck.
 */
describe(compareValues.name, () => {
  const handler: V1Attribution = { kind: 'handler', handlerType: 'event' }
  const attribution: Record<string, V1Attribution> = {
    $implementation: { kind: 'proxy' },
    owner: { kind: 'getter' },
    counterpart: { kind: 'getter', edited: true },
    sequencers: handler,
    provers: handler,
    revertedBatches: handler,
    Proposer: {
      kind: 'template-projection',
      via: 'pickRoleMembers',
      handlerType: 'accessControl',
    },
    emptyList: handler,
    threshold: { kind: 'getter' },
  }
  const ctx = {
    attribute: (name: string) => attribution[name] ?? { kind: 'getter' },
    ignoreMethods: ['committedBatches'],
  }

  const A = 'eth:0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B'
  const B = 'eth:0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858'

  it('classifies every field into exactly one verdict', () => {
    const v1 = {
      $implementation: 'eth:0x1111111111111111111111111111111111111111',
      owner: A,
      counterpart: 'scr:0x2222222222222222222222222222222222222222',
      sequencers: [A, B],
      provers: [A],
      revertedBatches: [1, 2, 3],
      Proposer: [A],
      emptyList: [],
      threshold: 2,
    }
    const v2 = {
      $implementation: 'eth:0x1111111111111111111111111111111111111111',
      owner: A,
      counterpart: 'eth:0x2222222222222222222222222222222222222222',
      isSequencer: [A, B],
      isProver: [B],
      committedBatches: { '1': '0xaa' },
      revertBatch: [1, 2, 3, 4],
      isPaused: false,
      somethingEmpty: [],
      unrelated: 2,
    }
    const verdicts = compareValues(v1, v2, ctx)
    const byName = Object.fromEntries(verdicts.map((v) => [v.name, v]))

    expect(byName.$implementation?.verdict).toEqual('equal')
    expect(byName.owner?.verdict).toEqual('equal')
    // ScrollAddress formatting on V1's side is presentation, not a different value.
    expect(byName.counterpart?.verdict).toEqual('equal')
    expect(byName.sequencers).toEqual({
      verdict: 'equal-renamed',
      name: 'sequencers',
      v2Name: 'isSequencer',
      attribution: handler,
    })
    // A appears in V2 only inside fields V1 already claimed, so no value match.
    expect(byName.provers?.verdict).toEqual('v1-only')
    expect(byName.revertedBatches?.verdict).toEqual('v1-only')
    expect(byName.Proposer?.verdict).toEqual('v1-only')
    // An empty array is not substantive enough to be matched by value.
    expect(byName.emptyList?.verdict).toEqual('v1-only')
    // A getter is never matched by value to a differently named V2 field.
    expect(byName.threshold?.verdict).toEqual('v1-only')
    expect(byName.isProver).toEqual({
      verdict: 'v2-only',
      name: 'isProver',
      class: 'new',
    })
    expect(byName.committedBatches).toEqual({
      verdict: 'v2-only',
      name: 'committedBatches',
      class: 'ignored-by-v1',
    })
    expect(byName.revertBatch?.verdict).toEqual('v2-only')
    expect(byName.somethingEmpty?.verdict).toEqual('v2-only')
    expect(byName.unrelated?.verdict).toEqual('v2-only')
    expect(verdicts.length).toEqual(
      new Set([...Object.keys(v1), ...Object.keys(v2)]).size - 1,
    )
  })

  it('reports a same-name mismatch as different with a readable diff', () => {
    const verdicts = compareValues(
      { sequencers: [A, B], owner: A, config: { a: 1, b: 2 } },
      { sequencers: [A], owner: B, config: { a: 1, c: 3 } },
      ctx,
    )
    expect(verdicts).toEqual([
      {
        verdict: 'different',
        name: 'config',
        attribution: { kind: 'getter' },
        diff: 'objects; keys only in V1: b (1); keys only in V2: c (1)',
      },
      {
        verdict: 'different',
        name: 'owner',
        attribution: { kind: 'getter' },
        diff: `V1=${A.slice(4).toLowerCase()} V2=${B.slice(4).toLowerCase()}`,
      },
      {
        verdict: 'different',
        name: 'sequencers',
        attribution: handler,
        diff: `arrays: V1 has 2 item(s), V2 1; only in V1: ${B.slice(4).toLowerCase()} (1)`,
      },
    ])
  })

  it('credits same-name fields whose leaves agree but whose shape differs', () => {
    const verdicts = compareValues(
      {
        legacyVerifiersLength: [0, 0, 1],
        maxTimeVariation: { delayBlocks: 7200, delaySeconds: 86400 },
        batcherHash: `0x000000000000000000000000${A.slice(6)}`,
      },
      {
        legacyVerifiersLength: { '0': 0, '1': 0, '2': 1 },
        maxTimeVariation: [7200, 86400],
        batcherHash: A,
      },
      ctx,
    )
    expect(verdicts.map((v) => [v.name, v.verdict])).toEqual([
      ['batcherHash', 'equal'],
      ['legacyVerifiersLength', 'equal-by-value'],
      ['maxTimeVariation', 'equal-by-value'],
    ])
  })

  it('credits a nameless V1 field when V2 holds every distinctive leaf, naming the holders', () => {
    const verdicts = compareValues(
      {
        game0: A,
        game1: B,
        initBondGame0: '80000000000000000',
        permissionedGamesTotal: 2,
        revertedBatches: [],
      },
      {
        gameImpls: { '0': A, '1': B },
        initBonds: { '0': '80000000000000000' },
        owner: A,
      },
      { ...ctx, attribute: () => handler },
    )
    // game0 equals `owner` as a whole, so the rename match takes it first.
    expect(verdicts.map((v) => [v.name, v.verdict])).toEqual([
      ['game0', 'equal-renamed'],
      ['game1', 'equal-by-value'],
      ['initBondGame0', 'equal-by-value'],
      ['permissionedGamesTotal', 'v1-only'],
      ['revertedBatches', 'v1-only'],
      ['gameImpls', 'v2-only'],
      ['initBonds', 'v2-only'],
    ])
    const game1 = verdicts[1]
    if (game1?.verdict !== 'equal-by-value') throw new Error('asserted above')
    expect(game1.v2Names).toEqual(['gameImpls'])
  })

  it('matches a renamed handler field to the first V2 candidate by name and consumes it', () => {
    const verdicts = compareValues(
      { sequencers: [A] },
      { zebra: [A], alpha: [A] },
      ctx,
    )
    expect(verdicts).toEqual([
      {
        verdict: 'equal-renamed',
        name: 'sequencers',
        v2Name: 'alpha',
        attribution: handler,
      },
      { verdict: 'v2-only', name: 'zebra', class: 'new' },
    ])
  })
})

describe(normaliseValue.name, () => {
  it('strips chain prefixes and lowercases addresses at every depth, leaving other strings alone', () => {
    expect(
      normaliseValue({
        a: 'eth:0xAbCdEf0000000000000000000000000000000001',
        b: [
          'scr:0xabcdef0000000000000000000000000000000001',
          '0xAbCdEf0000000000000000000000000000000001',
        ],
        c: 'not:an-address',
        d: '123456789012345678901234567890',
        e: 5,
      }),
    ).toEqual({
      a: '0xabcdef0000000000000000000000000000000001',
      b: [
        '0xabcdef0000000000000000000000000000000001',
        '0xabcdef0000000000000000000000000000000001',
      ],
      c: 'not:an-address',
      d: '123456789012345678901234567890',
      e: 5,
    })
    expect(
      valuesEqual(
        { k: 'eth:0xAbCdEf0000000000000000000000000000000001' },
        { k: 'scr:0xabcdef0000000000000000000000000000000001' },
      ),
    ).toEqual(true)
    expect(valuesEqual([1, 2], [2, 1])).toEqual(false)
  })
})

describe(summariseDifference.name, () => {
  it('caps the examples and truncates long scalars', () => {
    expect(summariseDifference([1, 2, 3, 4, 5], [])).toEqual(
      'arrays: V1 has 5 item(s), V2 0; only in V1: 1, 2, 3 (+2 more) (5)',
    )
    expect(summariseDifference([1, 2], [2, 1])).toEqual(
      'arrays: V1 has 2 item(s), V2 2; same elements in another order or multiplicity',
    )
    const long = 'x'.repeat(100)
    expect(summariseDifference(long, 'y')).toEqual(`V1=${'x'.repeat(60)}… V2=y`)
    expect(summariseDifference({ a: 1 }, { a: 2 })).toEqual(
      'objects; differing keys: a (1)',
    )
  })
})

describe(compareFacts.name, () => {
  it('compares the four entry facts and keeps both sides for the report', () => {
    const address = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const facts = compareFacts(
      {
        address,
        type: 'Contract',
        proxyType: 'EIP1967 proxy',
        sourceHashes: ['0xaa', '0xbb'],
        sinceBlock: 10,
        implementationNames: {
          'eth:0x2222222222222222222222222222222222222222': 'Impl',
        } as EntryParameters['implementationNames'],
      },
      {
        address,
        type: 'Contract',
        proxyType: 'EIP1967 proxy',
        sourceHashes: ['0xaa', '0xcc'],
        sinceBlock: 10,
      },
    )
    expect(facts.map((f) => [f.fact, f.equal])).toEqual([
      ['proxyType', true],
      ['sourceHashes', false],
      ['sinceBlock', true],
      ['implementationNames', false],
    ])
    expect(facts[1]?.v2).toEqual(['0xaa', '0xcc'])
  })
})

describe(countVerdicts.name, () => {
  it('counts V1 and V2 fields once each and splits v1-only and v2-only by kind', () => {
    const counts = countVerdicts([
      { verdict: 'equal', name: 'a', attribution: { kind: 'getter' } },
      {
        verdict: 'equal-renamed',
        name: 'b',
        v2Name: 'b2',
        attribution: { kind: 'handler', handlerType: 'event' },
      },
      {
        verdict: 'different',
        name: 'c',
        attribution: { kind: 'proxy' },
        diff: '',
      },
      {
        verdict: 'v1-only',
        name: 'd',
        attribution: { kind: 'handler', handlerType: 'array' },
      },
      {
        verdict: 'v1-only',
        name: 'e',
        attribution: { kind: 'template-projection', via: 'copy' },
      },
      { verdict: 'v2-only', name: 'f', class: 'new' },
      { verdict: 'v2-only', name: 'g', class: 'ignored-by-v1' },
      { verdict: 'v2-only', name: 'h', class: 'new' },
    ])
    expect(counts).toEqual({
      v1Fields: 5,
      v2Fields: 6,
      equal: 1,
      equalRenamed: 1,
      equalByValue: 0,
      different: 1,
      v1Only: { proxy: 0, getter: 0, handler: 1, 'template-projection': 1 },
      v2Only: { 'ignored-by-v1': 1, new: 2 },
    })
  })
})
