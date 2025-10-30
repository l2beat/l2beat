import { createContext, useContext } from 'react'
import { useConfigModel } from '../components/useConfigModel'
import { useTemplateModel } from '../components/useTemplateModel'
import { useCurrentConfig } from './useCurrentConfig'
import { useCurrentTemplate } from './useCurrentTemplate'
import { useProjectData } from './useProjectData'

type ConfigModels = ReturnType<typeof _useProjectConfigModels>
const Context = createContext<ConfigModels | null>(null)

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
    isLoading: isProjectLoading,
    isError: isProjectError,
    selectedAddress,
    project,
  } = useProjectData()
  const {
    templateId,
    templateContent: template,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
  } = useCurrentTemplate()
  const {
    configContent: config,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useCurrentConfig()

  const isLoading = isProjectLoading || isTemplateLoading || isConfigLoading
  const isError = isProjectError || isTemplateError || isConfigError

  const configModel = useConfigModel({
    project,
    config: config ?? '{}',
    selectedAddress: selectedAddress ?? '',
  })
  const templateModel = useTemplateModel({
    templateId: templateId ?? '',
    template: template ?? '{}',
  })

  return {
    configModel,
    templateModel,
    isError,
    isLoading,
  }
}
