import { expect } from 'earl'

import { getArchitectureImage } from './getArchitectureImage'

describe(getArchitectureImage.name, () => {
  it('returns path for optimism', () => {
    expect(getArchitectureImage('optimism')).toEqual(
      '/images/architecture/optimism.png',
    )
  })
  it('returns undefined for dupa', () => {
    expect(getArchitectureImage('dupa')).toEqual(undefined)
  })
})
