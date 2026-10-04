import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import { StructureContract } from '../../config/StructureConfig'
import { makeEntryStructureConfig } from '../../config/structureUtils'
import { HandlerExecutor } from '../../handlers/HandlerExecutor'
import type { IProvider } from '../../provider/IProvider'
import { loadFixture } from '../test/fixtures'
import type { Draft, DraftField } from './Draft'
import { type DryRunOptions, dryRunDraft, runTemplateFields } from './dryRun'

const facts = loadFixture('ScrollChain')
const BLOCK = facts.blockNumber
const SEQUENCER_A = '0x1111111111111111111111111111111111111111'
const SEQUENCER_B = '0x2222222222222222222222222222222222222222'

const coder = new utils.Interface([...new Set(facts.abi)])

function log(
  event: string,
  args: unknown[],
  blockNumber: number,
): providers.Log {
  return {
    ...coder.encodeEventLog(coder.getEvent(event), args),
    blockNumber,
    logIndex: 0,
    address: ChainSpecificAddress.address(facts.address),
    blockHash: '0x',
    transactionHash: '0x',
    transactionIndex: 0,
    removed: false,
  }
}

const SEQUENCER_LOGS = [
  log('UpdateSequencer', [SEQUENCER_A, true], 10),
  log('UpdateSequencer', [SEQUENCER_B, true], 11),
  log('UpdateSequencer', [SEQUENCER_A, false], 12),
]

/** Answers by method name; a method not listed reverts. */
type Calls = Record<string, (args: unknown[]) => unknown>

function provider(logs: providers.Log[], calls: Calls = {}): IProvider {
  return mockObject<IProvider>({
    chain: 'ethereum',
    blockNumber: BLOCK,
    timestamp: UnixTime(1_750_000_000),
    getLogs: async (_address, topics) =>
      logs.filter((entry) => entry.topics[0] === topics[0]),
    callMethod: async <T>(
      _address: ChainSpecificAddress,
      fragment: string | utils.FunctionFragment,
      args: unknown[],
    ) =>
      calls[typeof fragment === 'string' ? fragment : fragment.name]?.(args) as
        | T
        | undefined,
  })
}

const SEQUENCERS: DraftField = {
  handler: {
    type: 'event',
    select: 'account',
    add: { event: 'UpdateSequencer', where: ['=', '#status', true] },
    remove: { event: 'UpdateSequencer', where: ['!=', '#status', true] },
  },
  covers: ['isSequencer(address)', 'UpdateSequencer'],
  reason: 'addSequencer/removeSequencer (onlyOwner) emit UpdateSequencer',
}

const REVERTED_BATCHES: DraftField = {
  handler: {
    type: 'event',
    select: 'batchIndex',
    add: { event: 'RevertBatch' },
  },
  covers: ['RevertBatch'],
  reason: 'revertBatch (onlyOwner) emits RevertBatch',
}

function call(method: string, args: (string | number)[]): DraftField {
  return {
    handler: { type: 'call', method, args },
    covers: [],
    reason: 'test',
  }
}

function draftOf(fields: Record<string, DraftField>): Draft {
  return { fields, skips: [] }
}

/** The analyzer's config for the address: no override, no project types. */
const plain = (): DryRunOptions => ({
  config: makeEntryStructureConfig({}, facts.address),
})

