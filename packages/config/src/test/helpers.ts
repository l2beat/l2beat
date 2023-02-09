import { expect } from 'earljs'

import { ProjectRisk } from '../'

export function checkRisk(risk: ProjectRisk, name: string) {
  it(`${name} is correctly formatted`, () => {
    if (!risk._ignoreTextFormatting) {
      expect(risk.text).toEqual(expect.stringMatching(/^[a-z].*\.$/))
    }
  })
}
