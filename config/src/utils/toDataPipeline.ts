import { Project } from '../projects'

export interface L2Data {
  bridges: {
    address: string
    deployed_at_block: number
    tokens: string[]
  }[]
}

export function toDataPipeline(projects: Project[]) {
  const l2s: Record<string, L2Data> = {}
  for (const project of projects) {
    const bridges = project.bridges.map((b) => ({
      address: b.address,
      deployed_at_block: b.sinceBlock,
      tokens: b.tokens,
    }))
    l2s[project.name] = { bridges }
  }
  return { l2s }
}
