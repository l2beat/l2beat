import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type FlatEntry, FlatWorkspace } from './FlatWorkspace'
import { listCalls } from './listCalls'
import { resolveDefinition } from './resolveDefinition'

const EDGE = `address constant TARGET = 0x2222222222222222222222222222222222222222;

function twice(uint256 a) pure returns (uint256) {
    return a * 2;
}

function twice(uint256 a, uint256 b) pure returns (uint256) {
    return a + b;
}

library L {
    function inc(uint256 a) internal pure returns (uint256) {
        return a + 1;
    }
}

interface IPing {
    function ping() external;
}

interface IOverloaded {
    function f(uint256 a) external;
    function f(uint256 a, uint256 b) external;
}

contract Edge {
    using {L.inc} for uint256;

    uint256 internal value;

    function pick(uint256[2] memory a) internal pure returns (uint256) {
        return a[0];
    }

    function pick(uint256[] memory a) internal pure returns (uint256) {
        return a[0];
    }

    function at(bytes32[] memory a, uint256 i) internal pure returns (bytes32) {
        return a[i];
    }

    function at(address[] memory a, uint256 i) internal pure returns (address) {
        return a[i];
    }

    function run(bool flag, IOverloaded other) external {
        if (flag) {
            uint256 value = 1;
            value += 1;
        }
        value;
        twice(1, 2);
        uint256(1).inc();
        IPing(TARGET).ping();
        other.f(1);
        bytes32[] memory hashes;
        for (uint32 i = 0; i < 2; ++i) {
            at(hashes, i);
        }
    }
}
`

const DERIVED = `library L1 {
    function f(uint256 a) internal pure returns (uint256) {
        return a;
    }
}

library L2 {
    function f(uint256 a) internal pure returns (uint256) {
        return a;
    }
}

interface IPing {
    function ping() external;
}

contract Base {
    using L1 for uint256;

    function hidden() private pure returns (uint256) {
        return 1;
    }

    function g(uint256 a) internal virtual returns (uint256) {
        return hidden() + a.f();
    }

    function g(address a) internal virtual returns (uint256) {
        return 2;
    }
}

contract Derived is Base {
    using L2 for uint256;

    function hidden() private pure returns (uint256) {
        return 3;
    }

    function g(uint256 a) internal override returns (uint256) {
        return super.g(address(0)) + a.f();
    }

    function run() external {
        IPing target = IPing(0x2222222222222222222222222222222222222222);
        target = IPing(0x3333333333333333333333333333333333333333);
        target.ping();
        g(1);
    }
}
`

const FILES: Record<string, string> = {
  '/p/.flat/Edge.sol': EDGE,
  '/p/.flat/Derived.sol': DERIVED,
  '/p/.flat/Target/Impl.1.sol': `contract Impl {
    function ping() internal {}
}
`,
  '/p/.flat/Target/Proxy.p.sol': `contract Proxy {
    function ping() external {}
}
`,
  '/p/.flat/Half.sol': `contract Half {
    function f(uint256 a) external {}
}
`,
  '/p/.flat/Full.sol': `contract Full {
    function f(uint256 a) external {}

    function f(uint256 a, uint256 b) external {}
}
`,
}

