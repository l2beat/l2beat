import { expect } from 'earl'
import { AbiIndex, fullSignature } from '../abi/AbiIndex'
import { loadFixture } from '../test/fixtures'
import { resolveEvent } from './resolveEvent'

describe(resolveEvent.name, () => {
  const abi = loadFixture('ScrollChain').abi
  const index = AbiIndex.from(abi)
  const resolve = (reference: string) => {
    const resolution = resolveEvent(reference, abi, index)
    return resolution.fragment
      ? {
          fragment: fullSignature(resolution.fragment),
          inAbi: resolution.inAbi,
          overloads: resolution.overloads.length,
        }
      : resolution.error
  }

  it('resolves a bare name to its first declaration, as getEventFragment does', () => {
    expect(resolve('UpdateSequencer')).toEqual({
      fragment: 'event UpdateSequencer(address indexed account, bool status)',
      inAbi: true,
      overloads: 1,
    })
    expect(resolve('RevertBatch')).toEqual({
      fragment:
        'event RevertBatch(uint256 indexed batchIndex, bytes32 indexed batchHash)',
      inAbi: true,
      overloads: 2,
    })
  })

  it('rejects signatures, suggesting the bare name only when it reads the same declaration', () => {
    expect(resolve('UpdateSequencer(address,bool)')).toEqual(
      '"UpdateSequencer(address,bool)" is a signature, which V1 does not resolve; name the event "UpdateSequencer" or give the full fragment "event UpdateSequencer(address indexed account, bool status)"',
    )
    expect(resolve('RevertBatch(uint256,uint256)')).toEqual(
      '"RevertBatch(uint256,uint256)" is a signature, which V1 does not resolve; give the full fragment "event RevertBatch(uint256 indexed startBatchIndex, uint256 indexed finishBatchIndex)"',
    )
  })

  it('accepts full fragments, marking foreign ones and rejecting altered copies', () => {
    const second =
      'event RevertBatch(uint256 indexed startBatchIndex, uint256 indexed finishBatchIndex)'
    expect(resolve(second)).toEqual({
      fragment: second,
      inAbi: true,
      overloads: 0,
    })
    expect(resolve('event Foo(uint256 a)')).toEqual({
      fragment: 'event Foo(uint256 a)',
      inAbi: false,
      overloads: 0,
    })
    expect(
      resolve('event UpdateSequencer(address account, bool status)'),
    ).toEqual(
      '"event UpdateSequencer(address account, bool status)" declares the event differently from the ABI, and V1 decodes logs with the fragment as written; copy "event UpdateSequencer(address indexed account, bool status)"',
    )
  })

  it('names the closest events for a miss', () => {
    expect(resolve('UpdateSequencr')).toEqual(
      'there is no event "UpdateSequencr" in the ABI; closest: UpdateSequencer, UpdateProver, Unpaused',
    )
    expect(String(resolve('UpdateSequencer (address)'))).toMatchRegex(
      /contains a space, so V1 parses it as a full event fragment, and it does not parse/,
    )
  })
})
