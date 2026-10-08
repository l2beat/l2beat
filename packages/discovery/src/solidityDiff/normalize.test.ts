import { expect } from 'earl'
import { normalize } from './normalize'

describe(normalize.name, () => {
  // The shared `diff` compares enumerable fields only, so hiding `range`
  // makes layout invisible to it while rendering can still read it.
  it('hides ranges from enumeration but keeps them readable', () => {
    const root = normalize('contract C {}', [])
    expect(Object.keys(root)).not.toInclude('range')
    expect(root.range).toEqual([0, 12])
  })

  // The parser wraps it in a statement without a range, and the differ
  // reads the range of every node.
  it('unwraps the update of a for loop', () => {
    const root = normalize(
      'contract C { function f() public { for (;; i++) {} for (;;) {} } }',
      [],
    ) as unknown as {
      children: {
        subNodes: { body: { statements: { loopExpression: unknown }[] } }[]
      }[]
    }
    const loops = root.children[0]?.subNodes[0]?.body.statements ?? []
    expect(
      loops.map(
        (loop) =>
          (loop.loopExpression as { type: string } | null)?.type ?? null,
      ),
    ).toEqual(['UnaryOperation', null])
  })

  // The parser puts a state variable's initializer under both the
  // declaration and the variable, a diff would report it twice.
  it('keeps a node shared by two parents only once', () => {
    const root = normalize('contract C { uint x = 1; }', []) as unknown as {
      children: { subNodes: unknown[] }[]
    }
    const declaration = root.children[0]?.subNodes[0]
    expect(
      JSON.stringify(declaration).split('NumberLiteral').length - 1,
    ).toEqual(1)
  })
})
