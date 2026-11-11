import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { FlatWorkspace } from './FlatWorkspace'
import { resolveAddress } from './resolveDefinition'

const ROUTER = `interface IRegistry {
    function inbox() external view returns (IInbox);
    function instances(address a) external view returns (address);
}

interface IInbox {
    function send(uint256 a) external;
}

contract Router {
    IRegistry public immutable registry;
    address internal _owner;

    function run(IInbox target) external {
        registry.instances(address(this));
        IInbox local = registry.inbox();
        local.send(1);
        target.send(1);
        _owner;
    }
}
`

const REGISTRY = `contract Registry {
    address public inbox;
}
`

const ROUTER_PATH = '/p/.flat/Router.sol'
const FILES: Record<string, string> = {
  [ROUTER_PATH]: ROUTER,
  '/p/.flat/Registry.sol': REGISTRY,
}

const ROUTER_ADDRESS = address('1')
const REGISTRY_ADDRESS = address('2')
const INBOX_ADDRESS = address('3')
const OWNER_ADDRESS = address('4')

describe(resolveAddress.name, () => {
  const workspace = new FlatWorkspace(
    [
      {
        name: 'Router',
        address: ROUTER_ADDRESS,
        type: 'Contract',
        values: { registry: REGISTRY_ADDRESS, owner: OWNER_ADDRESS },
        abi: [],
        sourcePaths: [ROUTER_PATH],
      },
      {
        name: 'Registry',
        address: REGISTRY_ADDRESS,
        type: 'Contract',
        values: { inbox: INBOX_ADDRESS },
        abi: [],
        sourcePaths: ['/p/.flat/Registry.sol'],
      },
    ],
    (path) => FILES[path] ?? '',
  )

  it('reads a state variable from its discovered value', () => {
    expect(resolveAt(workspace, 'registry.instances', 'registry')).toEqual({
      symbol: 'registry',
      address: REGISTRY_ADDRESS,
    })
    expect(resolveAt(workspace, '_owner;', '_owner')).toEqual({
      symbol: '_owner',
      address: OWNER_ADDRESS,
    })
  })

  it('reads a state variable at its declaration', () => {
    expect(resolveAt(workspace, 'immutable registry', 'registry')).toEqual({
      symbol: 'registry',
      address: REGISTRY_ADDRESS,
    })
  })

  it('follows a local to its initializer', () => {
    expect(resolveAt(workspace, 'local.send', 'local')).toEqual({
      symbol: 'local',
      address: INBOX_ADDRESS,
    })
  })

  it('takes a called getter for what it returns', () => {
    expect(resolveAt(workspace, 'registry.inbox()', 'inbox')).toEqual({
      symbol: 'registry.inbox()',
      address: INBOX_ADDRESS,
    })
  })

  it('knows no address for parameters and calls with arguments', () => {
    expect(resolveAt(workspace, 'target.send', 'target')).toEqual({
      symbol: 'target',
      address: undefined,
    })
    expect(resolveAt(workspace, 'registry.instances', 'instances')).toEqual({
      symbol: 'registry.instances(address(this))',
      address: undefined,
    })
  })

  it('knows nothing about keywords', () => {
    expect(resolveAt(workspace, 'function run', 'function')).toEqual({
      symbol: '',
      address: undefined,
    })
  })
})

function resolveAt(workspace: FlatWorkspace, context: string, word: string) {
  const start = ROUTER.indexOf(context)
  expect(start).not.toEqual(-1)
  const offset = start + context.indexOf(word)
  return resolveAddress(workspace, ROUTER_PATH, offset)
}

function address(digit: string): ChainSpecificAddress {
  return ChainSpecificAddress(`eth:0x${digit.repeat(40)}`)
}
