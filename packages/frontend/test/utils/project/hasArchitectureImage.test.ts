import { expect } from 'earljs'

import { hasArchitectureImage } from '../../../src/utils/project/hasArchitectureImage'

describe(hasArchitectureImage.name, () => {
  it('returns true for nova', () => {
    expect(hasArchitectureImage('nova')).toEqual(true)
  })
})
