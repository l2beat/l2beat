import { expect } from 'earl'
import { FIXTURE_ABI } from '../testing/fixture'
import { buildWorklist, Worklist } from './Worklist'

/**
 * Builds the worklist from the fixture ABI and checks membership and shape.
 * The worklist is the closed list the model must rule on, so what is in it,
 * and what is deliberately not, defines what "nothing forgotten" means.
 */
describe(buildWorklist.name, () => {
  const worklist = buildWorklist(FIXTURE_ABI)

  it('lists every view or pure function with at least one input and one output, sorted by signature', () => {
    expect(worklist.items.map((item) => item.signature)).toEqual([
      'balanceOf(address)',
      'committeeThresholds(uint8,uint256)',
      'getRoleAdmin(bytes32)',
      'hasRole(bytes32,address)',
      'quote(uint256)',
      'supportsInterface(bytes4)',
      'validatorAt(uint256)',
      'validators(address)',
    ])
  })

  it('leaves 0-arg getters to the baseline and non-view functions out entirely', () => {
    const signatures = worklist.items.map((item) => item.signature)
    expect(signatures).not.toInclude('owner()')
    expect(signatures).not.toInclude('setValidator(address,bool)')
  })

  it('carries names, canonical types, the full fragment and mutability for each item', () => {
    const item = worklist.items.find(
      (candidate) => candidate.signature === 'hasRole(bytes32,address)',
    )
    expect(item).toEqual({
      signature: 'hasRole(bytes32,address)',
      fragment:
        'function hasRole(bytes32 role, address account) view returns (bool)',
      inputs: [
        { name: 'role', type: 'bytes32' },
        { name: 'account', type: 'address' },
      ],
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'view',
    })
    const quote = worklist.items.find(
      (candidate) => candidate.signature === 'quote(uint256)',
    )
    expect(quote?.stateMutability).toEqual('pure')
  })

  it('lists every event with indexed flags, sorted by signature', () => {
    expect(worklist.events.map((event) => event.signature)).toEqual([
      'OwnershipTransferred(address,address)',
      'RoleAdminChanged(bytes32,bytes32,bytes32)',
      'RoleGranted(bytes32,address,address)',
      'RoleRevoked(bytes32,address,address)',
      'ValidatorStatusUpdate(address,bool)',
    ])
    expect(worklist.events[4]).toEqual({
      signature: 'ValidatorStatusUpdate(address,bool)',
      fragment:
        'event ValidatorStatusUpdate(address validatorAddress, bool isActive)',
      inputs: [
        { name: 'validatorAddress', type: 'address', indexed: false },
        { name: 'isActive', type: 'bool', indexed: false },
      ],
    })
  })

  it('spells tuple types out so the model sees the components, and ignores duplicate ABI entries', () => {
    const abi = [
      'function f((address a, uint256 b)[] items) view returns (uint256)',
      'function f((address a, uint256 b)[] items) view returns (uint256)',
    ]
    const { items } = buildWorklist(abi)
    expect(items.length).toEqual(1)
    expect(items[0]?.inputs).toEqual([
      { name: 'items', type: '(address,uint256)[]' },
    ])
  })

  it('round-trips through its own JSON schema, because it is exchanged as a file', () => {
    expect(Worklist.parse(JSON.parse(JSON.stringify(worklist)))).toEqual(
      worklist,
    )
  })
})
