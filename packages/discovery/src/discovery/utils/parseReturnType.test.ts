import { expect } from 'earl'
import { parseReturnType, type TupleType, type Type } from './parseReturnType'

function BaseT(typeName: string): Type {
  return { kind: 'base', typeName }
}

function ArrayT(length: number | 'dynamic', type: any): Type {
  return { kind: 'array', length, childType: type }
}

function TupleT(elements: any[]): TupleType {
  return { kind: 'tuple', elements }
}

function TupleE(type: Type, name?: string): any {
  return { name, type }
}

describe(parseReturnType.name, () => {
  const baseTypes = ['address', 'uint256', 'bytes32']
  for (const baseType of baseTypes) {
    it(`handles a solidity base type (${baseType})`, () => {
      expect(parseReturnType(`(${baseType})`)).toEqual(
        TupleT([TupleE(BaseT(baseType))]),
      )
    })
  }

  it('handles multiple solidity base types', () => {
    expect(parseReturnType('(uint256, address, bytes32, uint256)')).toEqual(
      TupleT([
        TupleE(BaseT('uint256')),
        TupleE(BaseT('address')),
        TupleE(BaseT('bytes32')),
        TupleE(BaseT('uint256')),
      ]),
    )
  })

  it('handles multiple solidity base types with names', () => {
    expect(
      parseReturnType('(uint256 A, address B, bytes32 C, uint256 D)'),
    ).toEqual(
      TupleT([
        TupleE(BaseT('uint256'), 'A'),
        TupleE(BaseT('address'), 'B'),
        TupleE(BaseT('bytes32'), 'C'),
        TupleE(BaseT('uint256'), 'D'),
      ]),
    )
  })

  it('handles multiple solidity base types with names, where one missing', () => {
    expect(
      parseReturnType('(uint256 A, address, bytes32 C, uint256 D)'),
    ).toEqual(
      TupleT([
        TupleE(BaseT('uint256'), 'A'),
        TupleE(BaseT('address')),
        TupleE(BaseT('bytes32'), 'C'),
        TupleE(BaseT('uint256'), 'D'),
      ]),
    )
  })

  it('handles arrays', () => {
    expect(parseReturnType('(uint256[] A, address[4])')).toEqual(
      TupleT([
        TupleE(ArrayT('dynamic', BaseT('uint256')), 'A'),
        TupleE(ArrayT(4, BaseT('address'))),
      ]),
    )
  })

  it('handles tuples', () => {
    expect(
      parseReturnType('(tuple(tuple(uint256[] A) XYZ, tuple(address[4])) ctx)'),
    ).toEqual(
      TupleT([
        TupleE(
          TupleT([
            TupleE(
              TupleT([TupleE(ArrayT('dynamic', BaseT('uint256')), 'A')]),
              'XYZ',
            ),
            TupleE(TupleT([TupleE(ArrayT(4, BaseT('address')))])),
          ]),
          'ctx',
        ),
      ]),
    )
  })

  it('handles multiple solidity base types with names', () => {
    expect(
      parseReturnType('(TypeConverter1 A, Mapping B, TimeString C, uint256 D)'),
    ).toEqual(
      TupleT([
        TupleE(BaseT('TypeConverter1'), 'A'),
        TupleE(BaseT('Mapping'), 'B'),
        TupleE(BaseT('TimeString'), 'C'),
        TupleE(BaseT('uint256'), 'D'),
      ]),
    )
  })

  it('fails if provided type does not have parens', () => {
    expect(() => parseReturnType('uint256')).toThrow()
  })
})
