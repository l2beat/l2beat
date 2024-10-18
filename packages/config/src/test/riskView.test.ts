import { expect } from 'earl'
import { layer3s } from '../projects'
import { layer2s } from '../projects/layer2s'

describe('riskView', () => {
  it("L2s riskView didn't change", function () {
    expect(layer2s.map((l2) => l2.riskView)).toMatchSnapshot(this)
  })

  it("L3s riskView didn't change", function () {
    expect(layer3s.map((l3) => l3.riskView)).toMatchSnapshot(this)
  })

  it("L3s stackedRiskView didn't change", function () {
    expect(layer3s.map((l3) => l3.stackedRiskView)).toMatchSnapshot(this)
  })
})
