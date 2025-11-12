import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { readTemplateFile } from '../../../api/api'
import { findTemplateId } from '../../../utils/findTemplateId'
import { useProjectData } from './useProjectData'

export function useCurrentTemplate() {
  const { project, selectedAddress, projectResponse } = useProjectData()

  const templateId = findTemplateId(
    projectResponse.data?.entries ?? [],
    selectedAddress,
  )

  const templateResponse = useQuery({
    queryKey: ['projects', project, 'template', templateId, selectedAddress],
    queryFn: () => {
      if (!templateId) {
        return null
      }
      return readTemplateFile(templateId)
    },
  })

  const templateContent = useMemo(() => {
    if (!templateId) {
      return null
    }
    return templateResponse.data
  }, [templateResponse.data])

  return {
    isPending: templateResponse.isPending || projectResponse.isPending,
    isError: templateResponse.isError || projectResponse.isError,
    files: templateContent,
    templateId,
  }
}
