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
  return diff.differences.length > 0
}

function summary(diff: SolidityDiff): string[] {
  return diff.differences.map((d) => `${d.kind} ${d.path.join(' > ')}`)
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
