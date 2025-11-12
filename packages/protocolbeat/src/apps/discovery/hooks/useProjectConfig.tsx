import { createContext, useContext, useMemo } from 'react'
import { IS_READONLY } from '../../../config/readonly'
import { isInRootDiscovery } from '../../../utils/findChainForAddress'
import { useConfigModel } from '../components/useConfigModel'
import { useTemplateModel } from '../components/useTemplateModel'
import { useCurrentConfig } from './useCurrentConfig'
import { useCurrentTemplate } from './useCurrentTemplate'
import { useProjectData } from './useProjectData'

export type ProjectConfigModels = ReturnType<typeof _useProjectConfigModels>
const Context = createContext<ProjectConfigModels | null>(null)

export function ProjectConfigProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const configModels = _useProjectConfigModels()

  return <Context.Provider value={configModels}>{children}</Context.Provider>
}

export function useProjectConfigModels() {
  const context = useContext(Context)
  if (!context) {
    throw new Error(
      'useProjectConfigModels must be used within a ProjectConfigProvider',
    )
  }
  return context
}

function _useProjectConfigModels() {
  const {
    isPending: isProjectPending,
    isError: isProjectError,
    selectedAddress,
    project,
    projectResponse,
  } = useProjectData()
  const {
    templateId,
    files: templateFiles,
    isPending: isTemplatePending,
    isError: isTemplateError,
  } = useCurrentTemplate()
  const {
    configContent: config,
    isPending: isConfigPending,
    isError: isConfigError,
  } = useCurrentConfig()

  const isLoading = isProjectPending || isTemplatePending || isConfigPending
  const isError = isProjectError || isTemplateError || isConfigError

  const isSelectedInRootDiscovery = useMemo(
    () =>
      isInRootDiscovery(
        project,
        projectResponse.data?.entries ?? [],
        selectedAddress,
      ),
    [project, projectResponse.data?.entries, selectedAddress],
  )

  const canModify = useMemo(() => {
    return !IS_READONLY && isSelectedInRootDiscovery
  }, [isInRootDiscovery, isSelectedInRootDiscovery])

  const configModel = useConfigModel({
    project,
    config: config ?? '{}',
    selectedAddress: selectedAddress ?? '',
  })
  const templateModel = useTemplateModel({
    project,
    templateId,
    files: {
      template: templateFiles?.template ?? '{}',
      shapes: templateFiles?.shapes,
      criteria: templateFiles?.criteria,
    },
  })

  return {
    canModify,
    configModel,
    templateModel,
    isError,
    isLoading,
  }
}
