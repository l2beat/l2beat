import { useQuery } from '@tanstack/react-query'
import {
  getAdmins,
  getContractTags,
  getDependencies,
  getFundsData,
  getFunctions,
  getProject,
} from '../../../api/api'
import type { ImportDataBundle } from './reviewDataSources'

/**
 * Hook that fetches all data sources needed for review imports.
 * Leverages React Query cache — if data was already loaded in other panels
 * (DeFiScan, Values, etc.), it's served instantly from cache.
 *
 * All queries are enabled by default (eager fetch) so import buttons
 * can show availability status immediately.
 */
export function useReviewImportData(project: string) {
  const projectQuery = useQuery({
    queryKey: ['project', project],
    queryFn: () => getProject(project),
    staleTime: 60_000,
  })

  const functionsQuery = useQuery({
    queryKey: ['functions', project],
    queryFn: () => getFunctions(project),
    staleTime: 60_000,
  })

  const fundsQuery = useQuery({
    queryKey: ['funds-data', project],
    queryFn: () => getFundsData(project),
    staleTime: 60_000,
    retry: false,
  })

  const contractTagsQuery = useQuery({
    queryKey: ['contract-tags', project],
    queryFn: () => getContractTags(project),
    staleTime: 60_000,
  })

  const adminsQuery = useQuery({
    queryKey: ['admins', project],
    queryFn: () => getAdmins(project),
    staleTime: 60_000,
    retry: false,
  })

  const depsQuery = useQuery({
    queryKey: ['dependencies', project],
    queryFn: () => getDependencies(project),
    staleTime: 60_000,
    retry: false,
  })

  const isLoading =
    projectQuery.isLoading ||
    functionsQuery.isLoading ||
    fundsQuery.isLoading ||
    contractTagsQuery.isLoading ||
    adminsQuery.isLoading ||
    depsQuery.isLoading

  const data: ImportDataBundle = {
    projectData: projectQuery.data,
    functionsData: functionsQuery.data,
    fundsData: fundsQuery.data,
    contractTags: contractTagsQuery.data,
    adminsData: adminsQuery.data,
    depsData: depsQuery.data,
  }

  return { data, isLoading }
}
