import { assert, AmountConfigEntry } from '@l2beat/shared-pure'
import { BackendProject } from '../../../backend'
import { ethereum } from '../../../chains/ethereum'
import { getEscrowEntry } from '../escrow'

export function addSharedEscrowsL1Tokens(
  projects: BackendProject[],
  entries: AmountConfigEntry[],
): AmountConfigEntry[] {
  const projectsWithL1Tokens = projects.filter(projectHasL1Tokens)
  if (projectsWithL1Tokens.length === 0) {
    return entries
  }

  projectsWithL1Tokens.forEach((project) => {
    const escrow = findEscrowWithL1Tokens(project)
    assert(
      escrow && escrow.sharedEscrow?.tokensToAssignFromL1,
      `${project.projectId}: Escrow should be defined for project with L1 tokens`,
    )

    escrow.sharedEscrow.tokensToAssignFromL1.forEach((tokenSymbol) => {
      const token = escrow.tokens.find((t) => t.symbol === tokenSymbol)
      assert(token, `Token ${tokenSymbol} not found in escrow tokens`)
      entries.push(getEscrowEntry(ethereum, token, escrow, project))
    })
  })

  return entries
}

function projectHasL1Tokens(project: BackendProject): boolean {
  return project.escrows.some(escrowHasL1Tokens)
}

function escrowHasL1Tokens(escrow: BackendProject['escrows'][number]): boolean {
  const { sharedEscrow } = escrow
  return (
    ['AggLayer', 'ElasticChian'].includes(sharedEscrow?.type as string) &&
    (sharedEscrow?.tokensToAssignFromL1?.length ?? 0) > 0
  )
}

function findEscrowWithL1Tokens(project: BackendProject) {
  return project.escrows.find(escrowHasL1Tokens)
}
