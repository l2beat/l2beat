import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'
import {
  decodeCairoType,
  decodeFunctionResult,
  FeltReader,
  parseGenericType,
} from './cairoValues'
import {
  getViewFunctions,
  hasFunction,
  parseSierraAbi,
  type SierraAbi,
} from './sierraAbi'
import { starknetSelector } from './starknetKeccak'

const EMPTY_ABI: SierraAbi = {
  functions: [],
  events: [],
  structs: new Map(),
  enums: new Map(),
  constructorInputs: [],
}

describe('cairoValues', () => {
  describe(decodeCairoType.name, () => {
    it('decodes felt252 as hex', () => {
      const reader = new FeltReader(['0x1234'])
      expect(decodeCairoType(reader, 'core::felt252', EMPTY_ABI)).toEqual(
        '0x1234',
      )
    })

    it('decodes printable felt252 as a Cairo short string', () => {
      // 0x322e30 = '2.0', as returned by strk20's get_version
      const reader = new FeltReader(['0x322e30'])
      expect(decodeCairoType(reader, 'core::felt252', EMPTY_ABI)).toEqual(
        "'2.0'",
      )
    })

    it('keeps non-printable felt252 values as hex', () => {
      const key =
        '0x1eed60b8d483b3bede62d1cc0f32874aea30747e6943437c858359b41801bf7'
      const reader = new FeltReader([key])
      expect(decodeCairoType(reader, 'core::felt252', EMPTY_ABI)).toEqual(key)
    })

    it('decodes ContractAddress as strk ChainSpecificAddress', () => {
      const reader = new FeltReader([
        '0x40337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
      ])
      expect(
        decodeCairoType(
          reader,
          'core::starknet::contract_address::ContractAddress',
          EMPTY_ABI,
        ),
      ).toEqual(
        'strk:0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
      )
    })

    it('decodes ClassHash as padded plain hex, not an address', () => {
      const reader = new FeltReader(['0x67dd'])
      const decoded = decodeCairoType(
        reader,
        'core::starknet::class_hash::ClassHash',
        EMPTY_ABI,
      )
      expect(decoded).toEqual(`0x${'67dd'.padStart(64, '0')}`)
    })

    it('decodes u256 from two felts', () => {
      const reader = new FeltReader(['0x5', '0x1'])
      expect(decodeCairoType(reader, 'core::integer::u256', EMPTY_ABI)).toEqual(
        (5n + (1n << 128n)).toString(10),
      )
    })

    it('decodes small integers as numbers', () => {
      const reader = new FeltReader(['0x2a'])
      expect(decodeCairoType(reader, 'core::integer::u64', EMPTY_ABI)).toEqual(
        42,
      )
    })

    it('decodes bool', () => {
      const reader = new FeltReader(['0x0', '0x1'])
      expect(decodeCairoType(reader, 'core::bool', EMPTY_ABI)).toEqual(false)
      expect(decodeCairoType(reader, 'core::bool', EMPTY_ABI)).toEqual(true)
    })

    it('decodes ByteArray strings', () => {
      // 'hello': no full words, pending word 'hello' (5 bytes)
      const hello = `0x${Buffer.from('hello', 'utf8').toString('hex')}`
      const reader = new FeltReader(['0x0', hello, '0x5'])
      expect(
        decodeCairoType(reader, 'core::byte_array::ByteArray', EMPTY_ABI),
      ).toEqual('hello')
    })

    it('decodes arrays with length prefix', () => {
      const reader = new FeltReader(['0x2', '0xa', '0xb'])
      expect(
        decodeCairoType(
          reader,
          'core::array::Array::<core::felt252>',
          EMPTY_ABI,
        ),
      ).toEqual(['0xa', '0xb'])
    })

    it('decodes spans like arrays', () => {
      const reader = new FeltReader(['0x1', '0x7'])
      expect(
        decodeCairoType(
          reader,
          'core::array::Span::<core::integer::u8>',
          EMPTY_ABI,
        ),
      ).toEqual([7])
    })

    it('decodes Option Some and None', () => {
      const some = new FeltReader(['0x0', '0x5'])
      expect(
        decodeCairoType(
          some,
          'core::option::Option::<core::integer::u8>',
          EMPTY_ABI,
        ),
      ).toEqual(5)
      const none = new FeltReader(['0x1'])
      expect(
        decodeCairoType(
          none,
          'core::option::Option::<core::integer::u8>',
          EMPTY_ABI,
        ),
      ).toEqual('None')
    })

    it('decodes structs from the type index', () => {
      const abi: SierraAbi = {
        ...EMPTY_ABI,
        structs: new Map([
          [
            'demo::Pair',
            [
              { name: 'a', type: 'core::felt252' },
              { name: 'b', type: 'core::integer::u8' },
            ],
          ],
        ]),
      }
      const reader = new FeltReader(['0x1', '0x2'])
      expect(decodeCairoType(reader, 'demo::Pair', abi)).toEqual({
        a: '0x1',
        b: 2,
      })
    })

    it('decodes unit enum variants as names', () => {
      const abi: SierraAbi = {
        ...EMPTY_ABI,
        enums: new Map([
          [
            'demo::Status',
            [
              { name: 'Active', type: '()' },
              { name: 'Paused', type: '()' },
            ],
          ],
        ]),
      }
      const reader = new FeltReader(['0x1'])
      expect(decodeCairoType(reader, 'demo::Status', abi)).toEqual('Paused')
    })

    it('decodes tuples', () => {
      const reader = new FeltReader(['0x1', '0x2'])
      expect(
        decodeCairoType(
          reader,
          '(core::felt252, core::integer::u8)',
          EMPTY_ABI,
        ),
      ).toEqual(['0x1', 2])
    })
  })

  describe(decodeFunctionResult.name, () => {
    it('falls back to raw felts for unknown types', () => {
      const result = decodeFunctionResult(
        ['0x1', '0x2'],
        [{ type: 'some::unknown::Type' }],
        EMPTY_ABI,
      )
      expect(result).toEqual({ $rawFelts: ['0x1', '0x2'] })
    })

    it('falls back to raw felts on trailing data', () => {
      const result = decodeFunctionResult(
        ['0x1', '0x2'],
        [{ type: 'core::felt252' }],
        EMPTY_ABI,
      )
      expect(result).toEqual({ $rawFelts: ['0x1', '0x2'] })
    })
  })

  describe(parseGenericType.name, () => {
    it('parses nested generics', () => {
      expect(
        parseGenericType('core::array::Span::<demo::Thing::<core::felt252>>'),
      ).toEqual({
        base: 'core::array::Span',
        args: ['demo::Thing::<core::felt252>'],
      })
    })

    it('returns undefined for plain types', () => {
      expect(parseGenericType('core::felt252')).toEqual(undefined)
    })
  })
})

