import { expect } from 'earl'

import { renameIdentifiers } from './renameIdentifier'

describe(renameIdentifiers.name, () => {
  it('renames a type used in a parameter (UserDefinedTypeName prefix)', () => {
    const src =
      'contract Foo { function bar(MyLib.MyStruct memory x) public {} }'
    const result = renameIdentifiers(src, [{ from: 'MyLib', to: 'NewLib' }])
    expect(result).toEqual(
      'contract Foo { function bar(NewLib.MyStruct memory x) public {} }',
    )
  })

  it('renames a library identifier in an expression', () => {
    const src = 'contract Foo { function bar() public { Lib.doSomething(); } }'
    const result = renameIdentifiers(src, [{ from: 'Lib', to: 'NewLib' }])
    expect(result).toEqual(
      'contract Foo { function bar() public { NewLib.doSomething(); } }',
    )
  })

  it('renames a simple type name (full UserDefinedTypeName match)', () => {
    const src =
      'contract Foo { function bar(IERC20 token) public returns (IERC20) {} }'
    const result = renameIdentifiers(src, [{ from: 'IERC20', to: 'IERC20_v2' }])
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
    const result = renameIdentifiers(src, [{ from: 'Lib', to: 'NewLib' }])
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
    const result = renameIdentifiers(src, [
      { from: 'NonExistent', to: 'Something' },
    ])
    expect(result).toEqual(src)
  })

  it('returns source unchanged when prevName equals newName', () => {
    const src = 'contract Foo { function bar(Lib.T x) public {} }'
    const result = renameIdentifiers(src, [{ from: 'Lib', to: 'Lib' }])
    expect(result).toEqual(src)
  })

  it('fails to parse invalid', () => {
    const src = 'anything'
    expect(() => renameIdentifiers(src, [{ from: 'a', to: 'b' }])).toThrow()
  })

  it('renames a variable at declaration and usage sites', () => {
    const src =
      'contract Foo { function bar(uint256 x) public { uint256 y = x + x; } }'
    const result = renameIdentifiers(src, [{ from: 'x', to: 'amount' }])
    expect(result).toEqual(
      'contract Foo { function bar(uint256 amount) public { uint256 y = amount + amount; } }',
    )
  })

  it('does not rename unrelated identifiers', () => {
    const src =
      'contract Foo { function bar(uint256 x, uint256 y) public { uint256 z = x + y; } }'
    const result = renameIdentifiers(src, [{ from: 'x', to: 'amount' }])
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
    const result = renameIdentifiers(src, [{ from: 'Token', to: 'NewToken' }])
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
    const result = renameIdentifiers(src, [
      { from: 'Counter', to: 'CounterV2' },
    ])
    expect(result).toInclude('function add(CounterV2 storage c)')
  })

  it('renames a contract declaration name', () => {
    const src = 'contract Base { function f() public {} }'
    const result = renameIdentifiers(src, [{ from: 'Base', to: 'Base_1' }])
    expect(result).toEqual('contract Base_1 { function f() public {} }')
  })

  it('renames a contract declaration name and body self-references', () => {
    const src = 'contract Foo { function f(Foo x) public {} }'
    const result = renameIdentifiers(src, [{ from: 'Foo', to: 'Foo_1' }])
    expect(result).toEqual('contract Foo_1 { function f(Foo_1 x) public {} }')
  })

  it('renames an abstract contract declaration name', () => {
    const src = 'abstract contract Base { function f() public virtual; }'
    const result = renameIdentifiers(src, [{ from: 'Base', to: 'Base_1' }])
    expect(result).toEqual(
      'abstract contract Base_1 { function f() public virtual; }',
    )
  })

  it('renames a struct declaration name', () => {
    const src = 'struct MyData { uint256 value; }'
    const result = renameIdentifiers(src, [{ from: 'MyData', to: 'MyData_1' }])
    expect(result).toEqual('struct MyData_1 { uint256 value; }')
  })

  it('renames an enum declaration name', () => {
    const src = 'enum Status { Active, Inactive }'
    const result = renameIdentifiers(src, [{ from: 'Status', to: 'Status_1' }])
    expect(result).toEqual('enum Status_1 { Active, Inactive }')
  })

  it('renames multiple different identifiers in one pass', () => {
    const src =
      'contract Foo { function bar(Lib.Type memory x, Other y) public {} }'
    const result = renameIdentifiers(src, [
      { from: 'Lib', to: 'NewLib' },
      { from: 'Other', to: 'Other_1' },
    ])
    expect(result).toEqual(
      'contract Foo { function bar(NewLib.Type memory x, Other_1 y) public {} }',
    )
  })

  describe('with leading comments', () => {
    it('renames correctly with a leading single-line comment', () => {
      const src =
        '// SPDX-License-Identifier: MIT\ncontract Foo { function bar(Lib.T x) public {} }'
      const result = renameIdentifiers(src, [{ from: 'Lib', to: 'NewLib' }])
      expect(result).toEqual(
        '// SPDX-License-Identifier: MIT\ncontract Foo { function bar(NewLib.T x) public {} }',
      )
    })

    it('renames correctly with multiple leading single-line comments', () => {
      const src = [
        '// Line 1',
        '// Line 2',
        'contract Foo { function bar(IERC20 t) public {} }',
      ].join('\n')
      const result = renameIdentifiers(src, [
        { from: 'IERC20', to: 'IERC20_v2' },
      ])
      expect(result).toEqual(
        [
          '// Line 1',
          '// Line 2',
          'contract Foo { function bar(IERC20_v2 t) public {} }',
        ].join('\n'),
      )
    })

    it('renames correctly with a leading block comment', () => {
      const src =
        '/* multi-line\n   block comment */\ncontract Foo { function bar(Lib.T x) public {} }'
      const result = renameIdentifiers(src, [{ from: 'Lib', to: 'NewLib' }])
      expect(result).toEqual(
        '/* multi-line\n   block comment */\ncontract Foo { function bar(NewLib.T x) public {} }',
      )
    })

    it('renames correctly with leading whitespace and comments mixed', () => {
      const src =
        '  \n// comment\n  /* block */\ncontract Foo { function bar(Token t) public {} }'
      const result = renameIdentifiers(src, [{ from: 'Token', to: 'Token_1' }])
      expect(result).toEqual(
        '  \n// comment\n  /* block */\ncontract Foo { function bar(Token_1 t) public {} }',
      )
    })

    it('renames the contract name with leading comments', () => {
      const src = '// license header\ncontract Base { function f() public {} }'
      const result = renameIdentifiers(src, [{ from: 'Base', to: 'Base_1' }])
      expect(result).toEqual(
        '// license header\ncontract Base_1 { function f() public {} }',
      )
    })

    it('renames multiple identifiers with a leading NatSpec comment', () => {
      const src = [
        '/// @title Foo contract',
        '/// @notice Does things',
        'contract Foo { function bar(Lib.T memory x, Other y) public {} }',
      ].join('\n')
      const result = renameIdentifiers(src, [
        { from: 'Lib', to: 'NewLib' },
        { from: 'Other', to: 'Other_1' },
      ])
      expect(result).toEqual(
        [
          '/// @title Foo contract',
          '/// @notice Does things',
          'contract Foo { function bar(NewLib.T memory x, Other_1 y) public {} }',
        ].join('\n'),
      )
    })
  })
})
