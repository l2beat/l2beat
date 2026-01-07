import { createContext, useContext, useMemo } from 'react'
import { IS_READONLY } from '../../../config/readonly'
import { isInRootDiscovery } from '../../../utils/findChainForAddress'
import { useConfigModel } from './useConfigModel'
import { useCurrentConfig } from './useCurrentConfig'
import { useCurrentTemplate } from './useCurrentTemplate'
import { useProjectData } from './useProjectData'
import { useTemplateModel } from './useTemplateModel'

export type ConfigModels = ReturnType<typeof _useConfigModels>
const Context = createContext<ConfigModels | null>(null)

export function ConfigModelsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const configModels = _useConfigModels()

  return <Context.Provider value={configModels}>{children}</Context.Provider>
}

export function useConfigModels() {
  const context = useContext(Context)
  if (!context) {
    throw new Error(
      'useConfigModels must be used within a ConfigModelsProvider',
    )
  }
  return context
}

function _useConfigModels() {
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

  const isPending = isProjectPending || isTemplatePending || isConfigPending
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
  }, [isSelectedInRootDiscovery])

  const configModel = useConfigModel({
    project,
    config: config ?? '{}',
    selectedAddress: selectedAddress ?? '',
  })
  const templateModel = useTemplateModel({
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
    isPending,
  }
}
