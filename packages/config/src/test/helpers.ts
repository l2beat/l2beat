import { expect } from 'earl'
import type { ScalingProjectRisk } from '../types'

export function checkRisk(risk: ScalingProjectRisk, name: string) {
  it(`${name} is correctly formatted`, () => {
    if (!risk._ignoreTextFormatting) {
      expect(risk.text).toMatchRegex(/^[a-z].*\.$/)
    }
  })
}
