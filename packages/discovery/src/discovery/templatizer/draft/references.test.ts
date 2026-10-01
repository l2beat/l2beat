import { expect } from 'earl'
import type { DraftHandler } from './Draft'
import {
  findCycles,
  isMalformedReference,
  referenceSites,
  referenceSlots,
} from './references'

/**
 * Pins the positions a reference may occupy and V1's grammar for it
 * (`getReferencedPath`): only these positions are resolved by V1, so only
 * these are checked.
 */
describe(referenceSites.name, () => {
  it('lists the reference positions of call, array and storage handlers with their paths', () => {
    const call: DraftHandler = {
      type: 'call',
      method: 'function f(address,uint256) view returns (uint256)',
      args: ['{{ owner }}', 5],
      address: '{{ registry }}',
    }
    expect(
      referenceSlots(call).map((slot) => [slot.path, slot.position]),
    ).toEqual([
      ['args[0]', 'arg'],
      ['args[1]', 'arg'],
      ['address', 'address'],
    ])
    const storage: DraftHandler = {
      type: 'storage',
      slot: [2, '{{ owner }}'],
      offset: '{{ base }}',
    }
    expect(
      referenceSites(storage).map((site) => [site.path, site.base]),
    ).toEqual([
      ['slot[1]', 'owner'],
      ['offset', 'base'],
    ])
    const array: DraftHandler = { type: 'array', length: '{{ count }}' }
    expect(referenceSites(array).map((site) => site.position)).toEqual([
      'length',
    ])
    expect(referenceSlots({ type: 'hardcoded', value: '{{ owner }}' })).toEqual(
      [],
    )
  })

  it('splits a reference into the field V1 waits for and the path it walks', () => {
    const [site] = referenceSites({
      type: 'call',
      args: ['{{constructorArgs._owner}}'],
    })
    expect([site?.base, site?.rest]).toEqual(['constructorArgs', ['_owner']])
    expect(isMalformedReference('{{ owner-x }}')).toEqual(true)
    expect(isMalformedReference('prefix {{ owner }}')).toEqual(true)
    expect(isMalformedReference('{{ owner }}')).toEqual(false)
    expect(isMalformedReference(5)).toEqual(false)
  })
})

describe(findCycles.name, () => {
  it('finds every cycle among draft fields and ignores edges leaving the draft', () => {
    const call = (address: string): DraftHandler => ({
      type: 'call',
      method: 'function owner() view returns (address)',
      args: [],
      address,
    })
    expect(
      findCycles({
        a: call('{{ b }}'),
        b: call('{{ c }}'),
        c: call('{{ a }}'),
        d: call('{{ d }}'),
        e: call('{{ owner }}'),
      }),
    ).toEqual([
      ['a', 'b', 'c', 'a'],
      ['d', 'd'],
    ])
    expect(findCycles({ a: call('{{ b }}'), b: call('{{ owner }}') })).toEqual(
      [],
    )
  })
})
