import { getTokenBySymbol, Project, ProjectCategory, TokenInfo, tokenList } from '@l2beat/config'

export interface ProjectInfo {
  name: string
  bridges: BridgeInfo[],
  technology: ProjectCategory,
}

export interface BridgeInfo {
  address: string
  sinceBlock: number
  tokens: TokenInfo[]
}

export function projectToInfo(project: Project): ProjectInfo {
  return {
    name: project.name,
    bridges: project.bridges.map((bridge) => ({
      address: bridge.address,
      sinceBlock: bridge.sinceBlock,
      tokens:
        bridge.tokens === '*' ? tokenList : bridge.tokens.map(getTokenBySymbol),
    })),
    technology: project.details.technology.category.name,
  }
}
