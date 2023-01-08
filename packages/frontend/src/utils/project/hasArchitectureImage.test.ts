import { expect } from 'earljs'

import { hasArchitectureImage } from './hasArchitectureImage'

describe(hasArchitectureImage.name, () => {
  it('returns true for nova', () => {
    expect(hasArchitectureImage('nova')).toEqual(true)
  })
})
