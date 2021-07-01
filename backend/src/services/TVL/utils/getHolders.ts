import { ProjectInfo } from '../../../model'

export function getHolders(projects: ProjectInfo[], blockNumber: number) {
  const tokenHolders: Record<string, string[]> = {}
  const ethHolders: string[] = []
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
          const array = tokenHolders[token.address] ?? []
          tokenHolders[token.address] = array
          array.push(bridge.address)
        } else {
          ethHolders.push(bridge.address)
        }
      }
    }
  }
  return { tokenHolders, ethHolders }
}
