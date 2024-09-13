import { assert, AmountConfigEntry, AssetId, Token } from '@l2beat/shared-pure'
import { chainConverter, chainToProject } from '../backend'
import { BackendProject } from '../backend/BackendProject'
import { chains } from '../chains'
import { ethereum } from '../chains/ethereum'
import { tokenList } from '../tokens'
import { getAggLayerL2TokenEntry } from './amounts/aggLayerL2Tokens'
import { getAggLayerNativeEtherPremintedEntry } from './amounts/aggLayerNativeEtherPreminted'
import { getAggLayerNativeEtherWrappedEntry } from './amounts/aggLayerNativeEtherWrapped'
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
      if (escrow.sharedEscrow?.type === 'AggLayer') {
        for (const token of escrow.tokens) {
          if (token.address === undefined) {
            continue
          }
          const chain = chains.find((x) => x.chainId === +token.chainId)
          assert(chain, `Chain not found for token ${token.id}`)
          assert(
            chain.name === escrow.chain,
            'Programmer error: chain mismatch',
          )

          const configEntry = getAggLayerL2TokenEntry(
            chain,
            token,
            escrow,
            project,
          )

          entries.push(configEntry)
        }
        if (escrow.sharedEscrow.nativeAsset === 'etherPreminted') {
          const chain = chains.find((x) => x.name === project.projectId)
          assert(chain, `Chain not found for project ${project.projectId}`)
          assert(
            chain.minTimestampForTvl,
            'Chain should have minTimestampForTvl',
          )

          const configEntry = getAggLayerNativeEtherPremintedEntry(
            chain,
            escrow,
            project,
          )

          entries.push(configEntry)
        }
        if (escrow.sharedEscrow.nativeAsset === 'etherWrapped') {
          const chain = chains.find((x) => x.name === project.projectId)
          assert(chain, `Chain not found for project ${project.projectId}`)
          assert(
            chain.minTimestampForTvl,
            'Chain should have minTimestampForTvl',
          )
          const l1Weth = tokenList.find(
            (t) => AssetId.create(ethereum.name, t.address) === AssetId.WETH,
          )
          assert(l1Weth, 'Ethereum WETH token not found')

          const configEntry = getAggLayerNativeEtherWrappedEntry(
            chain,
            l1Weth,
            escrow,
            project,
          )

          entries.push(configEntry)
        }
      } else {
        for (const token of escrow.tokens) {
          const chain = chains.find((x) => x.chainId === +token.chainId)
          assert(chain, `Chain not found for token ${token.id}`)
          assert(
            chain.name === escrow.chain,
            'Programmer error: chain mismatch',
          )

          const configEntry = token.isPreminted
            ? getPremintedEntry(chain, token, escrow, project)
            : getEscrowEntry(chain, token, escrow, project)

          entries.push(configEntry)
        }
      }
    }
  }

  const projectsWithOKBConfig = projects.filter((p) =>
    p.escrows.some((e) => e.sharedEscrow?.includeAllOKBFromL1),
  )

  if (projectsWithOKBConfig.length > 0) {
    return handleOKBentries(projectsWithOKBConfig, entries)
  }

  return entries
}

function handleOKBentries(
  projectWithOKBConfig: BackendProject[],
  entries: AmountConfigEntry[],
) {
  assert(projectWithOKBConfig.length === 1)
  const okbToken = tokenList.find(
    (t) =>
      AssetId.create(chainConverter.toName(t.chainId), t.address) ===
      AssetId.OKB,
  )
  assert(okbToken)

  const escrow = projectWithOKBConfig[0].escrows.find(
    (e) => e.sharedEscrow?.includeAllOKBFromL1,
  )
  assert(escrow)

  const l1OKBEntry = getEscrowEntry(
    ethereum,
    okbToken,
    escrow,
    projectWithOKBConfig[0],
  )

  entries.push(l1OKBEntry)

  return entries.filter(
    (e) => e.type !== 'aggLayerL2Token' || e.assetId !== AssetId.OKB,
  )
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