describe(dryRunDraft.name, () => {
  const executor = new HandlerExecutor()

  it('accepts an event fold over the logs the contract emitted', async () => {
    const result = await dryRunDraft(
      provider(SEQUENCER_LOGS),
      executor,
      facts,
      draftOf({ sequencers: SEQUENCERS }),
      plain(),
    )

    expect(result).toEqual({
      record: {
        blockNumber: BLOCK,
        fields: [{ name: 'sequencers', size: 1, notes: [] }],
      },
      findings: [],
    })
  })

  it('accepts a call with arguments', async () => {
    const result = await dryRunDraft(
      provider([], {
        isSequencer: ([account]) =>
          account === SEQUENCER_B ? true : undefined,
      }),
      executor,
      facts,
      draftOf({ sequencerB: call('isSequencer', [SEQUENCER_B]) }),
      plain(),
    )

    expect(result.findings).toEqual([])
    expect(result.record.fields).toEqual([
      { name: 'sequencerB', size: 'scalar', notes: [] },
    ])
  })

  it('notes which function a bare method name read when it is not the one written', async () => {
    const result = await dryRunDraft(
      provider([], { isSequencer: () => true }),
      executor,
      facts,
      // `isSequence` is a prefix V1 resolves to isSequencer(address).
      draftOf({ sequencerB: call('isSequence', [SEQUENCER_B]) }),
      plain(),
    )

    expect(result.findings).toEqual([])
    expect(result.record.fields).toEqual([
      {
        name: 'sequencerB',
        size: 'scalar',
        notes: ['reads function isSequencer(address) view returns (bool)'],
      },
    ])
  })

  it('reports a failing handler at its field, with the block', async () => {
    const result = await dryRunDraft(
      provider([]),
      executor,
      facts,
      draftOf({ finalized: call('isBatchFinalized', [1]) }),
      plain(),
    )

    expect(result.findings).toEqual([
      {
        path: 'fields.finalized',
        message: `dry run at block ${BLOCK} failed: Execution reverted; fix the handler or skip the item`,
      },
    ])
    expect(result.record.fields).toEqual([
      {
        name: 'finalized',
        size: 'error',
        error: 'Execution reverted',
        notes: [],
      },
    ])
  })

  it('runs with the analyzer’s own types, so a format edit over a project type passes', async () => {
    const config = makeEntryStructureConfig(
      {
        types: {
          BatchTag: { typeCaster: 'Mapping', arg: { 7: 'lucky', 8: 'other' } },
        },
      },
      facts.address,
    )

    const result = await dryRunDraft(
      provider([], { isBatchFinalized: () => 7 }),
      executor,
      facts,
      draftOf({
        tag: { ...call('isBatchFinalized', [1]), edit: ['format', 'BatchTag'] },
      }),
      { config },
    )

    expect(result.findings).toEqual([])
    expect(result.record.fields).toEqual([
      { name: 'tag', size: 'scalar', notes: [] },
    ])
  })

  it('reports an edit that throws as V1 reports it: the whole run fails, naming the field', async () => {
    const result = await dryRunDraft(
      provider([], { isBatchFinalized: () => true }),
      executor,
      facts,
      draftOf({
        finalized: {
          ...call('isBatchFinalized', [1]),
          edit: ['get', 'members'],
        },
        delay: {
          handler: { type: 'hardcoded', value: 3600 },
          edit: ['format', 'FormatSeconds'],
          covers: [],
          reason: 'test',
        },
      }),
      plain(),
    )

    expect(result.findings).toEqual([
      {
        path: 'draft',
        message: `dry run at block ${BLOCK} failed as a whole: The edit of field finalized failed: Assertion Error: String keys only work on objects; this is usually a {{ reference }} to a name no field or getter has, a reference cycle, or an edit that does not fit its value: fix the fields involved or skip their items`,
      },
    ])
    expect(result.record.fields.map((field) => field.size)).toEqual([
      'error',
      'error',
    ])
  })

  it('reports a reference to nothing as V1 reports it: the whole run fails, naming the field and the reference', async () => {
    const result = await dryRunDraft(
      provider([]),
      executor,
      facts,
      draftOf({
        lastFinalized: call('isBatchFinalized', [
          '{{ lastFinalizedBatchIndex }}',
        ]),
      }),
      {
        ...plain(),
        base: StructureContract.parse({
          ignoreMethods: ['lastFinalizedBatchIndex'],
        }),
      },
    )

    expect(result.findings).toEqual([
      {
        path: 'draft',
        message: `dry run at block ${BLOCK} failed as a whole: Impossible to resolve dependencies: lastFinalized waits for {{ lastFinalizedBatchIndex }}; this is usually a {{ reference }} to a name no field or getter has, a reference cycle, or an edit that does not fit its value: fix the fields involved or skip their items`,
      },
    ])
  })

  it('accepts an event field that finds no logs, even one covering a getter, and notes it for the reviewer', async () => {
    const result = await dryRunDraft(
      provider([]),
      executor,
      facts,
      draftOf({
        sequencers: SEQUENCERS,
        revertedBatches: REVERTED_BATCHES,
      }),
      plain(),
    )

    expect(result).toEqual({
      record: {
        blockNumber: BLOCK,
        fields: [
          {
            name: 'sequencers',
            size: 0,
            notes: [`empty at block ${BLOCK}: no logs yet for UpdateSequencer`],
          },
          {
            name: 'revertedBatches',
            size: 0,
            notes: [`empty at block ${BLOCK}: no logs yet for RevertBatch`],
          },
        ],
      },
      findings: [],
    })
  })

  it('notes the log count when logs exist but the fold keeps none', async () => {
    const result = await dryRunDraft(
      provider(SEQUENCER_LOGS),
      executor,
      facts,
      draftOf({
        sequencerA: {
          handler: {
            type: 'event',
            select: 'account',
            add: {
              event: 'UpdateSequencer',
              where: ['=', '#account', SEQUENCER_A],
            },
          },
          covers: ['isSequencer(address)'],
          reason: 'test',
        },
      }),
      plain(),
    )

    expect(result.findings).toEqual([])
    expect(result.record.fields).toEqual([
      {
        name: 'sequencerA',
        size: 0,
        notes: [
          `empty at block ${BLOCK}: the 3 logs for UpdateSequencer fold to nothing`,
        ],
      },
    ])
  })

  it('notes another declaration of the event that has the logs this fold lacks', async () => {
    const legacy = log(
      'RevertBatch(uint256,bytes32)',
      [7, `0x${'ab'.repeat(32)}`],
      20,
    )
    const current =
      'event RevertBatch(uint256 indexed startBatchIndex, uint256 indexed finishBatchIndex)'
    const result = await dryRunDraft(
      provider([legacy]),
      executor,
      facts,
      draftOf({
        revertedBatches: {
          ...REVERTED_BATCHES,
          handler: {
            type: 'event',
            select: ['startBatchIndex', 'finishBatchIndex'],
            add: { event: current },
          },
        },
      }),
      plain(),
    )

    expect(result.findings).toEqual([])
    expect(result.record.fields[0]?.notes).toEqual([
      `empty at block ${BLOCK}: no logs for ${current}, but another declaration of the same event has logs: event RevertBatch(uint256 indexed batchIndex, bytes32 indexed batchHash) (1 log(s)); the contract most likely recorded this state under that declaration (older code), so read it too`,
    ])
  })

  it('notes a field that would make discovery follow more addresses than a system has parts', async () => {
    const tokens = Array.from(
      { length: 21 },
      (_, i) => `0x${(i + 1).toString(16).padStart(40, '0')}`,
    )
    const logs = tokens.map((token, i) =>
      log('UpdateSequencer', [token, true], 30 + i),
    )
    const listing: DraftField = { ...SEQUENCERS, covers: ['UpdateSequencer'] }

    const unbounded = await dryRunDraft(
      provider(logs),
      executor,
      facts,
      draftOf({ sequencers: listing }),
      plain(),
    )
    const ignored = await dryRunDraft(
      provider(logs),
      executor,
      facts,
      draftOf({
        sequencers: {
          ...listing,
          handler: { ...listing.handler, ignoreRelative: true },
        },
      }),
      plain(),
    )

    expect(unbounded.findings).toEqual([])
    expect(unbounded.record.fields[0]?.notes).toEqual([
      'holds 21 addresses discovery will follow as parts of this system; if they are instances (deployed tokens, created games or pools, users), add "ignoreRelative": true to the handler',
    ])
    expect(ignored.findings).toEqual([])
    expect(ignored.record.fields[0]?.notes).toEqual([])
  })

  it('runs the existing template with the draft and reports only draft fields', async () => {
    const base = StructureContract.parse({
      fields: {
        batchIndex: { handler: { type: 'hardcoded', value: 7 } },
        broken: {
          handler: { type: 'call', method: 'isProver', args: [SEQUENCER_A] },
        },
      },
    })

    const result = await dryRunDraft(
      provider([], {
        isBatchFinalized: ([index]) => (index === 7 ? true : undefined),
      }),
      executor,
      facts,
      draftOf({
        batchFinalized: call('isBatchFinalized', ['{{ batchIndex }}']),
      }),
      { ...plain(), base },
    )

    expect(result).toEqual({
      record: {
        blockNumber: BLOCK,
        fields: [{ name: 'batchFinalized', size: 'scalar', notes: [] }],
      },
      findings: [],
    })
  })

  it('reports a run that fails as a whole once, at the draft', async () => {
    const base = StructureContract.parse({
      fields: { a: { copy: 'b' }, b: { copy: 'a' } },
    })

    const result = await dryRunDraft(
      provider(SEQUENCER_LOGS),
      executor,
      facts,
      draftOf({ sequencers: SEQUENCERS }),
      { ...plain(), base },
    )

    expect(result.findings.map((finding) => finding.path)).toEqual(['draft'])
    expect(result.findings[0]?.message ?? '').toInclude(
      `dry run at block ${BLOCK} failed as a whole: Impossible to resolve dependencies`,
    )
  })
})

