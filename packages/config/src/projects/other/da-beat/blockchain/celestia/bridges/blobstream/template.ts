import { assert } from '@l2beat/backend-tools'
import capitalize from 'lodash/capitalize'
import { chains } from '../../../../../../../'
import {
  DaAccessibilityRisk,
  DaBridgeRisks,
  OnChainDaBridge,
} from '../../../../types'
import { DaDisplayLinks } from '../../../../types/DaDisplayLinks'

type TemplateRisks = Omit<DaBridgeRisks, 'accessibility'>

type TemplateVars = Pick<
  OnChainDaBridge,
  'chain' | 'contracts' | 'permissions' | 'usedIn' | 'technology'
> & {
  risks: TemplateRisks
  display: {
    links: DaDisplayLinks
  }
}

export function CELESTIA_BLOBSTREAM(base: TemplateVars): OnChainDaBridge {
  const chain = chains.find((chain) => chain.name === base.chain)

  assert(
    chain,
    `Cannot template CELESTIA_BLOBSTREAM - chain ${base.chain} not found among known chains`,
  )

  const id = `blobstream-${chain.name}`
  const display = {
    name: `Blobstream on ${capitalize(chain.name)}`,
    slug: id,
    description: `Celestia with Blobstream bridge on ${capitalize(
      chain.name,
    )}.`,
    links: base.display.links,
  }

  const validation = {
    type: 'zk-proof',
    relayer: 'SuccinctGateway',
    proverSource: 'https://hackmd.io/@succinctlabs/HJE7XRrup',
  }

  const risks = {
    accessibility: DaAccessibilityRisk.NotEnshrined,
    ...base.risks,
  } satisfies DaBridgeRisks

  return {
    type: 'OnChainBridge',
    id,
    display,
    risks,
    chain: chain.name,
    validation: validation,
    contracts: base.contracts,
    technology: base.technology,
    permissions: base.permissions,
    usedIn: base.usedIn,
  }
}
