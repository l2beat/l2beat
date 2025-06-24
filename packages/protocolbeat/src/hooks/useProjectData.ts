import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import { findSelected } from '../common/findSelected'
import { usePanelStore } from '../store/store'

export function useProjectData() {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const projectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

  const selected = projectResponse.data
    ? findSelected(projectResponse.data.entries, selectedAddress)
    : undefined

  return {
    project,
    selectedAddress,
    projectResponse,
    selected,
  }
}
