import { expect } from 'earl'
import { AbiIndex } from '../abi/AbiIndex'
import { argumentPathProblem, checkEventHandler } from './checkEventHandler'
import { checkHandlers } from './checkHandlers'
import type { DraftHandler } from './Draft'
import type { Finding } from './Finding'
import type { ValidationContext } from './ruleContext'
import {
  contextFor,
  draftOf,
  field,
  runRule,
  scrollChainDraft,
} from './test/drafts'

/** Goes through `checkHandlers`, which dispatches event fields to `checkEventHandler`. */
describe(checkEventHandler.name, () => {
  const scroll = contextFor('ScrollChain')
  const inbox = contextFor('SequencerInbox')

  function check(
    handler: DraftHandler,
    ctx: ValidationContext = scroll,
  ): Finding[] {
    return runRule(checkHandlers, draftOf({ x: field(handler) }), ctx)
  }

  it('accepts the ScrollChain event fields, warning that V1 reads only the first RevertBatch', () => {
    expect(runRule(checkHandlers, scrollChainDraft(), scroll)).toEqual([
      {
        severity: 'warning',
        path: 'fields.revertedBatches.handler.add.event',
        message:
          '"RevertBatch" is overloaded and V1 reads only its first declaration, "event RevertBatch(uint256 indexed batchIndex, bytes32 indexed batchHash)"; if the contract emits "event RevertBatch(uint256 indexed startBatchIndex, uint256 indexed finishBatchIndex)", read it in an action of its own with that full fragment',
      },
    ])
  })

  it('resolves every event as getEventFragment does', () => {
    expect(
      check({
        type: 'event',
        select: 'account',
        add: { event: ['UpdateSequencer', 'UpdateSequencr'] },
      }),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.x.handler.add.event[1]',
        message:
          'there is no event "UpdateSequencr" in the ABI; closest: UpdateSequencer, UpdateProver, Unpaused',
      },
    ])
    expect(
      check({
        type: 'event',
        add: { event: 'event Foreign(address indexed who)' },
      }),
    ).toEqual([
      {
        severity: 'warning',
        path: 'fields.x.handler.add.event',
        message:
          'Foreign(address) is not declared in this ABI; V1 accepts the fragment but still fetches logs from this contract only, so it matches only if this contract emits that event',
      },
    ])
  })

  it('requires compatible parameters for events mixed in one action', () => {
    expect(
      check({
        type: 'event',
        select: 'account',
        add: { event: ['UpdateSequencer', 'UpdateProver'] },
      }),
    ).toEqual([])
    expect(
      check({
        type: 'event',
        add: { event: ['UpdateSequencer', 'CommitBatch'] },
      }),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.x.handler.add.event',
        message:
          'events in one action must share their parameters (V1 compares names, types and indexed); CommitBatch has no address indexed account, bool status as UpdateSequencer declares; read them in separate actions',
      },
    ])
  })

  it('checks select, groupBy and dedupBy against every event the field reads', () => {
    expect(
      check({
        type: 'event',
        select: ['account', 'batchIndex'],
        groupBy: 'status',
        add: [{ event: 'UpdateSequencer' }, { event: 'CommitBatch' }],
      }).map((finding) => `${finding.path}: ${finding.message}`),
    ).toEqual([
      'fields.x.handler.select[0]: event CommitBatch has no argument "account"; its arguments are batchIndex, batchHash (closest: batchHash)',
      'fields.x.handler.select[1]: event UpdateSequencer has no argument "batchIndex"; its arguments are account, status (closest: account)',
      'fields.x.handler.groupBy: event CommitBatch has no argument "status"; its arguments are batchIndex, batchHash (closest: batchHash)',
    ])
  })

  it('reaches into tuples by index only, as V1 decodes them', () => {
    const event = AbiIndex.from(inbox.facts.abi).lookupEvent('BufferConfigSet')
      .fragment!
    expect(argumentPathProblem(event, 'bufferConfig.0')).toEqual(undefined)
    expect(argumentPathProblem(event, 'bufferConfig.threshold')).toEqual(
      'BufferConfigSet.bufferConfig is tuple(uint64 threshold, uint64 max, uint64 replenishRateInBasis) bufferConfig: decoded tuples are positional arrays, so address "threshold" by its index 0',
    )
    expect(argumentPathProblem(event, 'bufferConfig.3')).toEqual(
      'BufferConfigSet.bufferConfig is tuple(uint64 threshold, uint64 max, uint64 replenishRateInBasis) bufferConfig: it has 3 components, so index 3 does not exist',
    )
  })

  it('checks each where against the events of its own action', () => {
    const whereOf = (where: unknown, event = 'UpdateSequencer') =>
      check({ type: 'event', select: 'account', add: { event, where } })
    expect(whereOf(['=', '#stat', true])).toEqual([
      {
        severity: 'error',
        path: 'fields.x.handler.add.where',
        message:
          'event UpdateSequencer has no argument "stat"; its arguments are account, status (closest: status)',
      },
    ])
    expect(whereOf(['=', '#status', 'true'])[0]?.message).toEqual(
      'UpdateSequencer.status is bool: expected a boolean, got "true"',
    )
    expect(
      whereOf([
        '=',
        '#account',
        '0x798576400f7d662961ba15c6b3f3d813447a26a6',
      ])[0]?.message,
    ).toEqual(
      'UpdateSequencer.account is address: V1 compares with the log value exactly as it renders it (addresses chain-prefixed and checksummed), so write "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"',
    )
    expect(
      whereOf([
        '=',
        '#account',
        'eth:0x798576400F7D662961BA15C6b3F3d813447a26a6',
      ]),
    ).toEqual([])
  })

  it('rejects events V1 cannot read and a flatten without one selected argument', () => {
    const withPing = {
      ...scroll,
      facts: { ...scroll.facts, abi: [...scroll.facts.abi, 'event Ping()'] },
    }
    expect(check({ type: 'event', add: { event: 'Ping' } }, withPing)).toEqual([
      {
        severity: 'error',
        path: 'fields.x.handler.add.event',
        message:
          "Ping() has no parameters, and V1's event handler rejects an event without any as incompatible; read this state another way or skip the event",
      },
    ])
    expect(
      check({
        type: 'event',
        select: ['account', 'status'],
        flatten: true,
        add: { event: 'UpdateSequencer' },
      }),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.x.handler.flatten',
        message:
          '`flatten` expands the array of the one selected argument into one row per element, so `select` must name exactly one argument',
      },
    ])
  })
})
