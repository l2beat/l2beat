import { expect } from 'earl'
import { splitSolidityDeclarations } from './solidityDeclarations'

describe(splitSolidityDeclarations.name, () => {
  const SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./other.sol";

library Math {
    function add(uint a, uint b) internal pure returns (uint) {
        return a + b;
    }
}

/// @notice The vault
contract Vault {
    uint public total;
}

interface IVault {
    function deposit() external;
}
`

  it('rebuilds the original source byte-for-byte when joined', () => {
    const segments = splitSolidityDeclarations(SOURCE)
    const joined = segments.map((s) => s.content).join('')
    expect(joined).toEqual(SOURCE)
  })

  it('names the selectable top-level declarations in order', () => {
    const segments = splitSolidityDeclarations(SOURCE)
    const names = segments.map((s) => s.name).filter((n) => n !== null)
    expect(names).toEqual(['Math', 'Vault', 'IVault'])
  })

  it('keeps the license/pragma/imports preamble as an unnamed segment', () => {
    const segments = splitSolidityDeclarations(SOURCE)
    const preamble = segments[0]
    expect(preamble?.name).toEqual(null)
    expect(preamble?.content.includes('SPDX-License-Identifier')).toEqual(true)
    expect(preamble?.content.includes('pragma solidity')).toEqual(true)
  })

  it('attaches leading NatSpec to its declaration', () => {
    const segments = splitSolidityDeclarations(SOURCE)
    const vault = segments.find((s) => s.name === 'Vault')
    expect(vault?.content.includes('/// @notice The vault')).toEqual(true)
  })

  it('returns the whole input as one unnamed segment when empty of declarations', () => {
    const source = '// just a comment\n'
    const segments = splitSolidityDeclarations(source)
    expect(segments).toEqual([{ name: null, content: source }])
  })

  it('does not abort on a function-list `using` declaration', () => {
    const source = `pragma solidity ^0.8.19;

using {add, sub} for uint256 global;

contract Counter {
    uint256 public value;
}
`
    const segments = splitSolidityDeclarations(source)

    // The whole source is still recoverable byte-for-byte...
    expect(segments.map((s) => s.content).join('')).toEqual(source)
    // ...the `using` line is folded into an unnamed segment...
    expect(segments.some((s) => s.name === 'add')).toEqual(false)
    // ...and the following contract is still split out normally.
    expect(segments.some((s) => s.name === 'Counter')).toEqual(true)
  })
})
