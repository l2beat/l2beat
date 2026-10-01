import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import { StructureContract } from '../../config/StructureConfig'
import { HandlerExecutor } from '../../handlers/HandlerExecutor'
import type { IProvider } from '../../provider/IProvider'
import { loadFixture } from '../test/fixtures'
import type { Draft, DraftField } from './Draft'
import { dryRunDraft, runTemplateFields } from './dryRun'

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

describe(dryRunDraft.name, () => {
  const executor = new HandlerExecutor()

  it('accepts an event fold over the logs the contract emitted', async () => {
    const result = await dryRunDraft(
      provider(SEQUENCER_LOGS),
      executor,
      facts,
      draftOf({ sequencers: SEQUENCERS }),
    )

    expect(result).toEqual({
      record: { blockNumber: BLOCK, fields: [{ name: 'sequencers', size: 1 }] },
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
    )

    expect(result.findings).toEqual([])
    expect(result.record.fields).toEqual([
      { name: 'sequencerB', size: 'scalar' },
    ])
  })

  it('reports a failing handler at its field, with the block', async () => {
    const result = await dryRunDraft(
      provider([]),
      executor,
      facts,
      draftOf({ finalized: call('isBatchFinalized', [1]) }),
    )

    expect(result.findings).toEqual([
      {
        severity: 'error',
        path: 'fields.finalized',
        message: `dry run at block ${BLOCK} failed: Execution reverted; fix the handler or skip the item`,
      },
    ])
    expect(result.record.fields).toEqual([
      { name: 'finalized', size: 'error', error: 'Execution reverted' },
    ])
  })

  it('pins an edit that throws on its field and keeps the other fields', async () => {
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
    )

    expect(result.findings).toEqual([
      {
        severity: 'error',
        path: 'fields.finalized',
        message: `dry run at block ${BLOCK} failed: the edit ["get","members"] throws: Assertion Error: String keys only work on objects; fix the handler or skip the item`,
      },
    ])
    expect(result.record.fields.map((field) => field.size)).toEqual([
      'error',
      'scalar',
    ])
  })

  it('pins a reference that resolves to nothing on its field', async () => {
    const result = await dryRunDraft(
      provider([]),
      executor,
      facts,
      draftOf({
        lastFinalized: call('isBatchFinalized', [
          '{{ lastFinalizedBatchIndex }}',
        ]),
      }),
      { ignoreMethods: ['lastFinalizedBatchIndex'] },
    )

    expect(result.findings).toEqual([
      {
        severity: 'error',
        path: 'fields.lastFinalized',
        message: `dry run at block ${BLOCK} failed: references {{ lastFinalizedBatchIndex }}, but no field or getter has that name; fix the handler or skip the item`,
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
    )

    expect(result).toEqual({
      record: {
        blockNumber: BLOCK,
        fields: [
          {
            name: 'sequencers',
            size: 0,
            note: `empty at block ${BLOCK}: no logs yet for UpdateSequencer`,
          },
          {
            name: 'revertedBatches',
            size: 0,
            note: `empty at block ${BLOCK}: no logs yet for RevertBatch`,
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
    )

    expect(result.findings).toEqual([])
    expect(result.record.fields).toEqual([
      {
        name: 'sequencerA',
        size: 0,
        note: `empty at block ${BLOCK}: the 3 logs for UpdateSequencer fold to nothing`,
      },
    ])
  })

  it('advises reading another declaration of the event when it has the logs this fold lacks', async () => {
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
    )

    expect(result.findings).toEqual([
      {
        severity: 'advisory',
        path: 'fields.revertedBatches',
        message: `no logs for ${current} up to block ${BLOCK}, but another declaration of the same event has logs: \`event RevertBatch(uint256 indexed batchIndex, bytes32 indexed batchHash)\` (1 log(s)); the contract most likely recorded this state under that declaration (older code), so read it too: in this field when its argument names fit the same select, otherwise in a second field named after the same subject`,
      },
    ])
  })

  it('advises ignoreRelative when a field would make discovery follow more addresses than a system has parts', async () => {
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
    )

    expect(unbounded.findings).toEqual([
      {
        severity: 'advisory',
        path: 'fields.sequencers',
        message:
          'the value holds 21 addresses and discovery would analyse every one of them as part of this system, more than the 20 that any one system usually has; when they are instances rather than parts of the system (deployed tokens, created games or pools, users), add `"ignoreRelative": true` to the handler',
      },
    ])
    expect(ignored.findings).toEqual([])
  })

  it('runs locked fields with the draft and reports only draft fields', async () => {
    const locked = StructureContract.parse({
      fields: {
        batchIndex: { handler: { type: 'hardcoded', value: 7 } },
        broken: {
          handler: { type: 'call', method: 'isProver', args: [SEQUENCER_A] },
        },
      },
    }).fields

    const result = await dryRunDraft(
      provider([], {
        isBatchFinalized: ([index]) => (index === 7 ? true : undefined),
      }),
      executor,
      facts,
      draftOf({
        batchFinalized: call('isBatchFinalized', ['{{ batchIndex }}']),
      }),
      { locked },
    )

    expect(result).toEqual({
      record: {
        blockNumber: BLOCK,
        fields: [{ name: 'batchFinalized', size: 'scalar' }],
      },
      findings: [],
    })
  })

  it('reports a run that fails as a whole once, at the draft', async () => {
    const locked = StructureContract.parse({
      fields: { a: { copy: 'b' }, b: { copy: 'a' } },
    }).fields

    const result = await dryRunDraft(
      provider(SEQUENCER_LOGS),
      executor,
      facts,
      draftOf({ sequencers: SEQUENCERS }),
      { locked },
    )

    expect(result.findings).toEqual([
      {
        severity: 'error',
        path: 'draft',
        message: `dry run at block ${BLOCK} failed as a whole: Impossible to resolve dependencies; fix the fields involved or skip their items`,
      },
    ])
  })
})

describe(runTemplateFields.name, () => {
  const executor = new HandlerExecutor()

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
      facts,
      template,
    )

    expect(values.sequencers).toEqual([`eth:${SEQUENCER_B}`])
    expect(values.sequencerB).toEqual(true)
    expect(values.lastFinalizedBatchIndex).toEqual(42)
    expect(errors.sequencers).toEqual(undefined)
    expect(errors.sequencerB).toEqual(undefined)
  })

  it('pins a reference cycle on its fields and runs the rest', async () => {
    const template = StructureContract.parse({
      fields: {
        x: { handler: call('isBatchFinalized', ['{{ y }}']).handler },
        y: { handler: call('isBatchFinalized', ['{{ x }}']).handler },
        sequencers: { handler: SEQUENCERS.handler },
      },
    })

    const { values, errors } = await runTemplateFields(
      provider(SEQUENCER_LOGS),
      executor,
      facts,
      template,
    )

    expect(errors.x).toEqual(
      'references {{ y }}, which never resolve (a reference cycle, or a field that cannot run)',
    )
    expect(errors.y).toEqual(
      'references {{ x }}, which never resolve (a reference cycle, or a field that cannot run)',
    )
    expect(values.sequencers).toEqual([`eth:${SEQUENCER_B}`])
  })

  it('gives a failure it cannot pin to every template field', async () => {
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
      facts,
      template,
    )

    expect(result).toEqual({
      values: {},
      errors: {
        a: 'Impossible to resolve dependencies',
        b: 'Impossible to resolve dependencies',
        sequencers: 'Impossible to resolve dependencies',
      },
    })
  })
})
