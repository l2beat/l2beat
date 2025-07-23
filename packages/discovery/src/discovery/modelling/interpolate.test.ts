import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { EntryParameters } from '../output/types'
import {
  contractValuesForInterpolation,
  interpolateModelTemplate,
  normalizeId,
  tryCastingToName,
} from './interpolate'

describe(normalizeId.name, () => {
  it('properly normalizes ids', () => {
    expect(normalizeId('ContractA')).toEqual('contractA')
    expect(normalizeId('tEST.eth-L2BEAT')).toEqual('tEST_eth_L2BEAT')
    expect(normalizeId('One.two&Three')).toEqual('one_two_Three')
  })
})

describe(tryCastingToName.name, () => {
  it('properly converts addresses to names', () => {
    const addressToNameMap = {
      '0x123': 'ContractA',
      '0x456': 'ContractB',
    }
    expect(tryCastingToName('0x123', addressToNameMap, false)).toEqual(
      'contractA',
    )
    expect(tryCastingToName('0x456', addressToNameMap, false)).toEqual(
      'contractB',
    )
    expect(tryCastingToName('0xlalala', addressToNameMap, false)).toEqual(
      '0xlalala',
    )
    expect(tryCastingToName('A&B', addressToNameMap, false)).toEqual('A&B')
  })
})

describe(interpolateModelTemplate.name, () => {
  it('properly interpolates the model file', () => {
    const modelTemplate = `
      msig(@self, &$threshold).
      member(@self,
        &$members
      ).
      myAddr(&$.address, "&$.address:raw").
      myName("&$.name").
      myDescription("&$.description").
      shouldCastToNil(&fieldThatDoesNotExist|orNil).
      shouldQuote(&$.name|quote).
    `
    const contract: EntryParameters = {
      type: 'Contract',
      address: ChainSpecificAddress.from('eth', EthereumAddress.from('0x123')),
      name: 'ContactMsigA',
      description: 'Description of ContactMsigA',
      values: {
        $threshold: 2,
        $members: [
          ChainSpecificAddress.from(
            'eth',
            EthereumAddress.from('0x456'),
          ).toString(),
          ChainSpecificAddress.from(
            'eth',
            EthereumAddress.from('0x789'),
          ).toString(),
          ChainSpecificAddress.from(
            'eth',
            EthereumAddress.from('0xabc'),
          ).toString(),
        ],
      },
    }

    const addressToNameMap = {
      [ChainSpecificAddress.from(
        'eth',
        EthereumAddress.from('0x123'),
      ).toString()]: 'ContactMsigA',
      [ChainSpecificAddress.from(
        'eth',
        EthereumAddress.from('0x456'),
      ).toString()]: 'MemberA',
      [ChainSpecificAddress.from(
        'eth',
        EthereumAddress.from('0x789'),
      ).toString()]: 'MemberB',
    }

    const values = contractValuesForInterpolation('ethereum', contract)
    const result = interpolateModelTemplate(
      modelTemplate,
      values,
      addressToNameMap,
    )
    expect(result).toEqual(`
      msig(contactMsigA, 2).
      member(contactMsigA,
        (memberA; memberB; "eth:0x0000000000000000000000000000000000000abc")
      ).
      myAddr(contactMsigA, "eth:0x0000000000000000000000000000000000000123").
      myName("ContactMsigA").
      myDescription("Description of ContactMsigA").
      shouldCastToNil(nil).
      shouldQuote("ContactMsigA").
    `)
  })

  it('properly casts to lowercase', () => {
    const modelTemplate = `msg1("&msg|lower").msg2("&msg:raw|lower").`
    const contract: EntryParameters = {
      type: 'Contract',
      address: ChainSpecificAddress.from('eth', EthereumAddress.from('0x123')),
      name: 'ContractA',
      description: 'Description of ContractA',
      values: {
        msg: 'Hello, WORLD!',
      },
    }

    const values = contractValuesForInterpolation('ethereum', contract)
    const result = interpolateModelTemplate(modelTemplate, values, {})
    expect(result).toEqual('msg1("hello, world!").msg2("hello, world!").')
  })

  it('fails for missing values', () => {
    const modelTemplate = `
      one(&one).
      two(&two).
    `
    const contract: EntryParameters = {
      type: 'Contract',
      address: ChainSpecificAddress.from('eth', EthereumAddress.from('0x123')),
      name: 'ContactMsigA',
      description: 'Description of ContactMsigA',
      values: {
        one: 1,
      },
    }

    const values = contractValuesForInterpolation('ethereum', contract)
    expect(() => interpolateModelTemplate(modelTemplate, values, {})).toThrow(
      'Field "two" not found in contract ContactMsigA',
    )
  })
})

describe(contractValuesForInterpolation.name, () => {
  it('properly prepares values for interpolation', () => {
    const contract: EntryParameters = {
      type: 'Contract',
      address: ChainSpecificAddress.from(
        'eth',
        EthereumAddress('0x00000000000000000000000000000000DeaDBeef'),
      ),
      name: 'ContractA',
      description: 'Description of ContractA',
      values: {
        one: 1,
        two: 2,
      },
    }

    const values = contractValuesForInterpolation('ethereum', contract)
    expect(values).toEqual({
      '$.chain': 'ethereum',
      '$.address': 'eth:0x00000000000000000000000000000000deadbeef',
      '$.name': 'ContractA',
      '$.description': 'Description of ContractA',
      one: 1,
      two: 2,
    })
  })
})
