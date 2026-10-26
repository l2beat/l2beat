import { ProjectService } from '@l2beat/config'
import { execSync } from 'child_process'
import type { ChainIdByName, CropsApiInput } from './generateCropsApiFiles'
import { readAttestationsMeta } from './readAttestationsMeta'

export async function loadGeneratorInput(): Promise<CropsApiInput> {
  const projectService = new ProjectService()
  const [projects, chains] = await Promise.all([
    projectService.getProjects({
      where: ['crops'],
      select: ['crops'],
      optional: ['contracts', 'permissions', 'scalingInfo', 'privacyInfo'],
    }),
    loadChains(projectService),
  ])
  return {
    projects,
    chains,
    attestations: await readAttestationsMeta(
      process.env.CROPS_ATTESTATIONS_RPC_URL,
    ),
    commit: getCommit(),
    generatedAt: Math.floor(Date.now() / 1000),
  }
}

async function loadChains(
  projectService: ProjectService,
): Promise<ChainIdByName> {
  const projects = await projectService.getProjects({
    select: ['chainConfig'],
  })
  const chains: ChainIdByName = {}
  for (const { chainConfig } of projects) {
    if (chainConfig.chainId !== undefined) {
      chains[chainConfig.name] = chainConfig.chainId
    }
  }
  return chains
}

/** CI passes the SHA it checked out; locally it is whatever HEAD is. */
function getCommit(): string {
  return (
    process.env.GITHUB_SHA ??
    execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
  )
}
