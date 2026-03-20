import { useQuery } from '@tanstack/react-query'
import { getAdmins, getDependencies, getProject } from '../api/api'
import { AdminsInventoryBreakdown } from './AdminsInventoryBreakdown'
import { DependencyInventoryBreakdown } from './DependencyInventoryBreakdown'
import { FunctionBreakdown } from './FunctionBreakdown'

interface V2ScoringSectionProps {
  project: string
}

/**
 * V2 Scoring Section Component
 * Displays scoring with inventory counts from /admins and /dependencies endpoints
 */
export function V2ScoringSection({ project }: V2ScoringSectionProps) {
  const {
    data: adminsData,
    isLoading: adminsLoading,
    error: adminsError,
  } = useQuery({
    queryKey: ['admins', project],
    queryFn: () => getAdmins(project),
  })

  const {
    data: depsData,
    isLoading: depsLoading,
    error: depsError,
  } = useQuery({
    queryKey: ['dependencies', project],
    queryFn: () => getDependencies(project),
  })

  const { data: projectData } = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

  const isLoading = adminsLoading || depsLoading
  const error = adminsError || depsError

  if (isLoading) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-2xl text-blue-600">V2 Scoring:</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="text-coffee-400">Loading scores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-2xl text-blue-600">V2 Scoring:</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="text-red-400">
            Error loading scores: {String(error)}
          </p>
        </div>
      </div>
    )
  }

  if (!adminsData || !depsData) {
    return null
  }

  // Count contracts from project data
  const contractCount =
    projectData?.entries?.reduce(
      (sum, entry) =>
        sum +
        (entry.initialContracts?.length ?? 0) +
        (entry.discoveredContracts?.length ?? 0),
      0,
    ) ?? 0

  return (
    <div className="border-b border-b-coffee-600 pb-2">
      <h2 className="p-2 font-bold text-2xl text-blue-600">V2 Scoring:</h2>
      <div className="mb-1 flex flex-col gap-4 border-transparent border-l-4 p-2 pl-1">
        {/* Inventory Subsection */}
        <div>
          <h3 className="mb-2 font-semibold text-lg text-orange-400">
            Inventory
          </h3>
          <div className="ml-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between text-coffee-300">
              <span className="font-medium">Contracts:</span>
              <span>{contractCount}</span>
            </div>
            <FunctionBreakdown project={project} />
            <DependencyInventoryBreakdown
              depsData={depsData}
              adminsData={adminsData}
            />
            <AdminsInventoryBreakdown adminsData={adminsData} />
          </div>
        </div>
      </div>
    </div>
  )
}
