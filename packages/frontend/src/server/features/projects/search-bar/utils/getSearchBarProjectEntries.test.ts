import { expect } from 'earl'

import { getCommonSearchBarProjectTags } from './getSearchBarProjectEntries'

describe(getCommonSearchBarProjectTags.name, () => {
  it('adds project-specific aliases used by search', () => {
    expect(
      getCommonSearchBarProjectTags({
        slug: 'derive',
        name: 'Derive',
        aliases: ['Lyra'],
      }),
    ).toEqual(['derive', 'Derive', 'Lyra'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 'k2',
        name: 'K2',
        aliases: ['Karak', 'OpenGDP'],
      }),
    ).toEqual(['k2', 'K2', 'Karak', 'OpenGDP'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 'polygon-pos',
        name: 'Polygon PoS',
        aliases: ['Matic'],
      }),
    ).toEqual(['polygon-pos', 'Polygon PoS', 'Matic'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 'rhinofi',
        name: 'rhino.fi',
        aliases: ['DeversiFi'],
      }),
    ).toEqual(['rhinofi', 'rhino.fi', 'DeversiFi'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 't3rn',
        name: 't3rn',
        aliases: ['tern'],
      }),
    ).toEqual(['t3rn', 'tern'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 'r0ar',
        name: 'R0ar',
        aliases: ['Roar'],
      }),
    ).toEqual(['r0ar', 'R0ar', 'Roar'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 'towns',
        name: 'Towns',
        aliases: ['River'],
      }),
    ).toEqual(['towns', 'Towns', 'River'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 'op-mainnet',
        name: 'OP Mainnet',
        aliases: ['Optimism'],
      }),
    ).toEqual(['op-mainnet', 'OP Mainnet', 'Optimism'])

    expect(
      getCommonSearchBarProjectTags({
        slug: 'zksync-era',
        name: 'ZKsync Era',
        aliases: ['ZKsync 2.0'],
      }),
    ).toEqual(['zksync-era', 'ZKsync Era', 'ZKsync 2.0'])
  })
})
