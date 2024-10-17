import { assert } from '@l2beat/shared-pure'
import capitalize from 'lodash/capitalize'
import { chains } from '../../../../../../..'
import { OnChainDaBridge } from '../../../../types'
import { DaLinks } from '../../../../types/DaLinks'

type TemplateVars = Pick<
  OnChainDaBridge,
  'chain' | 'contracts' | 'permissions' | 'nativePermissions' | 'usedIn' | 'technology' | 'risks'
> & {
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

  const id = `blobstream-${chain.name}`
  const display = {
    name: `Blobstream on ${capitalize(chain.name)}`,
    slug: id,
    description: `The Blobstream bridge serves as a ZK light client, enabling the bridging of data availability commitments between Celestia and ${capitalize(
      chain.name,
    )}.`,
    links: base.display.links,
  }

  const validation = {
    type: 'zk-proof',
    relayer: 'SuccinctGateway',
    proverSource: 'https://hackmd.io/@succinctlabs/HJE7XRrup',
  }

  return {
    type: 'OnChainBridge',
    id,
    display,
    risks: base.risks,
    chain: chain.name,
    validation: validation,
    contracts: base.contracts,
    technology: base.technology,
    permissions: base.permissions,
    nativePermissions: base.nativePermissions,
    usedIn: base.usedIn,
  }
}
