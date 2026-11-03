import { expect } from 'earl'
import { resolveTheme } from './theme'

describe(resolveTheme.name, () => {
  it('follows the system only when set to system', () => {
    expect(resolveTheme('system', true)).toEqual('light')
    expect(resolveTheme('system', false)).toEqual('dark')
    expect(resolveTheme('light', false)).toEqual('light')
    expect(resolveTheme('dark', true)).toEqual('dark')
  })
})
