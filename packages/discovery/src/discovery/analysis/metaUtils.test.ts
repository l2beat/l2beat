import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ContractValue } from '../output/types'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import type { AnalyzedContract, ExtendedTemplate } from './AddressAnalyzer'
import { interpolateString } from './metaUtils'

describe('metaUtils', () => {
  describe('interpolateDescription', () => {
    it('should correctly interpolate variables in the description', () => {
      const description =
        'Contract with address {{ $.address }} and value {{ someValue }}'
      const analysis = generateFakeAnalysis(
        ChainSpecificAddress('eth:0x1234567890123456789012345678901234567890'),
        undefined,
        undefined,
        {
          someValue: 42,
        },
      )

      const result = interpolateString(description, analysis)

      expect(result).toEqual(
        'Contract with address eth:0x1234567890123456789012345678901234567890 and value 42',
      )
    })

    it('should throw an error if a variable is not found in the analysis', () => {
      const description = 'Contract with missing {{ missingValue }}'
      const analysis = generateFakeAnalysis(
        ChainSpecificAddress('eth:0x1234567890123456789012345678901234567890'),
      )

      expect(() => interpolateString(description, analysis)).toThrow(
        'Value for variable "{{ missingValue }}" in contract field not found in contract analysis',
      )
    })
  })
})

const generateFakeAnalysis = (
  address: ChainSpecificAddress,
  extendedTemplate?: ExtendedTemplate,
  errors?: Record<string, string>,
  values?: Record<string, ContractValue | undefined>,
): AnalyzedContract => {
  return {
    ...EMPTY_ANALYZED_CONTRACT,
    address,
    name: `NameOf${address.toString()}`,
    isVerified: true,
    values: values ?? { numberField: 1122 },
    errors: errors ?? {},
    extendedTemplate,
  }
}
