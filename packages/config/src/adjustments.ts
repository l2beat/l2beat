import { assert } from '@l2beat/shared-pure'
import { bridges } from './projects/bridges'
import { layer2s } from './projects/layer2s'
import { layer3s } from './projects/layer3s'
import { refactored } from './projects/refactored'
import type { BaseProject, Bridge, ChainConfig, Layer2, Layer3 } from './types'
import { isProjectVerified } from './verification/isVerified'

/**
 * Some things can only be computed once all projects have been configured.
 * You can think of this function as the stage-3 of config generation with:
 * - discovery being stage-1
 * - project.ts files being stage-2
 * - runConfigAdjustments being stage-3
 *
 * When you import from config everything has already been through this
 * process.
 */
export function runConfigAdjustments() {
  const chains = [...layer2s, ...layer3s, ...bridges, ...refactored]
    .map((x) => x.chainConfig)
    .filter((x) => x !== undefined)

  layer2s.forEach((p) => adjustEscrows(p, chains))
  layer3s.forEach((p) => adjustEscrows(p, chains))
  bridges.forEach((p) => adjustEscrows(p, chains))
  refactored.forEach((p) => adjustRefactored(p, chains))
}

function adjustEscrows(
  project: Layer2 | Layer3 | Bridge,
  chains: ChainConfig[],
) {
  for (const escrow of project.config.escrows) {
    const chain = chains.find((x) => x.name === escrow.chain)
    assert(chain, `Missing chain: ${escrow.chain}`)
    escrow.chainId = chain?.chainId
  }
}

function adjustRefactored(project: BaseProject, chains: ChainConfig[]) {
  if (project.statuses) {
    project.statuses.isUnverified ||= !isProjectVerified(project)
  }
  if (project.proofVerification) {
    for (const verifier of project.proofVerification.verifiers) {
      const chain = chains.find((x) => x.chainId === verifier.chainId)
      assert(chain?.explorerUrl, `Missing explorerUrl for: ${verifier.chainId}`)
      verifier.url = `${chain.explorerUrl}/address/${verifier.contractAddress}#code`
    }
  }
}
