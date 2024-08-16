import { assert } from '@l2beat/backend-tools'
import capitalize from 'lodash/capitalize'
import { chains } from '../../../../../../../'
import {
  DaAccessibilityRisk,
  DaBridgeRisks,
  OnChainDaBridge,
} from '../../../../types'
import { DaLinks } from '../../../../types/DaLinks'

type TemplateRisks = Omit<DaBridgeRisks, 'accessibility'>

type TemplateVars = Pick<
  OnChainDaBridge,
  'chain' | 'contracts' | 'permissions' | 'usedIn' | 'technology'
> & {
  risks: TemplateRisks
  display: {
    links: DaLinks
  }
}

export function CELESTIA_BLOBSTREAM(base: TemplateVars): OnChainDaBridge {
  const chain = chains.find((chain) => chain.name === base.chain)

  assert(
    chain,
    `Cannot template CELESTIA_BLOBSTREAM - chain ${base.chain} not found among known chains`,
  )

  const id = `blobstreamx-${chain.name}`
  const display = {
    name: `Blobstream X on ${capitalize(chain.name)}`,
    slug: id,
    description: `The BlobstreamX bridge serves as a ZK light client, enabling the bridging of data availability commitments between Celestia and ${capitalize(
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
