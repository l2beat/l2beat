import { expect } from 'earl'
import type { ProjectRisk } from '../types'

export function checkRisk(risk: ProjectRisk, name: string) {
  it(`${name} is correctly formatted`, () => {
    if (!risk._ignoreTextFormatting) {
      expect(risk.text).toMatchRegex(/^[a-z].*\.$/)
    }
  })
}
