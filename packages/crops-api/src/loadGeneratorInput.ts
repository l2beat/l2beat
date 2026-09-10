import { ProjectService } from '@l2beat/config'
import { execSync } from 'child_process'
import { resolve } from 'path'
import { getAttestationsMeta } from './garden/getAttestationsMeta'
import type { ChainLookup, GeneratorInput } from './generateCropsSite'

// Built by `pnpm build:dependencies`, like the frontend's ProjectService.
const DB_PATH = resolve(__dirname, '../../config/build/db.sqlite')

export async function loadGeneratorInput(): Promise<GeneratorInput> {
  const ps = new ProjectService(DB_PATH)
  const [projects, chains] = await Promise.all([
    ps.getProjects({
      where: ['crops'],
      select: ['crops'],
      optional: ['contracts', 'permissions', 'scalingInfo', 'privacyInfo'],
    }),
    loadChains(ps),
  ])
  return {
    projects,
    chains,
    ledger: getAttestationsMeta(),
    commit: getCommit(),
    generatedAt: Math.floor(Date.now() / 1000),
  }
}

async function loadChains(ps: ProjectService): Promise<ChainLookup> {
  const projects = await ps.getProjects({ select: ['chainConfig'] })
  const chains: ChainLookup = {}
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
