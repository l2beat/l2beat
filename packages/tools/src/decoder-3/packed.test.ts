import { expect } from 'earl'
import { describe } from 'mocha'
import { decodePacked, type PackedSchema } from './packed'
import {
  OP_PERMISSIONED_GAME_ARGS_SCHEMA,
  OP_PERMISSIONLESS_GAME_ARGS_SCHEMA,
  OP_SUPER_PERMISSIONED_GAME_ARGS_SCHEMA,
  OP_ZK_GAME_ARGS_SCHEMA,
} from './packedSchemas'

describe(decodePacked.name, () => {
  it('decodes fixed-width packed fields', () => {
    const schema: PackedSchema = {
      name: 'test',
      fields: [
        { name: 'enabled', type: 'bool' },
        { name: 'delta', type: 'int16' },
        { name: 'count', type: 'uint24' },
        { name: 'tag', type: 'bytes3' },
        { name: 'target', type: 'address' },
      ],
    }
    const encoded =
      '0x01fffe010203abcdef1234567890123456789012345678901234567890'

    expect(decodePacked(schema, encoded, 1)).toEqual({
      type: 'tuple',
      value: '',
      bytes: encoded,
      chainId: 1,
      members: [
        {
          name: 'enabled',
          type: 'bool',
          value: 'true',
          bytes: '0x01',
          chainId: 1,
        },
        {
          name: 'delta',
          type: 'number',
          value: '-2',
          bytes: '0xfffe',
          chainId: 1,
        },
        {
          name: 'count',
          type: 'number',
          value: '66051',
          bytes: '0x010203',
          chainId: 1,
        },
        {
          name: 'tag',
          type: 'bytes',
          value: '0xabcdef',
          bytes: '0xabcdef',
          chainId: 1,
        },
        {
          name: 'target',
          type: 'address',
          value: '0x1234567890123456789012345678901234567890',
          bytes: '0x1234567890123456789012345678901234567890',
          chainId: 1,
        },
      ],
    })
  })

  it('decodes OP permissioned game args', () => {
    const encoded =
      '0xdead000000000000000000000000000000000000000000000000000000000000acc005dcd857b401e4732e6f7837135a22825cfaee018baf058227872540ac60efbd38b023d9dae257b4c29daee99a28e6e86778b499361294c134ea000000000000000000000000000000000000000000000000000000000000def13832bfbef03173e4c49a00ec0dd178817a02d1779ba6e03d8b90de867373db8cf1a58d2f7f006b3a'
    const decoded = decodePacked(OP_PERMISSIONED_GAME_ARGS_SCHEMA, encoded, 1)

    expect(
      decoded.members?.map(({ name, type, value }) => ({ name, type, value })),
    ).toEqual([
      {
        name: 'absolutePrestate',
        type: 'bytes',
        value:
          '0xdead000000000000000000000000000000000000000000000000000000000000',
      },
      {
        name: 'vm',
        type: 'address',
        value: '0xacc005dcd857b401e4732e6f7837135a22825cfa',
      },
      {
        name: 'anchorStateRegistry',
        type: 'address',
        value: '0xee018baf058227872540ac60efbd38b023d9dae2',
      },
      {
        name: 'weth',
        type: 'address',
        value: '0x57b4c29daee99a28e6e86778b499361294c134ea',
      },
      { name: 'l2ChainId', type: 'number', value: '57073' },
      {
        name: 'proposer',
        type: 'address',
        value: '0x3832bfbef03173e4c49a00ec0dd178817a02d177',
      },
      {
        name: 'challenger',
        type: 'address',
        value: '0x9ba6e03d8b90de867373db8cf1a58d2f7f006b3a',
      },
    ])
  })

  it('defines all canonical OP game args lengths', () => {
    const schemas: [PackedSchema, number][] = [
      [OP_PERMISSIONLESS_GAME_ARGS_SCHEMA, 124],
      [OP_PERMISSIONED_GAME_ARGS_SCHEMA, 164],
      [OP_SUPER_PERMISSIONED_GAME_ARGS_SCHEMA, 40],
      [OP_ZK_GAME_ARGS_SCHEMA, 172],
    ]
    const lengths = schemas.map(([schema, length]) => {
      const decoded = decodePacked(schema, `0x${'00'.repeat(length)}`)
      return (decoded.bytes.length - 2) / 2
    })

    expect(lengths).toEqual([124, 164, 40, 172])
  })

  it('rejects data with a different length', () => {
    expect(() =>
      decodePacked(OP_PERMISSIONED_GAME_ARGS_SCHEMA, '0xdeadbeef'),
    ).toThrow()
  })

  it('rejects dynamic and invalid packed types', () => {
    expect(() =>
      decodePacked(
        { name: 'dynamic', fields: [{ name: 'data', type: 'bytes' }] },
        '0x',
      ),
    ).toThrow()
    expect(() =>
      decodePacked(
        { name: 'invalid integer', fields: [{ name: 'n', type: 'uint7' }] },
        '0x00',
      ),
    ).toThrow()
  })
})
