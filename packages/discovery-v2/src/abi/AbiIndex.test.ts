import { expect } from 'earl'
import { FIXTURE_ABI } from '../testing/fixture'
import { AbiIndex } from './AbiIndex'

/**
 * Resolves method and event references in each spelling a plan may use and
 * checks the hints on a miss. Validator and executor both go through this,
 * so a reference accepted here is a reference that will execute.
 */
describe(AbiIndex.name, () => {
  const abi = AbiIndex.from(FIXTURE_ABI)

  it('finds a function by bare name, by signature and by full fragment', () => {
    for (const reference of [
      'committeeThresholds',
      'committeeThresholds(uint8,uint256)',
      'committeeThresholds(uint8, uint256)',
      'function committeeThresholds(uint8, uint256) view returns (uint256)',
    ]) {
      const lookup = abi.lookupFunction(reference)
      expect(lookup.inAbi).toEqual(true)
      expect(lookup.fragment?.name).toEqual('committeeThresholds')
    }
  })

  it('returns a full fragment that is not in the ABI with inAbi false, for calls into other contracts', () => {
    const lookup = abi.lookupFunction(
      'function totalSupply() view returns (uint256)',
    )
    expect(lookup.inAbi).toEqual(false)
    expect(lookup.fragment?.name).toEqual('totalSupply')
    expect(lookup.error).toEqual(undefined)
  })

  it('names the closest signatures when a name or signature is not in the ABI', () => {
    expect(abi.lookupFunction('commiteeThresholds').error).toEqual(
      'function "commiteeThresholds" is not in the ABI; closest: committeeThresholds(uint8,uint256), OPERATOR_ROLE(), validatorCount()',
    )
    expect(abi.lookupFunction('validators(uint256)').error).toEqual(
      'function "validators(uint256)" is not in the ABI; closest: validators(address), validatorAt(uint256), setValidator(address,bool)',
    )
  })

  it('refuses a bare name that is overloaded and lists the signatures to pick from', () => {
    const overloaded = AbiIndex.from([
      'function deposit(address to) view returns (uint256)',
      'function deposit(address to, uint256 id) view returns (uint256)',
    ])
    expect(overloaded.lookupFunction('deposit').error).toEqual(
      'function "deposit" is overloaded (deposit(address), deposit(address,uint256)); use one of these full signatures',
    )
  })

  it('rejects text that parses as something other than a function', () => {
    expect(abi.lookupFunction('event Foo(address)').error).toEqual(
      '"event Foo(address)" parses as a event, expected a function',
    )
    expect(String(abi.lookupFunction('not a method!').error)).toMatchRegex(
      /is not a function name, a `name\(types\)` signature or a full fragment/,
    )
  })

  it('finds events by name, signature and fragment and computes their topic', () => {
    const byName = abi.lookupEvent('ValidatorStatusUpdate')
    const bySignature = abi.lookupEvent('ValidatorStatusUpdate(address,bool)')
    const byFragment = abi.lookupEvent(
      'event ValidatorStatusUpdate(address validatorAddress, bool isActive)',
    )
    expect(byName.fragment).toEqual(bySignature.fragment)
    expect(byName.fragment).toEqual(byFragment.fragment)
    expect(abi.topic(byName.fragment as never)).toEqual(
      '0x065b77b53864e46fda3d8986acb51696223d6dde7ced42441eb150bae6d48136',
    )
    expect(abi.lookupEvent('RoleGrant').error).toEqual(
      'event "RoleGrant" is not in the ABI; closest: RoleGranted(bytes32,address,address), RoleRevoked(bytes32,address,address), RoleAdminChanged(bytes32,bytes32,bytes32)',
    )
  })

  it('exposes the constructor and the distinct function and event names', () => {
    expect(abi.constructorFragment?.inputs.map((input) => input.name)).toEqual([
      '_owner',
      '_threshold',
    ])
    expect(abi.functionNames()).toInclude('validators', 'owner', 'setValidator')
    expect(abi.eventNames()).toEqual([
      'RoleGranted',
      'RoleRevoked',
      'RoleAdminChanged',
      'ValidatorStatusUpdate',
      'OwnershipTransferred',
    ])
  })
})
