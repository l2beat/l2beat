import { getProject, getProjects, searchCode } from '../api/api'
import type { ApiAddressEntry, ApiCodeSearchResponse } from '../api/types'
import { debounce } from '../common/debounce'
import { getCodeSearchTerm } from './CodeSearchResultEntry'
import { getProjectSearchTerm } from './ProjectSearchResultEntry'

export type SearchResults =
  | { type: 'contract'; entryCount: number; entries: ApiAddressEntry[] }
  | { type: 'project'; entryCount: number; entries: string[] }
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
    .reduce((a, v) => a + v, 0)

  return { type: 'code', entryCount, entries: searchResult.matches }
}

const searchCodeQueryDebounced = debounce(searchCodeQuery, 350)

async function searchProjectQuery(searchTerm: string): Promise<SearchResults> {
  const projects = await getProjects()
  const projectSearchTerm = getProjectSearchTerm(searchTerm)
  const matching = projects.filter((p) =>
    p.name.toLowerCase().includes(projectSearchTerm.toLowerCase()),
  )

  return {
    type: 'project',
    entryCount: matching.length,
    entries: matching.map((p) => p.name),
  }
}

const searchProjectQueryDebounced = debounce(searchProjectQuery, 150)

export async function searchQuery(
  project: string,
  searchTerm: string,
): Promise<SearchResults> {
  if (searchTerm.startsWith('%')) {
    return await searchCodeQueryDebounced(project, searchTerm)
  } else if (searchTerm.startsWith('@')) {
    return await searchProjectQueryDebounced(searchTerm)
  } else {
    return await serachContractQuery(project, searchTerm)
  }
}
