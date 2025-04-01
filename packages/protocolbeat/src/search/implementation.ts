import { getProject, searchCode } from '../api/api'
import type { ApiAddressEntry, ApiCodeSearchResponse } from '../api/types'
import { debounce } from '../common/debounce'
import { getCodeSearchTerm } from './CodeSearchResultEntry'

export type SearchResults =
  | { type: 'contract'; entryCount: number; entries: ApiAddressEntry[] }
  | {
      type: 'code'
      entryCount: number
      entries: ApiCodeSearchResponse['matches']
    }

async function serachContractQuery(
  project: string,
  searchTerm: string,
): Promise<SearchResults> {
  const projectObject = await getProject(project)

  const allEntries = projectObject.entries.flatMap((c) => {
    return [...c.initialContracts, ...c.discoveredContracts, ...c.eoas]
  })

  const searchTermLower = searchTerm.toLowerCase()
  const entries = allEntries.filter(
    (contract) =>
      searchTerm.length === 0 ||
      contract.name?.toLowerCase().includes(searchTermLower) ||
      contract.address.toLowerCase().includes(searchTermLower),
  )

  const result = {
    type: 'contract',
    entryCount: entries.length,
    entries,
  } as const

  return result
}

async function searchCodeQuery(
  project: string,
  searchTerm: string,
): Promise<SearchResults> {
  const codeSearchTerm = getCodeSearchTerm(searchTerm)
  if (codeSearchTerm.length === 0) {
    return { type: 'code', entryCount: 0, entries: [] }
  }

  const searchResult = await searchCode(project, codeSearchTerm)
  const entryCount = searchResult.matches
    .map((m) => m.codeLocation.length)
    .reduce((a, v) => a + v)

  return { type: 'code', entryCount, entries: searchResult.matches }
}

const searchCodeQueryDebounced = debounce(searchCodeQuery, 350)

export async function searchQuery(
  project: string,
  searchTerm: string,
): Promise<SearchResults> {
  if (searchTerm.startsWith('%')) {
    return await searchCodeQueryDebounced(project, searchTerm)
  } else {
    return await serachContractQuery(project, searchTerm)
  }
}