describe(`${resolveDefinition.name} edge cases`, () => {
  const workspace = new FlatWorkspace(
    [
      entry('Edge', '1', [], ['/p/.flat/Edge.sol']),
      entry(
        'Target',
        '2',
        [],
        ['/p/.flat/Target/Impl.1.sol', '/p/.flat/Target/Proxy.p.sol'],
      ),
      entry('Half', '3', ['function f(uint256 a)'], ['/p/.flat/Half.sol']),
      entry(
        'Full',
        '4',
        ['function f(uint256 a)', 'function f(uint256 a, uint256 b)'],
        ['/p/.flat/Full.sol'],
      ),
      entry('Derived', '5', [], ['/p/.flat/Derived.sol']),
    ],
    (path) => FILES[path] ?? '',
  )
  const resolve = (snippet: string, symbol: string) =>
    lines(
      resolveDefinition(
        workspace,
        '/p/.flat/Edge.sol',
        EDGE.indexOf(snippet) + snippet.indexOf(symbol),
      ),
    )
  const declaredAt = (declaration: string) =>
    EDGE.slice(0, EDGE.indexOf(declaration)).split('\n').length
  const resolveDerived = (snippet: string, symbol: string) =>
    lines(
      resolveDefinition(
        workspace,
        '/p/.flat/Derived.sol',
        DERIVED.indexOf(snippet) + snippet.indexOf(symbol),
      ),
    )
  const derivedAt = (declaration: string) =>
    DERIVED.slice(0, DERIVED.indexOf(declaration)).split('\n').length

  it('ignores locals of blocks that have ended', () => {
    expect(resolve('value += 1', 'value')).toEqual([
      `Edge.value:${declaredAt('uint256 value = 1')}`,
    ])
    expect(resolve('        value;\n        twice', 'value')).toEqual([
      `Edge.value:${declaredAt('uint256 internal value')}`,
    ])
  })

  it('picks free function and array overloads apart', () => {
    expect(resolve('twice(1, 2)', 'twice')).toEqual([
      `twice:${declaredAt('function twice(uint256 a, uint256 b)')}`,
    ])
    expect(
      workspace.source('/p/.flat/Edge.sol').findFunctions('Edge', 'pick', 1)
        .length,
    ).toEqual(2)
  })

  it('passes narrower integers to wider parameters', () => {
    expect(resolve('at(hashes, i)', 'at')).toEqual([
      `Edge.at:${declaredAt('function at(bytes32[]')}`,
    ])
  })

  it('binds functions listed in a using directive', () => {
    expect(resolve('uint256(1).inc()', 'inc')).toEqual([
      `L.inc:${declaredAt('function inc')}`,
    ])
  })

  it('follows file-level constants and reaches only external functions', () => {
    const result = resolveDefinition(
      workspace,
      '/p/.flat/Edge.sol',
      EDGE.indexOf('IPing(TARGET).ping') + 'IPing(TARGET).'.length,
    )

    expect(result.definitions.map((d) => `${d.label} ${d.path}`)).toEqual([
      'Proxy.ping /p/.flat/Target/Proxy.p.sol',
    ])
  })

  it('matches by ABI only contracts with every interface overload', () => {
    const result = resolveDefinition(
      workspace,
      '/p/.flat/Edge.sol',
      EDGE.indexOf('other.f(1)') + 'other.'.length,
    )

    expect(
      result.definitions.map((d) => `${d.label}:${d.position.line}`),
    ).toEqual(['Full.f:2'])
  })

  it('picks the super overload by argument type', () => {
    expect(resolveDerived('super.g(address(0))', 'g')).toEqual([
      `Base.g:${derivedAt('function g(address a)')}`,
    ])
  })

  it('keeps private calls in the contract that declares them', () => {
    expect(resolveDerived('hidden() + a.f()', 'hidden')).toEqual([
      `Base.hidden:${derivedAt('function hidden() private pure returns (uint256) {\n        return 1')}`,
    ])
  })

  it('prefers the using directives of the contract over inherited ones', () => {
    expect(resolveDerived('address(0)) + a.f()', 'f')).toEqual([
      `L2.f:${derivedAt('library L2') + 1}`,
    ])
    expect(resolveDerived('hidden() + a.f()', 'f')).toEqual([
      `L1.f:${derivedAt('library L1') + 1}`,
    ])
  })

  it('does not follow an initializer of a reassigned local', () => {
    const result = resolveDefinition(
      workspace,
      '/p/.flat/Derived.sol',
      DERIVED.indexOf('target.ping') + 'target.'.length,
    )

    expect(result.receiver?.address).toEqual(undefined)
    expect(result.definitions.map((d) => d.path)).not.toInclude(
      '/p/.flat/Target/Proxy.p.sol',
    )
  })

  it('lists the calls of internal functions', () => {
    const derived = workspace.entries.find((e) => e.name === 'Derived')
    assert(derived !== undefined)
    const calls = listCalls(workspace, derived, 'g')

    expect(calls.map((c) => c.result.symbol)).toEqual(['super.g', 'a.f'])
  })

  it('answers a declaration with itself', () => {
    const declaration = 'function twice(uint256 a, uint256 b)'
    expect(resolve(declaration, 'twice')).toEqual([
      `twice:${declaredAt(declaration)}`,
    ])
  })
})

function lines(result: ReturnType<typeof resolveDefinition>) {
  return result.definitions.map((d) => `${d.label}:${d.position.line}`)
}

function entry(
  name: string,
  digit: string,
  abi: string[],
  sourcePaths: string[],
): FlatEntry {
  const address = ChainSpecificAddress(`eth:0x${digit.repeat(40)}`)
  return { name, address, type: 'Contract', values: {}, abi, sourcePaths }
}
