import { ProjectInfo } from '../../../../model'

export function getTokens(projects: ProjectInfo[], blockNumber: number) {
  const tokens = new Set<string>()
  for (const project of projects) {
    for (const bridge of project.bridges) {
      if (bridge.sinceBlock > blockNumber) {
        continue
      }
      for (const token of bridge.tokens) {
        if (token.sinceBlock > blockNumber) {
          continue
        }
        if (token.address) {
          tokens.add(token.address)
        }
      }
    }
  }
  return [...tokens]
}
