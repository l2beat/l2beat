import { assert, AmountConfigEntry, Token } from '@l2beat/shared-pure'
import { chainConverter, chainToProject } from '../backend'
import { BackendProject } from '../backend/BackendProject'
import { chains } from '../chains'
import { tokenList } from '../tokens'
import { getCirculatingSupplyEntry } from './amounts/circulatingSupply'
import { getEscrowEntry } from './amounts/escrow'
import { getPremintedEntry } from './amounts/preminted'
import { getTotalSupplyEntry } from './amounts/totalSupply'

export function getTvlAmountsConfig(
  projects: BackendProject[],
): AmountConfigEntry[] {
  const tokenAmounts = tokenList
    .filter((token) => token.supply !== 'zero')
    .map((token) => {
      const projectAndChain = findProjectAndChain(token, projects)
      const { chain, project } = projectAndChain

      switch (token.supply) {
        case 'totalSupply':
          return getTotalSupplyEntry(chain, token, project)
        case 'circulatingSupply':
          return getCirculatingSupplyEntry(chain, token, project)
        case 'zero':
          throw new Error('Zero supply tokens should not have config entry')
      }
    })

  const entries: AmountConfigEntry[] = [...tokenAmounts]

  for (const project of projects) {
    for (const escrow of project.escrows) {
      for (const token of escrow.tokens) {
        const chain = chains.find((x) => x.chainId === +token.chainId)
        assert(chain, `Chain not found for token ${token.id}`)
        assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

        const configEntry = token.isPreminted
          ? getPremintedEntry(chain, token, escrow, project)
          : getEscrowEntry(chain, token, escrow, project)

        entries.push(configEntry)
      }
    }
  }

  return entries
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
