import { QueryClient } from '@tanstack/react-query'
import { getProject, getProjects, searchCode } from '../../../api/api'
import type { ApiAddressEntry, ApiCodeSearchResponse } from '../../../api/types'
import { getCodeSearchTerm, isCodeSearchTerm } from './CodeSearchResultEntry'
import {
  getProjectSearchTerm,
  isProjectSearchTerm,
} from './ProjectSearchResultEntry'

const queryClient = new QueryClient()

export type SearchResults =
  | { type: 'contract'; entryCount: number; entries: ApiAddressEntry[] }
  | { type: 'project'; entryCount: number; entries: string[] }
  | {
      type: 'code'
      entryCount: number
      entries: ApiCodeSearchResponse['matches']
    }

async function searchContractQuery(
  project: string,
  searchTerm: string,
): Promise<SearchResults> {
  const projectObject = await queryClient.ensureQueryData({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

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
  selectedAddress: string | undefined,
): Promise<SearchResults> {
  const codeSearchTerm = getCodeSearchTerm(searchTerm)
  if (codeSearchTerm.content.length === 0) {
    return { type: 'code', entryCount: 0, entries: [] }
  }

  const address =
    codeSearchTerm.onSelectedAddress && selectedAddress !== undefined
      ? selectedAddress
      : undefined

  const searchResult = await searchCode(
    project,
    codeSearchTerm.content,
    address,
  )
  const entryCount = searchResult.matches
    .map((m) => m.codeLocation.length)
    .reduce((a, v) => a + v, 0)

  return { type: 'code', entryCount, entries: searchResult.matches }
}

async function searchProjectQuery(searchTerm: string): Promise<SearchResults> {
  const projects = await queryClient.ensureQueryData({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  })

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

export async function searchQuery(
  project: string,
  searchTerm: string,
  selectedAddress: string | undefined,
): Promise<SearchResults> {
  if (isCodeSearchTerm(searchTerm)) {
    return await searchCodeQuery(project, searchTerm, selectedAddress)
  }
  if (isProjectSearchTerm(searchTerm)) {
    return await searchProjectQuery(searchTerm)
  }
  return await searchContractQuery(project, searchTerm)
}
