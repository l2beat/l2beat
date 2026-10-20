import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type FlatEntry, FlatWorkspace } from './FlatWorkspace'
import { findReferences } from './findReferences'
import { wordOccurrences } from './SourceIndex'

const ROLLUP = `interface IBridge {
    function count() external view returns (uint256);
}

library Math {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
}

abstract contract Base {
    uint256 internal counter;

    event Counted(uint256 value);

    function hook() internal virtual;

    function bump() external {
        hook();
        counter = counter + 1;
    }
}

contract Rollup is Base {
    using Math for uint256;

    IBridge public bridge;

    struct Point {
        uint256 x;
        uint256 y;
    }

    enum Mode {
        Off,
        On
    }

    function hook() internal override {
        emit Counted(counter);
    }

    function run(IBridge other) external returns (uint256 count) {
        // bridge.count() in a comment
        string memory note = "bridge.count()";
        count = bridge.count();
        count = count.add(bridge.count());
        Point memory point = Point({ x: count, y: 1 });
        point.x = point.y;
        Mode mode = Mode.On;
        other.count();
    }
}
`

const BRIDGE = `contract Bridge {
    function count() external view returns (uint256) {
        return 1;
    }

    function counter() external view returns (uint256) {
        return 2;
    }
}
`

const LIBRARY = `library L {
    function f() internal {}

    function g() internal {
        f();
    }
}
`

const FILES: Record<string, string> = {
  '/p/.flat/Rollup.sol': ROLLUP,
  '/p/.flat/Bridge.sol': BRIDGE,
  '/p/.flat/CopyA.sol': LIBRARY,
  '/p/.flat/CopyB.sol': LIBRARY,
}

describe(findReferences.name, () => {
  const bridgeAddress = address('2')
  const workspace = new FlatWorkspace(
    [
      entry('Rollup', address('1'), { bridge: bridgeAddress }, []),
      entry('Bridge', bridgeAddress, {}, [
        'function count() view returns (uint256)',
        'function counter() view returns (uint256)',
      ]),
      entry('CopyA', address('3'), {}, []),
      entry('CopyB', address('4'), {}, []),
    ],
    (path) => FILES[path] ?? '',
  )

  function referencesAt(file: string, snippet: string, word: string) {
    const text = FILES[file] ?? ''
    const offset = text.indexOf(snippet) + snippet.indexOf(word)
    return findReferences(workspace, file, offset)
  }

  function lines(result: ReturnType<typeof findReferences>) {
    return result.references.map((r) => {
      const file = r.path.slice('/p/.flat/'.length)
      const copies = r.copies.length > 0 ? ` +${r.copies.length}` : ''
      return `${file}:${r.position.line} ${r.resolution}${r.isCall ? ' call' : ''}${copies}`
    })
  }

  const ROLLUP_FILE = '/p/.flat/Rollup.sol'
  const lineOf = (snippet: string) =>
    ROLLUP.slice(0, ROLLUP.indexOf(snippet)).split('\n').length

  it('finds calls from other contracts, skipping comments, strings and longer names', () => {
    const fromDeclaration = referencesAt(
      '/p/.flat/Bridge.sol',
      'function count()',
      'count',
    )

    expect(lines(fromDeclaration)).toEqual([
      `Rollup.sol:${lineOf('count = bridge.count()')} discovered-value call`,
      `Rollup.sol:${lineOf('count.add(bridge.count())')} discovered-value call`,
      `Rollup.sol:${lineOf('other.count()')} abi-match call`,
    ])
  })

  it('gives the same answer from a use as from the declaration', () => {
    const fromUse = referencesAt(
      ROLLUP_FILE,
      'count = bridge.count()',
      'count()',
    )
    const fromDeclaration = referencesAt(
      '/p/.flat/Bridge.sol',
      'function count()',
      'count',
    )

    expect(lines(fromUse)).toEqual(lines(fromDeclaration))
    expect(fromUse.targets.map((t) => t.label)).toEqual(['Bridge.count'])
  })

  it('tells a local variable apart from members with the same name', () => {
    const result = referencesAt(ROLLUP_FILE, 'returns (uint256 count)', 'count')

    expect(lines(result)).toEqual([
      `Rollup.sol:${lineOf('count = bridge.count()')} in-file`,
      `Rollup.sol:${lineOf('count = count.add')} in-file`,
      `Rollup.sol:${lineOf('count = count.add')} in-file`,
      `Rollup.sol:${lineOf('x: count')} in-file`,
    ])
  })

  it('finds inherited state and events but not a getter with that name elsewhere', () => {
    const counter = referencesAt(
      ROLLUP_FILE,
      'uint256 internal counter',
      'counter',
    )
    const counted = referencesAt(ROLLUP_FILE, 'event Counted', 'Counted')

    expect(lines(counter)).toEqual([
      `Rollup.sol:${lineOf('counter = counter + 1')} in-file`,
      `Rollup.sol:${lineOf('counter = counter + 1')} in-file`,
      `Rollup.sol:${lineOf('emit Counted(counter)')} in-file`,
    ])
    expect(lines(counted)).toEqual([
      `Rollup.sol:${lineOf('emit Counted(counter)')} in-file call`,
    ])
  })

  it('counts a virtual call as a reference to the override that runs', () => {
    const override = referencesAt(
      ROLLUP_FILE,
      'function hook() internal override',
      'hook',
    )
    const base = referencesAt(
      ROLLUP_FILE,
      'function hook() internal virtual',
      'hook',
    )

    expect(lines(override)).toEqual([
      `Rollup.sol:${lineOf('hook();')} in-file call`,
    ])
    expect(lines(base)).toEqual([])
  })

  it('finds struct fields, enum values and bound library functions', () => {
    const field = referencesAt(ROLLUP_FILE, 'uint256 x;', 'x')
    const value = referencesAt(ROLLUP_FILE, '        On\n', 'On')
    const add = referencesAt(ROLLUP_FILE, 'function add', 'add')

    expect(lines(field)).toEqual([
      `Rollup.sol:${lineOf('x: count')} in-file`,
      `Rollup.sol:${lineOf('point.x = point.y')} in-file`,
    ])
    expect(lines(value)).toEqual([`Rollup.sol:${lineOf('Mode.On')} in-file`])
    expect(lines(add)).toEqual([
      `Rollup.sol:${lineOf('count.add')} in-file call`,
    ])
  })

  it('reports a reference repeated in identical files once, in the file asked from', () => {
    const offset = LIBRARY.indexOf('function f()') + 'function '.length
    const fromA = findReferences(workspace, '/p/.flat/CopyA.sol', offset)
    const fromB = findReferences(workspace, '/p/.flat/CopyB.sol', offset)

    expect(lines(fromA)).toEqual(['CopyA.sol:5 in-file call +1'])
    expect(lines(fromB)).toEqual(['CopyB.sol:5 in-file call +1'])
  })

  it('finds nothing away from names', () => {
    const result = findReferences(
      workspace,
      ROLLUP_FILE,
      ROLLUP.indexOf('// bridge'),
    )

    expect(result.targets).toEqual([])
    expect(result.references).toEqual([])
  })
})

