import { parse } from '@mradomski/fast-solidity-parser'
import { expect } from 'earl'

import { renameIdentifiers } from './renameIdentifier'

describe(renameIdentifiers.name, () => {
  it('renames a type used in a parameter (UserDefinedTypeName prefix)', () => {
    const src =
      'contract Foo { function bar(MyLib.MyStruct memory x) public {} }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'MyLib', to: 'NewLib' },
    ])
    expect(result).toEqual(
      'contract Foo { function bar(NewLib.MyStruct memory x) public {} }',
    )
  })

  it('renames a library identifier in an expression', () => {
    const src = 'contract Foo { function bar() public { Lib.doSomething(); } }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Lib', to: 'NewLib' },
    ])
    expect(result).toEqual(
      'contract Foo { function bar() public { NewLib.doSomething(); } }',
    )
  })

  it('renames a simple type name (full UserDefinedTypeName match)', () => {
    const src =
      'contract Foo { function bar(IERC20 token) public returns (IERC20) {} }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'IERC20', to: 'IERC20_v2' },
    ])
    expect(result).toEqual(
      'contract Foo { function bar(IERC20_v2 token) public returns (IERC20_v2) {} }',
    )
  })

  it('renames multiple occurrences of the same identifier', () => {
    const src = [
      'contract Foo {',
      '    function bar(Lib.Type memory a) public {',
      '        Lib.doX();',
      '        Lib.doY(a);',
      '    }',
      '}',
    ].join('\n')
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Lib', to: 'NewLib' },
    ])
    const expected = [
      'contract Foo {',
      '    function bar(NewLib.Type memory a) public {',
      '        NewLib.doX();',
      '        NewLib.doY(a);',
      '    }',
      '}',
    ].join('\n')
    expect(result).toEqual(expected)
  })

  it('returns source unchanged when identifier is not found', () => {
    const src = 'contract Foo { function bar() public {} }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'NonExistent', to: 'Something' },
    ])
    expect(result).toEqual(src)
  })

  it('returns source unchanged when prevName equals newName', () => {
    const src = 'contract Foo { function bar(Lib.T x) public {} }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Lib', to: 'Lib' },
    ])
    expect(result).toEqual(src)
  })

  it('returns source unchanged for null AST', () => {
    const src = 'anything'
    const result = renameIdentifiers(src, null, [{ from: 'a', to: 'b' }])
    expect(result).toEqual(src)
  })

  it('renames a variable at declaration and usage sites', () => {
    const src =
      'contract Foo { function bar(uint256 x) public { uint256 y = x + x; } }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'x', to: 'amount' },
    ])
    expect(result).toEqual(
      'contract Foo { function bar(uint256 amount) public { uint256 y = amount + amount; } }',
    )
  })

  it('does not rename unrelated identifiers', () => {
    const src =
      'contract Foo { function bar(uint256 x, uint256 y) public { uint256 z = x + y; } }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'x', to: 'amount' },
    ])
    expect(result).toInclude('amount')
    expect(result).toInclude('uint256 y')
    expect(result).toInclude('+ y')
    expect(result).not.toInclude('uint256 amountt')
  })

  it('renames across a struct definition', () => {
    const src = [
      'contract Foo {',
      '    struct MyStruct {',
      '        Token value;',
      '    }',
      '    function bar(Token t) public {}',
      '}',
    ].join('\n')
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Token', to: 'NewToken' },
    ])
    expect(result).toInclude('NewToken value;')
    expect(result).toInclude('function bar(NewToken t)')
  })

  it('works on a library node', () => {
    const src = [
      'library MyLib {',
      '    function add(Counter storage c) internal {',
      '        c.value += 1;',
      '    }',
      '}',
    ].join('\n')
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Counter', to: 'CounterV2' },
    ])
    expect(result).toInclude('function add(CounterV2 storage c)')
  })

  it('renames a contract declaration name', () => {
    const src = 'contract Base { function f() public {} }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Base', to: 'Base_1' },
    ])
    expect(result).toEqual('contract Base_1 { function f() public {} }')
  })

  it('renames a contract declaration name and body self-references', () => {
    const src = 'contract Foo { function f(Foo x) public {} }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Foo', to: 'Foo_1' },
    ])
    expect(result).toEqual('contract Foo_1 { function f(Foo_1 x) public {} }')
  })

  it('renames an abstract contract declaration name', () => {
    const src = 'abstract contract Base { function f() public virtual; }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Base', to: 'Base_1' },
    ])
    expect(result).toEqual(
      'abstract contract Base_1 { function f() public virtual; }',
    )
  })

  it('renames a struct declaration name', () => {
    const src = 'struct MyData { uint256 value; }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'MyData', to: 'MyData_1' },
    ])
    expect(result).toEqual('struct MyData_1 { uint256 value; }')
  })

  it('renames an enum declaration name', () => {
    const src = 'enum Status { Active, Inactive }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Status', to: 'Status_1' },
    ])
    expect(result).toEqual('enum Status_1 { Active, Inactive }')
  })

  it('renames multiple different identifiers in one pass', () => {
    const src =
      'contract Foo { function bar(Lib.Type memory x, Other y) public {} }'
    const ast = parse(src, { range: true })
    const result = renameIdentifiers(src, ast.children[0]!, [
      { from: 'Lib', to: 'NewLib' },
      { from: 'Other', to: 'Other_1' },
    ])
    expect(result).toEqual(
      'contract Foo { function bar(NewLib.Type memory x, Other_1 y) public {} }',
    )
  })
})
