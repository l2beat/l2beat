import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { findSelected } from '../../../utils/findSelected'
import { useProjectQueryOptions } from './projectQuery'
import { useDeferredSelection } from './useDeferredSelection'

export function useProjectData() {
  const { project } = useParams()
  const selectedAddresses = useDeferredSelection()

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const projectResponse = useQuery(useProjectQueryOptions(project))

  const [selectedAddress] = selectedAddresses
  const selected = projectResponse.data
    ? findSelected(projectResponse.data.entries, selectedAddress)
    : undefined

  return {
    isPending: projectResponse.isPending,
    isError: projectResponse.isError,
    project,
    selectedAddress,
    selectedAddresses,
    projectResponse,
    selected,
  }
}
