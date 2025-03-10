import { assert } from '@l2beat/shared-pure'
import { CONTRACTS } from './common'
import type { Bridge, ScalingProject } from './internalTypes'
import { BADGES, badgesCompareFn } from './projects/badges'
import { bridges } from './projects/bridges'
import { layer2s } from './projects/layer2s'
import { layer3s } from './projects/layer3s'
import { getDiscoveryInfo } from './projects/project/getProjects'
import { refactored } from './projects/refactored'
import { mergeBadges } from './templates/utils'
import type { BaseProject, ChainConfig } from './types'
import { isProjectVerified, isVerified } from './verification/isVerified'

let once = false

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
  if (once) return
  once = true

  const chains = [...layer2s, ...layer3s, ...bridges, ...refactored]
    .map((x) => x.chainConfig)
    .filter((x) => x !== undefined)

  layer2s.forEach((p) => {
    adjustLegacy(p, chains)
    adjustBadges(p, layer3s)
  })
  layer3s.forEach((p) => adjustLegacy(p, chains))
  bridges.forEach((p) => adjustLegacy(p, chains))
  refactored.forEach((p) => adjustRefactored(p, chains))
}

function adjustLegacy(project: ScalingProject | Bridge, chains: ChainConfig[]) {
  for (const escrow of project.config.escrows) {
    const chain = chains.find((x) => x.name === escrow.chain)
    assert(chain, `Missing chain: ${escrow.chain}`)
    escrow.chainId = chain?.chainId
    if (escrow.contract) {
      escrow.contract.url = `${chain.explorerUrl}/address/${escrow.address}#code`
    }
  }
  if (project.type !== 'bridge') {
    project.badges?.sort(badgesCompareFn)
    if (project.badges?.length === 0) {
      project.badges = undefined
    }
  }
  adjustContracts(project, chains)
  adjustEscrows(project)

  project.discoveryInfo = getDiscoveryInfo(project)
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
  adjustContracts(project, chains)
}

function adjustContracts(
  project: ScalingProject | Bridge | BaseProject,
  chains: ChainConfig[],
) {
  if (project.contracts) {
    for (const chainName in project.contracts.addresses) {
      for (const contract of project.contracts.addresses[chainName]) {
        const chain = chains.find((x) => x.name === contract.chain)
        assert(chain, `Missing chain: ${contract.chain}`)
        assert(chain.explorerUrl, `Missing explorer url: ${chain.name}`)
        contract.url = `${chain.explorerUrl}/address/${contract.address}#code`
      }
    }
    const verified =
      'type' in project ? isVerified(project) : isProjectVerified(project)
    if (!verified) {
      project.contracts.risks.push(CONTRACTS.UNVERIFIED_RISK)
    }
  }
}

function adjustBadges(project: ScalingProject, l3s: ScalingProject[]) {
  const hostsL3 = l3s.some((l3) => l3.hostChain === project.id)
  if (hostsL3) {
    project.badges = mergeBadges(project.badges ?? [], [
      BADGES.Other.L3HostChain,
    ])
  }
}

function adjustEscrows(project: ScalingProject | Bridge) {
  if (project.contracts) {
    project.contracts.escrows = project.config.escrows
  }
}
