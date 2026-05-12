import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { findSelected } from '../../../utils/findSelected'
import { usePanelStore } from '../store/panel-store'
import { useProjectQueryOptions } from './projectQuery'

export function useProjectData() {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const projectResponse = useQuery(useProjectQueryOptions(project))

  const selected = projectResponse.data
    ? findSelected(projectResponse.data.entries, selectedAddress)
    : undefined

  return {
    isPending: projectResponse.isPending,
    isError: projectResponse.isError,
    project,
    selectedAddress,
    projectResponse,
    selected,
  }
}
