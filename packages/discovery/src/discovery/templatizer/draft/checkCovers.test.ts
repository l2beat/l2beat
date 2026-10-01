import { expect } from 'earl'
import { checkCovers, naturalCovers } from './checkCovers'
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

const ACCESS_CONTROL_ABI = [
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  'function getRoleMember(bytes32 role, uint256 index) view returns (address)',
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
]

describe(checkCovers.name, () => {
  const scroll = contextFor('ScrollChain')
  const inbox = contextFor('SequencerInbox')
  const factory = contextFor('DisputeGameFactory')

  function check(
    handler: DraftHandler,
    covers: string[],
    ctx: ValidationContext,
    name = 'x',
  ): Finding[] {
    return runRule(
      checkCovers,
      draftOf({ [name]: field(handler, covers) }),
      ctx,
    )
  }

  it('accepts event fields that claim the getters they enumerate and cover the events they read', () => {
    expect(runRule(checkCovers, scrollChainDraft(), scroll)).toEqual([])
  })

  it('rejects an event the field does not read', () => {
    const draft = scrollChainDraft()
    draft.fields.sequencers!.covers.push('UpdateProver')
    expect(runRule(checkCovers, draft, scroll)).toEqual([
      {
        severity: 'error',
        path: 'fields.sequencers.covers[2]',
        message:
          "sequencers does not read UpdateProver; read it in one of the handler's actions, or skip UpdateProver as `covered` if its state is what sequencers holds",
      },
    ])
    expect(
      check(
        { type: 'hardcoded', value: [] },
        ['isSequencer(address)', 'UpdateSequencer'],
        scroll,
      ),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.x.covers[1]',
        message:
          'a hardcoded field reads no events; cover UpdateSequencer with an event field, or skip UpdateSequencer as `covered` if its state is what x holds',
      },
    ])
  })

  it('lets call and array fields cover only the function they call', () => {
    const poster = '0x798576400F7D662961BA15C6b3F3d813447a26a6'
    expect(
      check(
        { type: 'call', method: 'isBatchPoster', args: [poster] },
        ['isBatchPoster(address)'],
        inbox,
      ),
    ).toEqual([])
    expect(
      check(
        { type: 'call', method: 'isBatchPoster', args: [poster] },
        ['isSequencer(address)'],
        inbox,
      ),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.x.covers[0]',
        message:
          'a call field answers only what it calls (isBatchPoster(address)); move isSequencer(address) to the field that reads it or to skips',
      },
    ])
    expect(
      check(
        {
          type: 'call',
          method: 'function isBatchPoster(address) view returns (bool)',
          args: [poster],
          address: '{{ bridge }}',
        },
        ['isBatchPoster(address)'],
        inbox,
      )[0]?.message,
    ).toEqual(
      "this field calls another contract (`address` is set), so it answers nothing on this contract's worklist; move isBatchPoster(address) to the field that reads it or to skips",
    )
    expect(
      check(
        { type: 'array', length: 5 },
        ['initBonds(uint32)'],
        factory,
        'gameImpls',
      )[0]?.message,
    ).toEqual(
      'an array field answers only what it calls (gameImpls(uint32)); move initBonds(uint32) to the field that reads it or to skips',
    )
  })

  it('leaves an unresolved method to R5', () => {
    expect(
      check(
        { type: 'call', method: 'nope', args: [] },
        ['isSequencer(address)'],
        scroll,
      ),
    ).toEqual([])
  })
})

describe(naturalCovers.name, () => {
  const inbox = contextFor('SequencerInbox').facts
  const scroll = contextFor('ScrollChain').facts

  it('derives covers from what a handler reads, never from claims', () => {
    expect(
      naturalCovers(
        'batchPosters',
        { type: 'call', method: 'isBatchPoster', args: ['{{ owner }}'] },
        inbox,
      ),
    ).toEqual({ functions: ['isBatchPoster(address)'], events: [] })
    expect(
      naturalCovers(
        'guardian',
        {
          type: 'call',
          method: 'function guardian() view returns (address)',
          args: [],
          address: '{{ rollup }}',
        },
        inbox,
      ),
    ).toEqual({ functions: [], events: [] })
    expect(naturalCovers('inboxAccs', { type: 'array' }, inbox)).toEqual({
      functions: ['inboxAccs(uint256)'],
      events: [],
    })
    expect(
      naturalCovers(
        'sequencers',
        scrollChainDraft().fields.sequencers!.handler,
        scroll,
      ),
    ).toEqual({
      functions: [],
      events: ['UpdateSequencer'],
    })
    expect(naturalCovers('x', { type: 'hardcoded', value: 1 }, scroll)).toEqual(
      {
        functions: [],
        events: [],
      },
    )
  })

  it('gives accessControl the role getters and events the ABI declares', () => {
    expect(
      naturalCovers(
        'accessControl',
        { type: 'accessControl' },
        { abi: ACCESS_CONTROL_ABI },
      ),
    ).toEqual({
      functions: [
        'hasRole(bytes32,address)',
        'getRoleAdmin(bytes32)',
        'getRoleMember(bytes32,uint256)',
      ],
      events: ['RoleGranted', 'RoleRevoked'],
    })
  })
})
