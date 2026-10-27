import { expect } from 'earl'
import { findCodeAnchor } from './findCodeAnchor'

const PROXY = { name: 'Proxy.p.sol', code: 'function upgradeTo() admin {}' }
const IMPLEMENTATION = {
  name: 'Executor.sol',
  code: [
    'interface IExecutor {',
    '  function execute() external;',
    '}',
    'contract Executor is IExecutor {',
    '  function execute() onlyRole(EXECUTOR) {}',
    '  function executeCall() onlyRole(EXECUTOR) {}',
    '  function upgradeTo() {}',
    '}',
  ].join('\n'),
}

describe(findCodeAnchor.name, () => {
  it('searches the implementation of a proxy first', () => {
    const anchor = findCodeAnchor(
      [PROXY, IMPLEMENTATION],
      'function upgradeTo()',
    )
    expect(anchor).toEqual({
      sourceIndex: 1,
      sourceName: 'Executor.sol',
      offset: IMPLEMENTATION.code.indexOf('function upgradeTo()'),
      line: 7,
      contract: 'Executor',
      length: 'function upgradeTo()'.length,
      others: [],
    })
  })

  it('falls back to the other sources', () => {
    const anchor = findCodeAnchor([PROXY, IMPLEMENTATION], 'admin {}')
    expect(anchor?.sourceIndex).toEqual(0)
  })

  it('skips a declaration for the function that implements it', () => {
    const anchor = findCodeAnchor([PROXY, IMPLEMENTATION], 'function execute(')
    expect(anchor?.line).toEqual(5)
    expect(anchor?.contract).toEqual('Executor')
    expect(anchor?.others).toEqual([])
  })

  it('shows a declaration nothing implements', () => {
    const code = 'interface IVault {\n  function pause() external;\n}'
    const anchor = findCodeAnchor([{ name: 'Vault.sol', code }], 'pause()')
    expect(anchor?.contract).toEqual('IVault')
    expect(anchor?.others).toEqual([])
  })

  it('lists the other places with the snippet', () => {
    const anchor = findCodeAnchor([PROXY, IMPLEMENTATION], 'onlyRole(EXECUTOR)')
    expect(anchor?.line).toEqual(5)
    expect(anchor?.others).toEqual([
      {
        offset: IMPLEMENTATION.code.lastIndexOf('onlyRole'),
        line: 6,
        contract: 'Executor',
      },
    ])
  })

  it('returns nothing when no source has the snippet', () => {
    expect(findCodeAnchor([PROXY, IMPLEMENTATION], 'selfdestruct')).toEqual(
      undefined,
    )
  })
})
