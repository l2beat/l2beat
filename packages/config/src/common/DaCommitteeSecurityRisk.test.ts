import { expect } from 'earl'
import { probabilityOfCompromise } from './DaCommitteeSecurityRisk'

describe(probabilityOfCompromise.name, () => {
  it('increases with the number of people', () => {
    const p2of2 = probabilityOfCompromise(2, 2)
    const p2of3 = probabilityOfCompromise(2, 3)
    const p2of4 = probabilityOfCompromise(2, 4)

    expect(p2of2).toBeLessThan(p2of3)
    expect(p2of3).toBeLessThan(p2of4)
  })
})
