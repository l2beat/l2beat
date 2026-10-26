import { expect } from 'earl'
import { getVisibleDisplayName } from './getVisibleDisplayName'

describe(getVisibleDisplayName.name, () => {
  it('shows a name that differs from the id', () => {
    expect(getVisibleDisplayName(entry('lyra', 'Derive'))).toEqual('Derive')
  })

  it('shows nothing for a project without a config name', () => {
    expect(getVisibleDisplayName(entry('shared-sp1', undefined))).toEqual(
      undefined,
    )
  })

  it('hides a name that only differs from the id in case or punctuation', () => {
    expect(getVisibleDisplayName(entry('aevo', 'Aevo'))).toEqual(undefined)
    expect(getVisibleDisplayName(entry('rocketpool', 'Rocket Pool'))).toEqual(
      undefined,
    )
    expect(getVisibleDisplayName(entry('etherfi', 'ether.fi'))).toEqual(
      undefined,
    )
  })
})

function entry(name: string, displayName: string | undefined) {
  return { name, displayName, addresses: [], contractNames: [] }
}