describe('sierraAbi (strk20 pool fixture)', () => {
  const raw = readFileSync(
    path.join(__dirname, 'fixtures', 'strk20PoolAbi.json'),
    'utf8',
  )
  const abi = parseSierraAbi(raw)

  it('parses interface functions', () => {
    expect(hasFunction(abi, 'get_fee_collector')).toEqual(true)
    expect(hasFunction(abi, 'replace_to')).toEqual(true)
    expect(hasFunction(abi, 'get_upgrade_delay')).toEqual(true)
  })

  it('classifies view functions', () => {
    const views = getViewFunctions(abi).map((f) => f.name)
    expect(views.includes('get_fee_collector')).toEqual(true)
    expect(views.includes('is_paused')).toEqual(true)
    expect(views.includes('pause')).toEqual(false)
  })

  it('indexes structs and enums', () => {
    expect(abi.structs.has('privacy::objects::Note')).toEqual(true)
    expect(abi.enums.has('core::bool')).toEqual(true)
  })

  it('decodes a real get_fee_collector result', () => {
    const fn = abi.functions.find((f) => f.name === 'get_fee_collector')
    expect(fn).not.toEqual(undefined)
    const decoded = decodeFunctionResult(
      ['0xd79041634625e5288296fbc648088788710ba44903a3a49468a66567749e77'],
      fn?.outputs ?? [],
      abi,
    )
    expect(decoded).toEqual(
      'strk:0x00d79041634625e5288296fbc648088788710ba44903a3a49468a66567749e77',
    )
  })

  it('computes known selectors', () => {
    // sn_keccak('get_fee_collector'), verified against live starknet_call
    expect(starknetSelector('get_fee_collector')).toEqual(
      '0x1851214e009d1e1c4cceab374566e1346d7f852de08ab6141991952887ab182',
    )
  })
})
