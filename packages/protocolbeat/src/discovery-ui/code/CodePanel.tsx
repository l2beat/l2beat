import { useApiProject } from '../api/useApiProject'

export function CodePanel() {
  const response = useApiProject()
  if (response.isLoading) {
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }
  return <div className="h-full">Code</div>
}
