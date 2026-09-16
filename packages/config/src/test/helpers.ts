import { expect, it } from 'vitest'
import type { ProjectRisk } from '../types'

export function checkRisk(risk: ProjectRisk, name: string) {
  it(`${name} is correctly formatted`, () => {
    if (!risk._ignoreTextFormatting) {
      expect(risk.text).toMatch(/^[a-z].*\.$/)
    }
  })
}
