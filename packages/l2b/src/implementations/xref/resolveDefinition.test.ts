import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type FlatEntry, FlatWorkspace } from './FlatWorkspace'
import { resolveDefinition } from './resolveDefinition'

const ROLLUP = `interface IBridge {
    function count() external view returns (uint256);
    function inbox() external view returns (IInbox);
}

interface IInbox {
    function send(uint256 a) external;
    function send(uint256 a, uint256 b) external;
}

library Math {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
}

contract Base {
    function hook() internal virtual {}
}

contract Rollup is Base {
    using Math for uint256;

    IBridge public bridge;

    function run(IInbox target) external {
        uint256 c = bridge.count();
        bridge.inbox().send(1, 2);
        c.add(1);
        target.send(1);
        IInbox local = bridge.inbox();
        local.send{value: 1}(1);
    }

    function hook() internal override {
        super.hook();
    }
}
`

const BRIDGE = `interface IBridge {
    function count() external view returns (uint256);
}

abstract contract AbsBridge is IBridge {
    address public inbox;

    function count() external view returns (uint256) {
        return 1;
    }
}

contract Bridge is AbsBridge {}
`

const INBOX = `contract Inbox {
    function send(uint256 a) external {}
    function send(uint256 a, uint256 b) external {}
}
`

const ROLLUP_PATH = '/p/.flat/Rollup/Rollup.sol'
const FILES: Record<string, string> = {
  [ROLLUP_PATH]: ROLLUP,
  '/p/.flat/Bridge.sol': BRIDGE,
  '/p/.flat/Inbox.sol': INBOX,
}

const ROLLUP_ADDRESS = address('1')
const BRIDGE_ADDRESS = address('2')
const INBOX_ADDRESS = address('3')
const OTHER_ADDRESS = address('4')

describe(resolveDefinition.name, () => {
  const workspace = new FlatWorkspace(
    [
      entry('Rollup', ROLLUP_ADDRESS, { bridge: BRIDGE_ADDRESS }, []),
      entry('Bridge', BRIDGE_ADDRESS, { inbox: INBOX_ADDRESS }, []),
      entry('Inbox', INBOX_ADDRESS, {}, [
        'function send(uint256 a)',
        'function send(uint256 a, uint256 b)',
      ]),
      entry('Other', OTHER_ADDRESS, {}, ['function unrelated()'], []),
    ],
    (path) => FILES[path] ?? '',
  )

  it('follows a discovered value to the inherited implementation', () => {
    const result = resolveAt(workspace, 'bridge.count')

    expect(result.receiver?.address).toEqual(BRIDGE_ADDRESS)
    expect(summary(result.definitions)).toEqual([
      'AbsBridge.count /p/.flat/Bridge.sol:8:14 discovered-value Bridge',
    ])
  })

  it('chains getters and picks the overload by argument count', () => {
    const result = resolveAt(workspace, 'bridge.inbox().send')

    expect(result.receiver?.address).toEqual(INBOX_ADDRESS)
    expect(summary(result.definitions)).toEqual([
      'Inbox.send /p/.flat/Inbox.sol:3:14 discovered-value Inbox',
    ])
  })

  it('follows a local initializer and ignores call options', () => {
    const result = resolveAt(workspace, 'local.send')

    expect(summary(result.definitions)).toEqual([
      'Inbox.send /p/.flat/Inbox.sol:2:14 discovered-value Inbox',
    ])
  })

  it('matches by ABI only among contracts on the same chain', () => {
    const otherChain = new FlatWorkspace(
      [
        entry('Rollup', ROLLUP_ADDRESS, { bridge: BRIDGE_ADDRESS }, []),
        entry('Bridge', BRIDGE_ADDRESS, { inbox: INBOX_ADDRESS }, []),
        {
          name: 'Inbox',
          address: ChainSpecificAddress(`arb1:0x${'3'.repeat(40)}`),
          type: 'Contract',
          values: {},
          abi: [
            'function send(uint256 a)',
            'function send(uint256 a, uint256 b)',
          ],
          sourcePaths: ['/p/.flat/Inbox.sol'],
        },
      ],
      (path) => FILES[path] ?? '',
    )
    const offset = ROLLUP.indexOf('target.send') + 'target.'.length
    const result = resolveDefinition(otherChain, ROLLUP_PATH, offset)

    expect(result.definitions.map((d) => d.resolution)).toEqual(['in-file'])
  })

  it('matches parameters by ABI when no value is known', () => {
    const result = resolveAt(workspace, 'target.send')

    expect(result.receiver?.address).toEqual(undefined)
    expect(summary(result.definitions)).toEqual([
      'Inbox.send /p/.flat/Inbox.sol:2:14 abi-match Inbox',
    ])
  })

  it('resolves using-for calls to the library', () => {
    const result = resolveAt(workspace, 'c.add')

    expect(summary(result.definitions)).toEqual([
      'Math.add /p/.flat/Rollup/Rollup.sol:12:14 in-file',
    ])
  })

  it('resolves super to the next implementation in the linearization', () => {
    const result = resolveAt(workspace, 'super.hook')

    expect(summary(result.definitions)).toEqual([
      'Base.hook /p/.flat/Rollup/Rollup.sol:18:14 in-file',
    ])
  })

  it('resolves an identifier to its declaration', () => {
    const offset = ROLLUP.indexOf('bridge.count')
    const result = resolveDefinition(workspace, ROLLUP_PATH, offset)

    expect(summary(result.definitions)).toEqual([
      'Rollup.bridge /p/.flat/Rollup/Rollup.sol:24:20 in-file',
    ])
  })
})

