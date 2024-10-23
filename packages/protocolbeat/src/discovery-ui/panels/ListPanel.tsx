import { useApiProject } from './useApiProject'

export function ListPanel() {
  const response = useApiProject()
  if (response.isLoading) {
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }
  return <div>{response.data.chains.length} chains</div>
}
