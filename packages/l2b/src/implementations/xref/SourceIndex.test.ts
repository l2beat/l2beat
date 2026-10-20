import { expect } from 'earl'
import { SourceIndex } from './SourceIndex'

describe(SourceIndex.name, () => {
  const source = `interface IERC165 {}
contract ERC165 is IERC165 {}
contract AccessControl is ERC165 {}
interface IReceiver is IERC165 {}
contract Timelock is AccessControl, IReceiver {}
`

  it('linearizes bases with C3, most derived first', () => {
    const index = new SourceIndex('/p/.flat/Timelock.sol', source)

    expect(index.contracts.get('Timelock')?.linearization).toEqual([
      'Timelock',
      'IReceiver',
      'AccessControl',
      'ERC165',
      'IERC165',
    ])
  })

  it('treats the last contract as the deployed one', () => {
    const index = new SourceIndex('/p/.flat/Timelock.sol', source)

    expect(index.mainContract?.node.name).toEqual('Timelock')
  })

  it('converts between offsets and 1-based positions', () => {
    const index = new SourceIndex('/p/.flat/Timelock.sol', source)
    const offset = source.indexOf('AccessControl is')

    expect(index.positionOf(offset)).toEqual({ line: 3, column: 10 })
    expect(index.offsetOf({ line: 3, column: 10 })).toEqual(offset)
  })
})
