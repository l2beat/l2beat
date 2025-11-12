import { useQuery } from '@tanstack/react-query'
import { readConfigFile } from '../../../api/api'
import { useProjectData } from './useProjectData'

export function useCurrentConfig() {
  const { project } = useProjectData()

  const configResponse = useQuery({
    queryKey: ['projects', project, 'config'],
    queryFn: () => {
      return readConfigFile(project)
    },
  })

  return {
    isPending: configResponse.isPending,
    isError: configResponse.isError,
    configContent: configResponse.data?.config,
  }
}
