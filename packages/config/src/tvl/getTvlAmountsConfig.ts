import {
  assert,
  AmountConfigEntry,
  ChainConverter,
  ChainId,
  Token,
} from '@l2beat/shared-pure'
import { chainToProject } from '../backend'
import { BackendProject, BackendProjectEscrow } from '../backend/BackendProject'
import { chains } from '../chains'
import { ChainConfig } from '../common'
import { tokenList } from '../tokens'
import { getCirculatingSupplyEntry } from './amounts/circulatingSupply'
import { getEscrowEntry } from './amounts/escrow'
import { getPremintedEntry } from './amounts/preminted'
import { getTotalSupplyEntry } from './amounts/totalSupply'

export function getTvlAmountsConfig(
  projects: BackendProject[],
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')
  for (const token of nonZeroSupplyTokens) {
    const projectAndChain = findProjectAndChain(token, projects)

    const { chain, project } = projectAndChain

    const configEntry = projectTokenToConfigEntry(chain, token, project)

    entries.push(configEntry)
  }

  for (const project of projects) {
    for (const escrow of project.escrows) {
      for (const token of escrow.tokens) {
        const chain = chains.find((x) => x.chainId === +token.chainId)
        assert(chain, `Chain not found for token ${token.id}`)
        assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

        const configEntry = projectEscrowToConfigEntry(
          chain,
          token,
          escrow,
          project,
        )

        entries.push(configEntry)
      }
    }
  }

  return entries
}

/** Lighter version of `getTvlAmountsConfig`, does not that much nor enforces full configuration compatibility  */
export function getTvlAmountsConfigForProject(
  project: BackendProject,
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')

  const projectTokens = nonZeroSupplyTokens.filter(
    (t) =>
      chainToProject.get(chainConverter.toName(t.chainId)) ===
      project.projectId,
  )

  for (const token of projectTokens) {
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.symbol}`)

    const configEntry = projectTokenToConfigEntry(chain, token, project)

    entries.push(configEntry)
  }

  for (const escrow of project.escrows) {
    for (const token of escrow.tokens) {
      const chain = chains.find((x) => x.chainId === +token.chainId)
      assert(chain, `Chain not found for token ${token.id}`)
      assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

      const configEntry = projectEscrowToConfigEntry(
        chain,
        token,
        escrow,
        project,
      )

      entries.push(configEntry)
    }
  }

  return entries
}

const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)

function projectTokenToConfigEntry(
  chain: ChainConfig,
  token: Token,
  project: BackendProject,
): AmountConfigEntry {
  if (token.supply === 'totalSupply') {
    assert(token.address, 'Token address is required for total supply')

    return getTotalSupplyEntry(chain, token, project)
  }

  if (token.supply === 'circulatingSupply') {
    return getCirculatingSupplyEntry(chain, token, project)
  }

  throw new Error('Invalid token supply type')
}

function projectEscrowToConfigEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AmountConfigEntry {
  if (token.isPreminted) {
    return getPremintedEntry(chain, token, escrow, project)
  }
  return getEscrowEntry(chain, token, escrow, project)
}

function findProjectAndChain(token: Token, projects: BackendProject[]) {
  const projectId = chainToProject.get(chainConverter.toName(token.chainId))
  assert(projectId, `Project is required for token ${token.symbol}`)

  const project = projects.find((x) => x.projectId === projectId)
  assert(project, `Project not found for token ${token.symbol}`)

  const chain = chains.find((x) => x.chainId === +token.chainId)

  assert(chain, `Chain not found for token ${token.symbol}`)

  return { chain, project }
}
