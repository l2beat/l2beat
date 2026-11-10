import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeSearchIndexProject,
  decodeSearchIndexToken,
} from '~/components/search-bar/searchIndex'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/layer2s/interop/consts'
import { ps } from '~/server/projects'
import { getLogger } from '../../utils/logger'
import {
  SEARCH_INDEX_PROJECT_KEYS,
  toSearchIndexProject,
  toSearchIndexToken,
} from './getSearchIndex'
import { getAbstractTokensByAddress } from './utils/getAbstractTokensByAddress'
import { toSearchBarProject } from './utils/toSearchBarProject'

/**
 * Projects and tokens with a contract at the address. Names are searched in
 * the browser, but contract addresses are too many to send there.
 */
export async function getSearchBarAddressEntries(search: string) {
  const address = EthereumAddress(search.trim())

  const [tokens, projects] = await Promise.all([
    getAbstractTokensByAddress(address),
    // Reading projects blocks the event loop, so it waits a turn to let the
    // token query reach the database first and overlap its round trip.
    new Promise(setImmediate).then(() =>
      ps.getProjects({
        optional: [...SEARCH_INDEX_PROJECT_KEYS, 'contracts', 'permissions'],
      }),
    ),
  ])

  // Tokens first: a bridge escrow lists the token contracts it holds, but
  // whoever pastes a token address is most likely looking for the token.
  const tokenMatches = tokens
    .filter((token) => token.id !== UNKNOWN_ABSTRACT_TOKEN_ID)
    .map((token) => decodeSearchIndexToken(toSearchIndexToken(token)))
  const projectMatches = projects
    .filter((project) =>
      extractProjectAddresses(project.contracts, project.permissions).includes(
        address,
      ),
    )
    .flatMap((project) => {
      const row = toSearchIndexProject(project)
      return row ? decodeSearchIndexProject(row).map(toSearchBarProject) : []
    })

  getLogger()
    .for('getSearchBarAddressEntries')
    .info('Search bar result', {
      search,
      projectIds: projectMatches.map((r) => r.id),
      tokenIds: tokenMatches.map((r) => r.id),
      type: 'address',
    })
  return [...tokenMatches, ...projectMatches].map((entry, index, list) => ({
    ...entry,
    searchMatchKind: 'direct' as const,
    searchScore: list.length - index,
  }))
}

function extractProjectAddresses(
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): EthereumAddress[] {
  const contractAddresses = Object.values(contracts?.addresses ?? {})
    .flat()
    .map((c) => ChainSpecificAddress.address(c.address))

  const permissionAddresses = Object.values(permissions ?? {})
    .flatMap((p) => [...(p.roles ?? []), ...(p.actors ?? [])])
    .flatMap((p) =>
      p.accounts.map((a) => ChainSpecificAddress.address(a.address)),
    )

  return [...contractAddresses, ...permissionAddresses]
}
