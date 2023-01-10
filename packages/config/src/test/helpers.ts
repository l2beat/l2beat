import { expect } from 'earljs'
import { utils } from 'ethers'

import { ProjectRisk } from '../'

export function checkRisk(risk: ProjectRisk, name: string) {
  it(`${name} is correctly formatted`, () => {
    if (!risk._ignoreTextFormatting) {
      expect(risk.text).toEqual(expect.stringMatching(/^[a-z].*\.$/))
    }
  })
}

export function testAddress(address: string) {
  it(address, () => {
    expect(utils.getAddress(address)).toEqual(address)
  })
}