describe(`${resolveDefinition.name} inside a contract`, () => {
  const VAULT = `function increment(uint256 i) pure returns (uint256) {
    return i + 1;
}

struct Point {
    uint256 x;
    uint256 y;
}

library OtherTree {
    struct Node {
        uint256 other;
    }
}

library BalancedTree {
    struct Node {
        uint256 weight;
    }

    struct Tree {
        mapping(uint256 => Node) nodes;
    }

    function init(bytes memory data) internal pure returns (uint256) {
        return data.length;
    }

    function init(uint256 value) internal pure returns (uint256) {
        return value;
    }
}

library Math {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
}

library AddressSet {
    struct Set {
        address[] items;
    }

    function add(Set storage set, address item) internal {
        set.items.push(item);
    }
}

interface ArbSys {
    function arbBlockNumber() external view returns (uint256);
}

interface IOther {
    enum MachineStatus {
        Unknown
    }
}

library Constants {
    address internal constant DEFAULT_SENDER = address(0xdead);

    enum Status {
        Running,
        Finished
    }
}

enum MachineStatus {
    Running,
    Errored
}

abstract contract Base {
    function run() external {
        _hook();
    }

    function _hook() internal virtual;

    function describe(address who) internal pure returns (uint256) {
        return 1;
    }

    function describe(uint256 amount) internal pure returns (uint256) {
        return amount;
    }
}

contract Vault is Base {
    using Math for uint256;

    event Moved(uint256 from);
    event Moved(uint256 from, uint256 to);
    using AddressSet for AddressSet.Set;

    AddressSet.Set private owners;
    BalancedTree.Tree private tree;

    function _hook() internal override {
        owners.add(msg.sender);
        uint256 total = uint256(5).add(1);
        for (uint256 i = 0; i < total; i = increment(i)) {}
        describe(total);
        ArbSys(address(100)).arbBlockNumber();
        address sender = Constants.DEFAULT_SENDER;
        MachineStatus machine = MachineStatus.Errored;
        Constants.Status status = Constants.Status.Finished;
    }

    function probe(ArbSys target) external {
        Point memory point = Point({ x: 1, y: 2 });
        describe({ amount: 3 });
        point.y;
        emit Moved(1, 2);
        tree.nodes[1].weight;
        BalancedTree.init(2);
        try target.arbBlockNumber() returns (uint256 blockNumber) {
            blockNumber;
        } catch Error(string memory reason) {
            reason;
        }
    }
}
`
  const path = '/p/.flat/Vault.sol'
  const workspace = new FlatWorkspace(
    [entry('Vault', address('5'), {}, [], [path])],
    () => VAULT,
  )
  const resolve = (snippet: string, symbol: string) =>
    resolveDefinition(
      workspace,
      path,
      VAULT.indexOf(snippet) + snippet.indexOf(symbol),
    )
  const declaredAt = (declaration: string) =>
    VAULT.slice(0, VAULT.indexOf(declaration)).split('\n').length

  it('dispatches virtual calls to the override in the deployed contract', () => {
    const result = resolve('_hook();', '_hook')

    expect(lines(result)).toEqual([
      `Vault._hook:${declaredAt('function _hook() internal override')}`,
    ])
  })

  it('binds using-for calls to the library declared for the receiver type', () => {
    expect(lines(resolve('owners.add', 'add'))).toEqual([
      `AddressSet.add:${declaredAt('function add(Set storage')}`,
    ])
    expect(lines(resolve('uint256(5).add', 'add'))).toEqual([
      `Math.add:${declaredAt('function add(uint256 a')}`,
    ])
  })

  it('picks the overload whose parameter types match the arguments', () => {
    expect(lines(resolve('describe(total)', 'describe'))).toEqual([
      `Base.describe:${declaredAt('function describe(uint256')}`,
    ])
  })

  it('resolves calls in a for loop update', () => {
    expect(lines(resolve('increment(i))', 'increment'))).toEqual([
      `increment:${declaredAt('function increment')}`,
    ])
  })

  it('goes to internal constants and enum values named through their type', () => {
    expect(
      lines(resolve('Constants.DEFAULT_SENDER', 'DEFAULT_SENDER')),
    ).toEqual([
      `Constants.DEFAULT_SENDER:${declaredAt('address internal constant')}`,
    ])
    expect(lines(resolve('MachineStatus.Errored', 'Errored'))).toEqual([
      `MachineStatus.Errored:${declaredAt('    Errored')}`,
    ])
    expect(lines(resolve('Constants.Status.Finished', 'Finished'))).toEqual([
      `Constants.Status.Finished:${declaredAt('        Finished')}`,
    ])
  })

  it('finds variables declared by try and catch clauses', () => {
    expect(lines(resolve('blockNumber;', 'blockNumber'))).toEqual([
      `Vault.blockNumber:${declaredAt('try target')}`,
    ])
    expect(lines(resolve('reason;', 'reason'))).toEqual([
      `Vault.reason:${declaredAt('} catch Error')}`,
    ])
  })

  it('goes from a named argument to the parameter or field it sets', () => {
    expect(lines(resolve('y: 2', 'y'))).toEqual([
      `Point.y:${declaredAt('    uint256 y;')}`,
    ])
    expect(lines(resolve('amount: 3', 'amount'))).toEqual([
      `Base.describe.amount:${declaredAt('function describe(uint256')}`,
    ])
  })

  it('goes to struct fields, nested types, bound libraries and events', () => {
    expect(lines(resolve('point.y;', 'y'))).toEqual([
      `Point.y:${declaredAt('    uint256 y;')}`,
    ])
    expect(lines(resolve('Constants.Status status', 'Status'))).toEqual([
      `Constants.Status:${declaredAt('    enum Status')}`,
    ])
    expect(lines(resolve('using Math for uint256;', 'Math'))).toEqual([
      `Math:${declaredAt('library Math')}`,
    ])
    expect(lines(resolve('emit Moved(1, 2)', 'Moved'))).toEqual([
      `Vault.Moved:${declaredAt('event Moved(uint256 from, uint256 to)')}`,
    ])
  })

  it('reads a struct type where it was declared, even through a mapping', () => {
    expect(lines(resolve('tree.nodes[1].weight', 'weight'))).toEqual([
      `Node.weight:${declaredAt('        uint256 weight;')}`,
    ])
  })

  it('passes number literals only to integer overloads', () => {
    expect(lines(resolve('BalancedTree.init(2)', 'init'))).toEqual([
      `BalancedTree.init:${declaredAt('function init(uint256 value)')}`,
    ])
  })

  it('reads precompile addresses from integer literals', () => {
    const result = resolve(
      'ArbSys(address(100)).arbBlockNumber',
      'arbBlockNumber',
    )

    expect(result.receiver?.address).toEqual(
      ChainSpecificAddress('eth:0x0000000000000000000000000000000000000064'),
    )
  })
})

function lines(result: ReturnType<typeof resolveDefinition>) {
  return result.definitions.map((d) => `${d.label}:${d.position.line}`)
}

function resolveAt(workspace: FlatWorkspace, access: string) {
  const memberStart = access.lastIndexOf('.') + 1
  const offset = ROLLUP.indexOf(access) + memberStart
  return resolveDefinition(workspace, ROLLUP_PATH, offset)
}

function summary(
  definitions: ReturnType<typeof resolveDefinition>['definitions'],
) {
  return definitions.map((d) =>
    [
      d.label,
      `${d.path}:${d.position.line}:${d.position.column}`,
      d.resolution,
      ...d.entries.map((e) => e.name),
    ].join(' '),
  )
}

function entry(
  name: string,
  address: ChainSpecificAddress,
  values: FlatEntry['values'],
  abi: string[],
  sourcePaths = Object.keys(FILES).filter((p) => p.includes(name)),
): FlatEntry {
  return { name, address, type: 'Contract', values, abi, sourcePaths }
}

function address(digit: string): ChainSpecificAddress {
  return ChainSpecificAddress(`eth:0x${digit.repeat(40)}`)
}
