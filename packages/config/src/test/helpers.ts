import type { ProjectRisk } from '../types'

export function isRiskCorrectlyFormatted(risk: ProjectRisk): boolean {
  return risk._ignoreTextFormatting === true || /^[a-z].*\.$/.test(risk.text)
}
