import { assert } from '@l2beat/backend-tools'
import { capitalize } from 'lodash'
import { chains } from '../../../../../../../'
import {
  DaAccessibilityRisk,
  DaBridgeKind,
  DaBridgeRisks,
  OnChainDaBridge,
} from '../../../../types'

type TemplateRisks = Omit<DaBridgeRisks, 'accessibility'>

type TemplateVars = Pick<
  OnChainDaBridge,
  'chain' | 'contracts' | 'permissions' | 'usedIn'
> & {
  risks: TemplateRisks
}

export function CELESTIA_BLOBSTREAM(base: TemplateVars): OnChainDaBridge {
  const chain = chains.find((chain) => chain.name === base.chain)

  assert(
    chain,
    `Cannot template CELESTIA_BLOBSTREAM - chain ${base.chain} not found among known chains`,
  )

  const id = `blobstream-${chain.name}`
  const display = {
    name: 'Blobstream',
    slug: id,
    description: `Celestia with Blobstream bridge on ${capitalize(chain.name)}`,
  }

  const validation = {
    type: 'zk-proof',
    relayer: 'SuccinctGateway',
    proverSource: 'https://hackmd.io/@succinctlabs/HJE7XRrup'
  }

  const risks = {
    accessibility: DaAccessibilityRisk.NotEnshrined,
    ...base.risks,
  } satisfies DaBridgeRisks

  return {
    kind: DaBridgeKind.OnChainBridge,
    id,
    display,
    risks,
    chain: chain.name,
    validation: validation,
    contracts: base.contracts,
    permissions: base.permissions,
    usedIn: base.usedIn,
  }
}
