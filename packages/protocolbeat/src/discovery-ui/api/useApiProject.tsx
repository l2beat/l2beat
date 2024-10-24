import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getProject } from './api'

export function useApiProject() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  return useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
}
