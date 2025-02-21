import type { ContractParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  interpolateModelFile,
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
    expect(tryCastingToName('0x123', addressToNameMap)).toEqual('contractA')
    expect(tryCastingToName('0x456', addressToNameMap)).toEqual('contractB')
    expect(tryCastingToName('0xlalala', addressToNameMap)).toEqual('0xlalala')
    expect(tryCastingToName('A&B', addressToNameMap)).toEqual('A&B')
  })
})

describe(interpolateModelFile.name, () => {
  it('properly interpolates the model file', () => {
    const modelFile = `
      msig(@self, #$threshold).
      member(@self, 
        #$members
      ).
    `
    const contract: ContractParameters = {
      address: EthereumAddress.from('0x123'),
      name: 'ContactMsigA',
      values: {
        $threshold: 2,
        $members: [
          EthereumAddress.from('0x456').toString(),
          EthereumAddress.from('0x789').toString(),
          EthereumAddress.from('0xabc').toString(),
        ],
      },
    }
    console.log(contract)

    const addressToNameMap = {
      [EthereumAddress.from('0x123').toString()]: 'ContactMsigA',
      [EthereumAddress.from('0x456').toString()]: 'MemberA',
      [EthereumAddress.from('0x789').toString()]: 'MemberB',
    }

    const result = interpolateModelFile(modelFile, contract, addressToNameMap)
    expect(result).toEqual(`
      msig(contactMsigA, 2).
      member(contactMsigA, 
        (memberA; memberB; 0x0000000000000000000000000000000000000aBc)
      ).
    `)
  })
})
