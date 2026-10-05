import { expect } from 'earl'
import { diffSolidity, type SolidityDiff } from './diffSolidity'
import type { Rule } from './rules'

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
        name: 'assembly reformatting',
        left: inFunction('assembly { let a := mload(0) }'),
        right: inFunction('assembly {\n  let  a  :=  mload(0)\n}'),
        different: false,
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