describe(runTemplateFields.name, () => {
  const executor = new HandlerExecutor()
  const config = () => makeEntryStructureConfig({}, facts.address)

  it('returns the values the analyzer computes, getters included', async () => {
    const template = StructureContract.parse({
      fields: {
        sequencers: { handler: SEQUENCERS.handler },
        sequencerB: { handler: call('isSequencer', [SEQUENCER_B]).handler },
      },
    })

    const { values, errors } = await runTemplateFields(
      provider(SEQUENCER_LOGS, {
        isSequencer: ([account]) =>
          account === SEQUENCER_B ? true : undefined,
        lastFinalizedBatchIndex: () => 42,
      }),
      executor,
      facts.abi,
      config(),
      template,
    )

    expect(values.sequencers).toEqual([`eth:${SEQUENCER_B}`])
    expect(values.sequencerB).toEqual(true)
    expect(values.lastFinalizedBatchIndex).toEqual(42)
    expect(errors.sequencers).toEqual(undefined)
    expect(errors.sequencerB).toEqual(undefined)
  })

  it('applies the address override on top of the template, as the analyzer does', async () => {
    const address = facts.address.toString()
    const overriding = makeEntryStructureConfig(
      {
        overrides: {
          [address]: StructureContract.parse({
            fields: {
              fixed: { handler: { type: 'hardcoded', value: 'override' } },
            },
          }),
        },
      },
      facts.address,
    )
    const template = StructureContract.parse({
      fields: { fixed: { handler: { type: 'hardcoded', value: 'template' } } },
    })

    const { values } = await runTemplateFields(
      provider([]),
      executor,
      facts.abi,
      overriding,
      template,
    )

    expect(values.fixed).toEqual('override')
  })

  it('gives a failure of the whole run to every template field', async () => {
    const template = StructureContract.parse({
      fields: {
        a: { copy: 'b' },
        b: { copy: 'a' },
        sequencers: { handler: SEQUENCERS.handler },
      },
    })

    const result = await runTemplateFields(
      provider(SEQUENCER_LOGS),
      executor,
      facts.abi,
      config(),
      template,
    )

    expect(result.values).toEqual({})
    expect(Object.keys(result.errors)).toEqual(['a', 'b', 'sequencers'])
    expect(result.errors.sequencers ?? '').toInclude(
      'Impossible to resolve dependencies',
    )
  })
})
