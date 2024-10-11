import { assert, AmountConfigEntry } from '@l2beat/shared-pure'
import { BackendProject } from '../../../backend'
import { ethereum } from '../../../chains/ethereum'
import { getEscrowEntry } from '../escrow'

export function handleL1Tokens(
  projectsWithL1Tokens: BackendProject[],
  entries: AmountConfigEntry[],
) {
  for (const project of projectsWithL1Tokens) {
    const escrow = project.escrows.find(
      (e) =>
        (e.sharedEscrow?.type === 'AggLayer' ||
          e.sharedEscrow?.type === 'ElasticChian') &&
        e.sharedEscrow?.tokensToAssignFromL1?.length &&
        e.sharedEscrow.tokensToAssignFromL1.length > 0,
    )
    assert(escrow)
    assert(escrow.sharedEscrow?.tokensToAssignFromL1)

    for (const tokenSymbol of escrow.sharedEscrow.tokensToAssignFromL1) {
      const token = escrow.tokens.find((t) => t.symbol === tokenSymbol)
      assert(token, `Token ${tokenSymbol} not found in escrow tokens`)

      const l1TokenEntry = getEscrowEntry(ethereum, token, escrow, project)

      entries.push(l1TokenEntry)
    }
  }

  return entries
}
