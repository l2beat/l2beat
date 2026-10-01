import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { FlatSource } from '../facts'
import { loadFixture } from '../test/fixtures'
import {
  emittedOnlyByPrivilegedCode,
  findCallables,
  findEmitSites,
  privilegedEmitters,
  stripCommentsAndStrings,
} from './privilegedEvents'

/**
 * The expectations on real sources were read off the flattened fixtures:
 * each names the function the `emit` sits in and the modifier it carries,
 * so a regression in brace matching or header parsing shows up as a wrong
 * emitter, not only as a wrong verdict.
 */
describe(privilegedEmitters.name, () => {
  const scroll = loadFixture('ScrollChain').sources
  const nitro = loadFixture('NitroEnclaveVerifier').sources
  const inbox = loadFixture('SequencerInbox').sources
  const factory = loadFixture('DisputeGameFactory').sources

  it('flags ScrollChain RevertBatch: onlyOwner revertBatch plus OnlyTopLevelCall commitAndFinalizeBatch', () => {
    expect(privilegedEmitters(scroll, 'RevertBatch')).toEqual({
      privilege: 'authority',
      emitters: [
        'revertBatch (onlyOwner)',
        'commitAndFinalizeBatch (OnlyTopLevelCall)',
      ],
    })
    expect(privilegedEmitters(scroll, 'UpdateSequencer')).toEqual({
      privilege: 'authority',
      emitters: ['addSequencer (onlyOwner)', 'removeSequencer (onlyOwner)'],
    })
  })

  it('flags the NitroEnclaveVerifier route events, the event-only state the benchmark missed', () => {
    expect(privilegedEmitters(nitro, 'ZkRouteAdded')).toEqual({
      privilege: 'authority',
      emitters: ['addVerifyRoute (onlyOwner)'],
    })
    expect(privilegedEmitters(nitro, 'ZkRouteWasFrozen')).toEqual({
      privilege: 'authority',
      emitters: ['freezeVerifyRoute (onlyOwner)'],
    })
    expect(privilegedEmitters(inbox, 'SequencerSet')?.emitters).toEqual([
      'setIsSequencer (onlyRollupOwnerOrBatchPosterManager)',
    ])
  })

  it('does not flag an event with one unguarded emitter', () => {
    // importGenesisBatch has no modifier; _commitBatchesFromV7 is internal
    expect(privilegedEmitters(scroll, 'CommitBatch')).toEqual(undefined)
    // the batch posting functions check the poster inline, not by modifier
    expect(privilegedEmitters(inbox, 'SequencerBatchDelivered')).toEqual(
      undefined,
    )
    // verify checks msg.sender inline
    expect(privilegedEmitters(nitro, 'AttestationSubmitted')).toEqual(undefined)
  })

  it('does not flag OpenZeppelin events emitted in internal functions and modifiers', () => {
    expect(privilegedEmitters(scroll, 'OwnershipTransferred')).toEqual(
      undefined,
    )
    expect(privilegedEmitters(scroll, 'Initialized')).toEqual(undefined)
    expect(privilegedEmitters(factory, 'Initialized')).toEqual(undefined)
    expect(privilegedEmitters(nitro, 'ZKConfigurationUpdated')).toEqual(
      undefined,
    )
  })

  it('concludes nothing when the source never emits the event', () => {
    // Solady's Ownable emits OwnershipTransferred from assembly (log3)
    expect(findEmitSites(nitro, 'OwnershipTransferred')).toEqual([])
    expect(privilegedEmitters(nitro, 'OwnershipTransferred')).toEqual(undefined)
    expect(emittedOnlyByPrivilegedCode(scroll, 'NoSuchEvent')).toEqual(false)
  })

  it('counts constructor emits as privileged and grades non-authority guards as guarded', () => {
    const source = flat(`
      contract Gateway {
        event Configured(uint256 value);
        event Withdrawn(address to);
        constructor(uint256 value) { emit Configured(value); }
        function configure(uint256 value) external onlyOwner { emit Configured(value); }
        function finalize(address to) external onlyCallByCounterpart { emit Withdrawn(to); }
      }
    `)
    expect(privilegedEmitters(source, 'Configured')).toEqual({
      privilege: 'authority',
      emitters: ['constructor', 'configure (onlyOwner)'],
    })
    expect(privilegedEmitters(source, 'Withdrawn')).toEqual({
      privilege: 'guarded',
      emitters: ['finalize (onlyCallByCounterpart)'],
    })
    expect(emittedOnlyByPrivilegedCode(source, 'Withdrawn')).toEqual(true)
  })
})

describe(findCallables.name, () => {
  it('reads modifiers after the parameter list only, and skips bodiless declarations', () => {
    const code = stripCommentsAndStrings(`
      interface I { function f(uint256 onlyA) external; }
      contract C {
        function g(bool onlyOne) internal returns (bool onlyTwo) { return onlyOne; }
        function h(function(uint256) external onlyCb) external onlyRole(ADMIN) {}
        modifier guard { _; }
        fallback() external {}
      }
    `)
    expect(
      findCallables(code).map((callable) => [
        callable.kind,
        callable.name,
        callable.attributes.trim().replace(/\s+/g, ' '),
      ]),
    ).toEqual([
      ['function', 'g', 'internal'],
      ['function', 'h', 'external onlyRole(ADMIN)'],
      ['modifier', 'guard', ''],
      ['fallback', 'fallback', 'external'],
    ])
  })
})

describe(stripCommentsAndStrings.name, () => {
  it('blanks comments and string literals but keeps every offset', () => {
    const source = 'a /* { emit X( */ b // emit Y(\n"}\\"{" \'{\' emit Z(1);'
    const stripped = stripCommentsAndStrings(source)
    expect(stripped.length).toEqual(source.length)
    expect(stripped.replace(/ +/g, ' ')).toEqual('a b \n emit Z(1);')
  })

  it('ignores emits and braces in comments when attributing a real emit', () => {
    const source = flat(`
      contract C {
        // function fake() external onlyOwner { emit E(1); }
        function real() external { string memory s = "}"; emit E(2); }
      }
    `)
    expect(
      findEmitSites(source, 'E').map((site) => site.callable?.name),
    ).toEqual(['real'])
  })
})

function flat(flattened: string): FlatSource[] {
  return [
    {
      address: ChainSpecificAddress(
        'eth:0x0000000000000000000000000000000000000001',
      ),
      name: 'Test',
      flattened,
    },
  ]
}
