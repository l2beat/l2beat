import { expect } from 'earl'
import { readFileSync } from 'fs'
import { join } from 'path'
import { diffSolidity, type SolidityDiff } from './diffSolidity'
import {
  ALL_RULES,
  bracedBodies,
  canonicalIntegerTypes,
  canonicalStringQuotes,
  ignoreRevertReasons,
  ignoreSolidityVersionPragma,
  type Rule,
} from './rules'

describe(diffSolidity.name, () => {
  describe('what counts as a difference', () => {
    const cases: {
      name: string
      left: string
      right: string
      rules?: Rule[]
      different: boolean
    }[] = [
      {
        name: 'whitespace and reflow',
        left: 'contract C { function f(uint a,uint b) public {x=a+b;} }',
        right: lines(
          'contract C {',
          '  function f(',
          '    uint a,',
          '    uint b',
          '  ) public {',
          '    x = a + b;',
          '  }',
          '}',
        ),
        different: false,
      },
      {
        name: 'comments',
        left: '// owner can pause\ncontract C {}',
        right: '// admin can pause\ncontract C {}',
        different: false,
      },
      {
        name: 'the two import syntaxes',
        left: 'import "a.sol" as A;',
        right: 'import * as A from "a.sol";',
        different: false,
      },
      {
        name: 'declaration order',
        left: 'contract A {}\ncontract B {}',
        right: 'contract B {}\ncontract A {}',
        different: false,
      },
      {
        name: 'a renamed contract',
        left: 'contract ABC {}',
        right: 'contract DCF {}',
        different: true,
      },
      {
        name: 'a revert reason, by default',
        left: inFunction('require(x > 0, "too small");'),
        right: inFunction('require(x > 0, "x is zero");'),
        different: true,
      },
      {
        name: 'a revert reason, with ignoreRevertReasons',
        left: inFunction('require(x > 0, "too small"); revert("a");'),
        right: inFunction('require(x > 0, "x is zero"); revert("b");'),
        rules: [ignoreRevertReasons],
        different: false,
      },
      {
        name: 'a condition next to an ignored revert reason',
        left: inFunction('require(x > 0, "too small");'),
        right: inFunction('require(x > 1, "x is zero");'),
        rules: [ignoreRevertReasons],
        different: true,
      },
      {
        name: 'a custom error in require is not a revert reason',
        left: inFunction('require(x > 0, TooSmall(x));'),
        right: inFunction('require(x > 0, IsZero(x));'),
        rules: [ignoreRevertReasons],
        different: true,
      },
      {
        name: 'a computed reason is not a revert reason',
        left: inFunction('require(x > 0, describe(x)); revert(describe(x));'),
        right: inFunction('require(x > 0, explain(x)); revert(explain(x));'),
        rules: [ignoreRevertReasons],
        different: true,
      },
      {
        name: 'a custom error is not a revert reason',
        left: inFunction('revert Bad("a");'),
        right: inFunction('revert Bad("b");'),
        rules: [ignoreRevertReasons],
        different: true,
      },
      {
        name: 'uint and uint256, with canonicalIntegerTypes',
        left: 'contract C { uint x; mapping(uint => int) m; }',
        right: 'contract C { uint256 x; mapping(uint256 => int256) m; }',
        rules: [canonicalIntegerTypes],
        different: false,
      },
      {
        name: 'quote styles, with canonicalStringQuotes',
        left: "contract C { string s = 'it\\'s'; }",
        right: 'contract C { string s = "it\'s"; }',
        rules: [canonicalStringQuotes],
        different: false,
      },
      {
        name: 'an escaped backslash before a quote, with canonicalStringQuotes',
        left: String.raw`contract C { string s = '\\\''; }`,
        right: String.raw`contract C { string s = "\\'"; }`,
        rules: [canonicalStringQuotes],
        different: false,
      },
      {
        name: 'the solidity version, with ignoreSolidityVersionPragma',
        left: 'pragma solidity ^0.8.0;',
        right: 'pragma solidity 0.8.15;',
        rules: [ignoreSolidityVersionPragma],
        different: false,
      },
      {
        name: 'braces around one statement, with bracedBodies',
        left: inFunction('if (x) return; else y(); for (;;) z();'),
        right: inFunction('if (x) { return; } else { y(); } for (;;) { z(); }'),
        rules: [bracedBodies],
        different: false,
      },
      {
        name: 'assembly reformatting',
        left: inFunction('assembly { let a := mload(0) }'),
        right: inFunction('assembly {\n  let  a  :=  mload(0)\n}'),
        different: false,
      },
      {
        name: 'a renamed local variable',
        left: inFunction('uint a = 1; g(a);'),
        right: inFunction('uint b = 1; g(b);'),
        rules: ALL_RULES,
        different: true,
      },
    ]

    for (const c of cases) {
      it(c.name, () => {
        const diff = diffSolidity(c.left, c.right, c.rules ?? [])
        expect(hasChanges(diff)).toEqual(c.different)
      })
    }
  })

  describe('differences', () => {
    it('point at the changed node inside its declaration', () => {
      const diff = diffSolidity(
        inFunction('require(x > 0, "a");'),
        inFunction('require(x > 1, "b");'),
        [ignoreRevertReasons],
      )
      expect(summary(diff)).toEqual([
        'change children > contract C > subNodes > function f > body > statements > 0 > expression > arguments > 0 > right > number',
      ])
    })

    it('report added and removed declarations by title', () => {
      const diff = diffSolidity(
        'contract C { function f() public {} event E(); }',
        'contract C { function g() public {} event E(); }',
        [],
      )
      expect(summary(diff)).toEqual([
        'remove children > contract C > subNodes > function f',
        'create children > contract C > subNodes > function g',
      ])
    })

    // Overloads share a title and pair in order of appearance.
    it('pair overloads in order', () => {
      const diff = diffSolidity(
        'contract C { function f(uint a) public {} function f() public {} }',
        'contract C { function f(uint b) public {} function f() public {} }',
        [],
      )
      expect(summary(diff)).toEqual([
        'change children > contract C > subNodes > function f > parameters > 0 > name',
      ])
    })

    it('pair repeated titles in order of appearance', () => {
      const diff = diffSolidity(
        'pragma solidity 0.8.0;\npragma solidity 0.8.1;',
        'pragma solidity 0.8.0;\npragma solidity 0.8.2;',
        [],
      )
      expect(summary(diff)).toEqual([
        'change children > pragma solidity #2 > value',
      ])
      expect(changedLines(diff)).toEqual([
        '- pragma solidity 0.8.1;',
        '+ pragma solidity 0.8.2;',
      ])
    })
  })

  describe('lines', () => {
    it('cover every line that shares a node with a change', () => {
      const diff = diffSolidity(
        'contract C { function f(uint a, uint b) public {} }',
        lines(
          'contract C { function f(',
          '  uint a,',
          '  uint c',
          ') public {} }',
        ),
        [],
      )
      expect(changedLines(diff)).toEqual([
        '- contract C { function f(uint a, uint b) public {} }',
        '+ contract C { function f(',
        '+   uint a,',
        '+   uint c',
        '+ ) public {} }',
      ])
    })

    // The parameters are identical, but they sit in an array, which has no
    // range of its own. Their lines must still join the hunk.
    it('cover identical parameters reflowed next to a change', () => {
      const diff = diffSolidity(
        lines(
          'contract C {',
          '  function f(',
          '    uint a,',
          '    uint b',
          '  ) public returns (uint x) {}',
          '}',
        ),
        lines(
          'contract C {',
          '  function f(uint a, uint b) public returns (uint) {}',
          '}',
        ),
        [],
      )
      expect(changedLines(diff)).toEqual([
        '-   function f(',
        '-     uint a,',
        '-     uint b',
        '-   ) public returns (uint x) {}',
        '+   function f(uint a, uint b) public returns (uint) {}',
      ])
    })

    // Only `b` is removed, but the line holding `a` changed on both sides.
    // `external` and the missing `virtual` are values of the function, so
    // they live in its own text. `payable`, `returns (...)` and the signature
    // are its own text too, and they did not change, only moved lines.
    it('mark only the own lines that changed', () => {
      const diff = diffSolidity(
        lines(
          'contract Proxy {',
          '    function upgradeToAndCall(',
          '        address _implementation,',
          '        bytes calldata _data',
          '    )',
          '        public',
          '        payable',
          '        virtual',
          '        proxyCallIfNotAdmin',
          '        returns (bytes memory)',
          '    {',
          '    }',
          '}',
        ),
        lines(
          'contract Proxy {',
          '    function upgradeToAndCall(address _implementation, bytes calldata _data)',
          '        external',
          '        payable',
          '        proxyCallIfNotAdmin',
          '        returns (bytes memory)',
          '    {',
          '    }',
          '}',
        ),
        [],
      )
      // The same as `diff -u` of both sides formatted: the reflowed
      // signature is not a change.
      expect(render(diff)).toEqual([
        '  contract Proxy {',
        '      function upgradeToAndCall(address _implementation, bytes calldata _data)',
        '-         public',
        '+         external',
        '          payable',
        '-         virtual',
        '          proxyCallIfNotAdmin',
        '          returns (bytes memory)',
        '      {',
        '      }',
        '  }',
      ])
    })

    it('ignore added braces next to a changed condition', () => {
      const diff = diffSolidity(
        inFunction('if (x)\n      y();'),
        inFunction('if (z) {\n      y();\n    }'),
        [bracedBodies],
      )
      expect(changedLines(diff)).toEqual(['-     if (x)', '+     if (z) {'])
    })

    it('mark a whitespace edit inside a string', () => {
      const diff = diffSolidity(
        lines('contract C {', '  string s =', '    "a b"', '    "old";', '}'),
        lines('contract C {', '  string s =', '    "a  b"', '    "new";', '}'),
        [],
      )
      expect(changedLines(diff)).toEqual([
        '-     "a b"',
        '-     "old";',
        '+     "a  b"',
        '+     "new";',
      ])
    })

    it('show a removal inside a line on both sides', () => {
      const diff = diffSolidity(inFunction('f(a, b);'), inFunction('f(a);'), [])
      expect(changedLines(diff)).toEqual(['-     f(a, b);', '+     f(a);'])
    })

    it('mark only the header when a function signature changes', () => {
      const diff = diffSolidity(
        lines(
          'contract C {',
          '  function f() public {',
          '    a();',
          '  }',
          '}',
        ),
        lines(
          'contract C {',
          '  function f() external {',
          '    a();',
          '  }',
          '}',
        ),
        [],
      )
      expect(changedLines(diff)).toEqual([
        '-   function f() public {',
        '+   function f() external {',
      ])
    })

    it('put a removed statement between its neighbours', () => {
      const diff = diffSolidity(
        lines(
          'contract C {',
          '  function f() public {',
          '    a();',
          '    b();',
          '    c();',
          '  }',
          '}',
        ),
        lines(
          'contract C {',
          '  function f() public {',
          '    a();',
          '    c();',
          '  }',
          '}',
        ),
        [],
      )
      expect(render(diff).slice(2, 5)).toEqual([
        '      a();',
        '-     b();',
        '      c();',
      ])
    })

    // A call becoming an identifier removes its arguments as one array.
    it('remove every line of a removed array of nodes', () => {
      const diff = diffSolidity(
        inFunction('x = foo(\n      a,\n      b\n    );'),
        inFunction('x = bar;'),
        [],
      )
      expect(render(diff)).toEqual([
        '  contract C {',
        '    function f() public {',
        '-     x = foo(',
        '-       a,',
        '-       b',
        '-     );',
        '+     x = bar;',
        '    }',
        '  }',
      ])
    })

    it('add and remove every line of return parameters', () => {
      const without = lines(
        'contract C {',
        '  function f()',
        '    external',
        '  {}',
        '}',
      )
      const withReturns = lines(
        'contract C {',
        '  function f()',
        '    external',
        '    returns (',
        '      uint256 a,',
        '      uint256 b',
        '    )',
        '  {}',
        '}',
      )
      expect(changedLines(diffSolidity(without, withReturns, []))).toEqual([
        '+     returns (',
        '+       uint256 a,',
        '+       uint256 b',
        '+     )',
      ])
      expect(changedLines(diffSolidity(withReturns, without, []))).toEqual([
        '-     returns (',
        '-       uint256 a,',
        '-       uint256 b',
        '-     )',
      ])
    })
  })

  // Methodology: the right side is the left one reformatted, reordered, with
  // new comments, messages, quotes, integer spellings and pragma. Hidden in
  // it are two real changes, and those must be all that is left.
  describe('the Vault showcase', () => {
    const left = readFileSync(join(__dirname, 'test/Vault.left.sol'), 'utf-8')
    const right = readFileSync(join(__dirname, 'test/Vault.right.sol'), 'utf-8')

    it('finds only the two real changes with all rules', () => {
      const diff = diffSolidity(left, right, ALL_RULES)
      expect(summary(diff)).toEqual([
        'change children > contract Vault > subNodes > function withdraw > body > statements > 0 > expression > arguments > 0 > operator',
        'remove children > contract Vault > subNodes > function setOwner > body > statements > 0',
      ])
      expect(changedLines(diff)).toEqual([
        "-         require(balances[msg.sender] >= amount, 'Vault: insufficient balance');",
        '+         require(',
        '+             balances[msg.sender] > amount,',
        '+             "Vault: insufficient balance"',
        '+         );',
        '-         require(msg.sender == owner, "Vault: not owner");',
      ])
    })

    it('keeps functions paired when only a parameter type changed', () => {
      const diff = diffSolidity(left, right, [])
      expect(summary(diff)).toInclude(
        'change children > contract Vault > subNodes > function deposit > parameters > 0 > typeName > name',
      )
      expect(summary(diff).some((d) => d.endsWith('function deposit'))).toEqual(
        false,
      )
    })
  })

  // Methodology: the formatter fixtures hold one program before and after
  // `format`, so with the right rules there must be nothing left to show.
  it('sees the formatted fixture as the same program', () => {
    const before = readFixture('Format.before.sol')
    const after = readFixture('Format.after.sol')
    expect(hasChanges(diffSolidity(before, after, []))).toEqual(true)
    const diff = diffSolidity(before, after, ALL_RULES)
    expect(diff.differences).toEqual([])
    expect(hasChanges(diff)).toEqual(false)
  })
})

function hasChanges(diff: SolidityDiff): boolean {
  return diff.added + diff.removed > 0
}

function summary(diff: SolidityDiff): string[] {
  return diff.differences.map((d) => `${d.kind} ${d.path.join(' > ')}`)
}

function changedLines(diff: SolidityDiff): string[] {
  return render(diff).filter((line) => line[0] === '+' || line[0] === '-')
}

function render(diff: SolidityDiff): string[] {
  const markers = { added: '+', removed: '-', unchanged: ' ' }
  return diff.lines.map((line) => `${markers[line.type]} ${line.value}`)
}

function inFunction(body: string): string {
  return lines(
    'contract C {',
    '  function f() public {',
    `    ${body}`,
    '  }',
    '}',
  )
}

function lines(...values: string[]): string {
  return values.join('\n')
}

function readFixture(name: string): string {
  return readFileSync(join(__dirname, '../flatten/test', name), 'utf-8')
}