describe(`${findReferences.name} with a proxy of two implementations`, () => {
  const core = `abstract contract Core {
    function ping() external view returns (uint256) {
        return 1;
    }
}
`
  const files: Record<string, string> = {
    '/p/.flat/Proxy/Admin.1.sol': `${core}\ncontract Admin is Core {}\n`,
    '/p/.flat/Proxy/User.2.sol': `${core}\ncontract User is Core {}\n`,
    '/p/.flat/Caller.sol': `interface IProxy {
    function ping() external view returns (uint256);
}

contract Caller {
    IProxy public target;

    function run() external view returns (uint256) {
        return target.ping();
    }
}
`,
  }
  const proxy = address('5')
  const workspace = new FlatWorkspace(
    [
      {
        name: 'Proxy',
        address: proxy,
        type: 'Contract',
        values: {},
        abi: [],
        sourcePaths: [
          '/p/.flat/Proxy/Admin.1.sol',
          '/p/.flat/Proxy/User.2.sol',
        ],
      },
      {
        name: 'Caller',
        address: address('6'),
        type: 'Contract',
        values: { target: proxy },
        abi: [],
        sourcePaths: ['/p/.flat/Caller.sol'],
      },
    ],
    (path) => files[path] ?? '',
  )

  it('finds the call from either copy of identical implementation code', () => {
    for (const path of Object.keys(files).slice(0, 2)) {
      const text = files[path] ?? ''
      const result = findReferences(workspace, path, text.indexOf('ping'))

      expect(
        result.references.map((r) => `${r.path}:${r.position.line}`),
      ).toEqual(['/p/.flat/Caller.sol:9'])
    }
  })
})

