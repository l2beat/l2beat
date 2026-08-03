import { expect } from 'earl'
import { getFunctionCallParameterProjection } from './getFunctionCallParameterProjection'

describe(getFunctionCallParameterProjection.name, () => {
  it('projects the first static function parameter', () => {
    const projection = getFunctionCallParameterProjection(
      'function submit(uint256,address)',
      [0],
    )

    expect(projection).toEqual({
      start: 5,
      length: 32,
      abiType: 'uint256',
    })
  })

  it('projects a member of a static tuple', () => {
    const projection = getFunctionCallParameterProjection(
      'function submit((uint256,address))',
      [0, 1],
    )

    expect(projection).toEqual({
      start: 37,
      length: 32,
      abiType: 'address',
    })
  })

  it('projects Aztec args.start from its dynamic tuple', () => {
    const projection = getFunctionCallParameterProjection(
      'function submitEpochRootProof((uint256,uint256,(bytes32,bytes32,bytes32,address),(bytes32,bytes32,bytes32,bytes32,bytes32,uint256,uint256,address,bytes32,(uint128,uint128),uint256,uint256)[],(bytes,bytes),bytes,bytes))',
      [0, 0],
    )

    expect(projection).toEqual({
      start: 37,
      length: 32,
      abiType: 'uint256',
    })
  })

  it('projects the first dynamic tuple after static parameters', () => {
    const projection = getFunctionCallParameterProjection(
      'function submit(uint256,(bytes32,bytes))',
      [1, 0],
    )

    expect(projection).toEqual({
      start: 69,
      length: 32,
      abiType: 'bytes32',
    })
  })

  it('rejects a path ending at a tuple', () => {
    expect(() =>
      getFunctionCallParameterProjection(
        'function submit((uint256,address))',
        [0],
      ),
    ).toThrow('Grouping parameter must be a scalar')
  })

  it('rejects a dynamic scalar', () => {
    expect(() =>
      getFunctionCallParameterProjection('function submit(bytes)', [0]),
    ).toThrow('Grouping parameter must be a fixed-width scalar')
  })

  it('rejects a parameter after an earlier dynamic value', () => {
    expect(() =>
      getFunctionCallParameterProjection(
        'function submit(bytes,(uint256,bytes))',
        [1, 0],
      ),
    ).toThrow('Grouping parameter has a runtime-dependent calldata offset')
  })

  it('rejects a missing parameter', () => {
    expect(() =>
      getFunctionCallParameterProjection('function submit(uint256)', [1]),
    ).toThrow('Parameter path does not exist')
  })
})
