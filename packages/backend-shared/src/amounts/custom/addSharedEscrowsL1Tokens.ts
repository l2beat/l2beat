import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import { assert, type AmountConfigEntry, ChainId } from '@l2beat/shared-pure'
import { getEscrowEntry } from '../escrow'

export function addSharedEscrowsL1Tokens(
  projects: Project<'tvlConfig', 'chainConfig'>[],
  entries: AmountConfigEntry[],
  chains: ChainConfig[],
): AmountConfigEntry[] {
  const projectsWithL1Tokens = projects.filter(projectHasL1Tokens)
  if (projectsWithL1Tokens.length === 0) {
    return entries
  }

  const ethereum = chains.find((x) => x.chainId === ChainId.ETHEREUM)
  assert(ethereum !== undefined)

  projectsWithL1Tokens.forEach((project) => {
    const escrow = findEscrowWithL1Tokens(project)
    assert(
      escrow && escrow.sharedEscrow?.tokensToAssignFromL1,
      `${project.id}: Escrow should be defined for project with L1 tokens`,
    )

    escrow.sharedEscrow.tokensToAssignFromL1.forEach((tokenSymbol) => {
      const token = escrow.tokens.find((t) => t.symbol === tokenSymbol)
      assert(token, `Token ${tokenSymbol} not found in escrow tokens`)
      entries.push(getEscrowEntry(ethereum, token, escrow, project))
    })
  })

  return entries
}

function projectHasL1Tokens(
  project: Project<'tvlConfig', 'chainConfig'>,
): boolean {
  return project.tvlConfig.escrows.some(escrowHasL1Tokens)
}

function escrowHasL1Tokens(escrow: ProjectTvlEscrow): boolean {
  const { sharedEscrow } = escrow
  return (
    ['AggLayer', 'ElasticChain'].includes(sharedEscrow?.type as string) &&
    (sharedEscrow?.tokensToAssignFromL1?.length ?? 0) > 0
  )
}

function findEscrowWithL1Tokens(project: Project<'tvlConfig', 'chainConfig'>) {
  return project.tvlConfig.escrows.find(escrowHasL1Tokens)
}
