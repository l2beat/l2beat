import type { ContractParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
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
    const modelFile = `
      msig(@self, #$threshold).
      member(@self, 
        #$members
      ).
      myAddr(#$.address, "#$.address:raw").
      myName("#$.name").
      myDescription("#$.description")
    `
    const contract: ContractParameters = {
      address: EthereumAddress.from('0x123'),
      name: 'ContactMsigA',
      description: 'Description of ContactMsigA',
      values: {
        $threshold: 2,
        $members: [
          EthereumAddress.from('0x456').toString(),
          EthereumAddress.from('0x789').toString(),
          EthereumAddress.from('0xabc').toString(),
        ],
      },
    }

    const addressToNameMap = {
      [EthereumAddress.from('0x123').toString()]: 'ContactMsigA',
      [EthereumAddress.from('0x456').toString()]: 'MemberA',
      [EthereumAddress.from('0x789').toString()]: 'MemberB',
    }

    const values = contractValuesForInterpolation(contract)
    const result = interpolateModelTemplate(modelFile, values, addressToNameMap)
    expect(result).toEqual(`
      msig(contactMsigA, 2).
      member(contactMsigA, 
        (memberA; memberB; 0x0000000000000000000000000000000000000aBc)
      ).
      myAddr(contactMsigA, "0x0000000000000000000000000000000000000123").
      myName("ContactMsigA").
      myDescription("Description of ContactMsigA")
    `)
  })

  it('fails for missing values', () => {
    const modelFile = `
      one(#one).
      two(#two).
    `
    const contract: ContractParameters = {
      address: EthereumAddress.from('0x123'),
      name: 'ContactMsigA',
      description: 'Description of ContactMsigA',
      values: {
        one: 1,
      },
    }

    const values = contractValuesForInterpolation(contract)
    expect(() => interpolateModelTemplate(modelFile, values, {})).toThrow(
      'Field "two" not found in contract ContactMsigA',
    )
  })
})

describe(contractValuesForInterpolation.name, () => {
  it('properly prepares values for interpolation', () => {
    const contract: ContractParameters = {
      address: EthereumAddress('0x00000000000000000000000000000000DeaDBeef'),
      name: 'ContractA',
      description: 'Description of ContractA',
      values: {
        one: 1,
        two: 2,
      },
    }
    console.log(contract)

    const values = contractValuesForInterpolation(contract)
    expect(values).toEqual({
      '$.address': '0x00000000000000000000000000000000deadbeef',
      '$.name': 'ContractA',
      '$.description': 'Description of ContractA',
      one: 1,
      two: 2,
    })
  })
})
