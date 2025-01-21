import { assert } from '@l2beat/shared-pure'
import capitalize from 'lodash/capitalize'
import { chains } from '../../../../../../chains'
import type { OnChainDaBridge } from '../../../../types'
import type { DaLinks } from '../../../../types/DaLinks'

type TemplateVars = Pick<
  OnChainDaBridge,
  | 'createdAt'
  | 'chain'
  | 'contracts'
  | 'permissions'
  | 'usedIn'
  | 'technology'
  | 'risks'
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

  const id = `blobstream`
  const display = {
    name: `Blobstream`,
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
    createdAt: base.createdAt,
    display,
    risks: base.risks,
    chain: chain.name,
    validation: validation,
    contracts: base.contracts,
    technology: base.technology,
    permissions: base.permissions,
    usedIn: base.usedIn,
  }
}
