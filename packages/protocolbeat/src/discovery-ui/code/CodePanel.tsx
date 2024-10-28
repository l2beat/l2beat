import { useQuery } from '@tanstack/react-query'
import { useStore } from '../store'
import { getCode, getProject } from '../api/api'
import { useParams } from 'react-router-dom'

export function CodePanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const projectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const selectedAddress = useStore((state) => state.selected[0])
  const codeResponse = useQuery({
    queryKey: ['projects', project, 'code', selectedAddress],
    enabled: selectedAddress !== undefined,
    queryFn: () => getCode(project, selectedAddress),
  })

  if (projectResponse.isLoading || codeResponse.isLoading) {
    return <div>Loading</div>
  }
  if (projectResponse.isError || codeResponse.isLoading) {
    return <div>Error</div>
  }
  return <div className="h-full">Code {JSON.stringify(codeResponse.data)}</div>
}