describe(`${findReferences.name} across deployments of identical code`, () => {
  const manager = `contract Manager {
    function owner() external view returns (address) {
        return address(0);
    }
}
`
  const caller = `interface IManager {
    function owner() external view returns (address);
}

contract Caller {
    IManager public manager;

    function admin() external view returns (address) {
        return manager.owner();
    }
}
`
  const managerA = address('a')
  const managerB = address('b')
  const files: Record<string, string> = {
    '/p/.flat/ManagerA.sol': manager,
    '/p/.flat/ManagerB.sol': manager,
    '/p/.flat/CallerA.sol': caller,
    '/p/.flat/CallerB.sol': caller,
  }
  const workspace = new FlatWorkspace(
    [
      contract('ManagerA', managerA, {}),
      contract('ManagerB', managerB, {}),
      contract('CallerA', address('c'), { manager: managerA }),
      contract('CallerB', address('d'), { manager: managerB }),
    ],
    (path) => files[path] ?? '',
  )

  function callersOf(path: string) {
    const offset = manager.indexOf('owner')
    return findReferences(workspace, path, offset).references.map(
      (r) => `${r.path}:${r.position.line} +${r.copies.length}`,
    )
  }

  it('counts a call only for the deployment it reaches', () => {
    expect(callersOf('/p/.flat/ManagerA.sol')).toEqual([
      '/p/.flat/CallerA.sol:9 +0',
    ])
    expect(callersOf('/p/.flat/ManagerB.sol')).toEqual([
      '/p/.flat/CallerB.sol:9 +0',
    ])
  })

  function contract(
    name: string,
    at: ChainSpecificAddress,
    values: FlatEntry['values'],
  ): FlatEntry {
    const sourcePaths = [`/p/.flat/${name}.sol`]
    return { name, address: at, type: 'Contract', values, abi: [], sourcePaths }
  }
})

describe(`${findReferences.name} of code compiled into several flats`, () => {
  const library = `library Consts {
    address internal constant SENDER = address(1);
}
`
  const files: Record<string, string> = {
    '/p/.flat/GatewayA.sol': `${library}
contract GatewayA {
    function check(address caller) external pure returns (bool) {
        uint256 limit = 1;
        return caller == Consts.SENDER && limit > 0;
    }
}
`,
    '/p/.flat/GatewayB.sol': `${library}
contract GatewayB {
    function verify(address caller) external pure returns (bool) {
        uint256 limit = 2;
        return Consts.SENDER != caller && limit > 1;
    }
}
`,
  }
  const workspace = new FlatWorkspace(
    Object.keys(files).map((path, i) => ({
      name: path.slice('/p/.flat/'.length, -'.sol'.length),
      address: address(String(i + 7)),
      type: 'Contract' as const,
      values: {},
      abi: [],
      sourcePaths: [path],
    })),
    (path) => files[path] ?? '',
  )

  function referencesIn(path: string, snippet: string, word: string) {
    const text = files[path] ?? ''
    const offset = text.indexOf(snippet) + snippet.indexOf(word)
    return findReferences(workspace, path, offset).references.map(
      (r) =>
        `${r.path.slice('/p/.flat/'.length)}:${r.position.line}${r.elsewhere ? ' elsewhere' : ''}`,
    )
  }

  it('lists uses of the same library constant in other flats separately', () => {
    expect(
      referencesIn('/p/.flat/GatewayA.sol', 'constant SENDER', 'SENDER'),
    ).toEqual(['GatewayA.sol:8', 'GatewayB.sol:8 elsewhere'])
  })

  it('keeps locals to their own function, whatever other flats contain', () => {
    expect(
      referencesIn('/p/.flat/GatewayA.sol', 'uint256 limit', 'limit'),
    ).toEqual(['GatewayA.sol:8'])
  })
})

describe(wordOccurrences.name, () => {
  it('matches whole identifiers only', () => {
    const text = 'count counter _count count2 (count)'

    expect(wordOccurrences(text, 'count')).toEqual([
      0,
      text.indexOf('(count)') + 1,
    ])
  })
})

function entry(
  name: string,
  address: ChainSpecificAddress,
  values: FlatEntry['values'],
  abi: string[],
): FlatEntry {
  const sourcePaths = [`/p/.flat/${name}.sol`]
  return { name, address, type: 'Contract', values, abi, sourcePaths }
}

function address(digit: string): ChainSpecificAddress {
  return ChainSpecificAddress(`eth:0x${digit.repeat(40)}`)
}
