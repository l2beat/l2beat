import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type FlatEntry, FlatWorkspace } from './FlatWorkspace'
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

const FILES: Record<string, string> = {
  '/p/.flat/Edge.sol': EDGE,
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
