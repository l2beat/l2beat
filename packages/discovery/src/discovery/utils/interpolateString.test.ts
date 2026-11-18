import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { StructureEntry } from '../output/types'
import { interpolateString } from './interpolateString'

describe(interpolateString.name, () => {
  const address = ChainSpecificAddress(
    'eth:0x1234567890123456789012345678901234567890',
  )

  it('should correctly interpolate variables in the description', () => {
    const description =
      'Contract with address {{ $.address }} and value {{ someValue }}'
    const structure: StructureEntry = {
      type: 'Contract',
      address,
      values: { someValue: 42 },
    }

    const result = interpolateString(description, structure)

    expect(result).toEqual(
      'Contract with address eth:0x1234567890123456789012345678901234567890 and value 42',
    )
  })

  it('should throw an error if a variable is not found in the structure', () => {
    const description = 'Contract with missing {{ missingValue }}'
    const structure: StructureEntry = {
      type: 'Contract',
      address,
      values: { numberField: 1122 },
    }

    expect(() => interpolateString(description, structure)).toThrow(
      'Value for variable "{{ missingValue }}" in contract field not found in contract analysis',
    )
  })
})
