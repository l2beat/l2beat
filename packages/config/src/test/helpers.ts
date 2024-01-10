import { expect } from 'earl'

import { ScalingProjectRisk } from '../'

export function checkRisk(risk: ScalingProjectRisk, name: string) {
  it(`${name} is correctly formatted`, () => {
    if (!risk._ignoreTextFormatting) {
      expect(risk.text).toMatchRegex(/^[a-z].*\.$/)
    }
  })
}
