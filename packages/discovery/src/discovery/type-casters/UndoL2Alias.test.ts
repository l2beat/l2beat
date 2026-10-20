import { expect } from 'earl'
import { UndoL2Alias } from './UndoL2Alias'

describe('UndoL2Alias', () => {
  it('turns the alias of the Superchain ProxyAdmin owner into its Ethereum address', () => {
    expect(
      UndoL2Alias.cast({}, 'oeth:0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b'),
    ).toEqual('eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A')
  })

  it('wraps around below the offset', () => {
    expect(
      UndoL2Alias.cast({}, 'base:0x0000000000000000000000000000000000000000'),
    ).toEqual('eth:0xEeeeffFfFffFFFfFFFFFFFffffffFffFFfFfEEeF')
  })

  it('reads an alias on a chain with a dash in its name', () => {
    expect(
      UndoL2Alias.cast(
        {},
        'arb-nova:0xf7951D92B0C345144506576eC13Ecf5103aC905a',
      ),
    ).toEqual('eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49')
  })

  it('rejects a value that is not an address', () => {
    expect(() => UndoL2Alias.cast({}, 42)).toThrow(
      'Incoming value must be a chain specific address',
    )
  })
})
