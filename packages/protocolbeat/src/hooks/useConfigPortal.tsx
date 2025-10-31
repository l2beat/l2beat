import type {
  ContractConfigSchema,
  DiscoveryConfigSchema,
} from '@l2beat/discovery'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { readConfigFile, readTemplateFile } from '../api/api'
import {
  ConfigModel,
  ContractConfigModel,
} from '../apps/discovery/components/ConfigModel'
import { useProjectData } from '../apps/discovery/hooks/useProjectData'
import { findTemplateId } from '../apps/discovery/panel-template/TemplatePanel'

type ConfigContextType = ReturnType<typeof useConfig>
const ConfigContext = createContext<ConfigContextType | null>(null)

export function useConfigContext() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const config = useConfig()
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export function useConfig() {
  const project = useProjectData()

  const configResponse = useQuery({
    queryKey: ['config', project.project],
    queryFn: () => readConfigFile(project.project),
  })

  const templateId = findTemplateId(
    project.projectResponse.data?.entries ?? [],
    project.selectedAddress,
  )

  const templateResponse = useQuery({
    queryKey: ['template', project.project],
    queryFn: () => readTemplateFile(templateId),
  })

  const emptyConfig = ConfigModel.fromPeak({} as DiscoveryConfigSchema)
  const emptyTemplate = ContractConfigModel.fromPeak({} as ContractConfigSchema)

  const [config, setConfig] = useState(() => emptyConfig)
  const [template, setTemplate] = useState(() => emptyTemplate)

  useEffect(() => {
    if (!configResponse.data || configResponse.isLoading) {
      setConfig(emptyConfig)
    } else {
      setConfig(ConfigModel.fromRawJsonc(configResponse.data.config))
    }
  }, [configResponse.data, configResponse.isLoading])

  useEffect(() => {
    if (
      !templateResponse.data ||
      templateResponse.isLoading ||
      !templateId ||
      !templateResponse.data.template
    ) {
      setTemplate(emptyTemplate)
    } else {
      setTemplate(
        ContractConfigModel.fromRawJsonc(templateResponse.data.template),
      )
    }
  }, [templateResponse.data, templateResponse.isLoading, templateId])

  const id = project.selectedAddress

  function setIgnoreDiscovery(ignoreDiscovery: boolean) {
    if (template.hasDefinition('ignoreDiscovery')) {
      template.setIgnoreDiscovery(ignoreDiscovery)
      setTemplate(ContractConfigModel.fromPeak(template.peak()))
    } else {
      config.setIgnoreDiscovery(id, ignoreDiscovery)
      setConfig(ConfigModel.fromPeak(config.peak()))
    }
  }

  function setIgnoreInWatchMode(ignoreInWatchMode: string[]) {
    if (template.hasDefinition('ignoreInWatchMode')) {
      template.setIgnoreInWatchMode(ignoreInWatchMode)
      setTemplate(ContractConfigModel.fromPeak(template.peak()))
    } else {
      config.setIgnoreInWatchMode(id, ignoreInWatchMode)
      setConfig(ConfigModel.fromPeak(config.peak()))
    }
  }

  function setIgnoreMethods(ignoreMethods: string[]) {
    if (template.hasDefinition('ignoreMethods')) {
      template.setIgnoreMethods(ignoreMethods)
      setTemplate(ContractConfigModel.fromPeak(template.peak()))
    } else {
      config.setIgnoreMethods(id, ignoreMethods)
      setConfig(ConfigModel.fromPeak(config.peak()))
    }
  }

  function setIgnoreRelatives(ignoreRelatives: string[]) {
    if (template.hasDefinition('ignoreRelatives')) {
      template.setIgnoreRelatives(ignoreRelatives)
      setTemplate(ContractConfigModel.fromPeak(template.peak()))
    } else {
      config.setIgnoreRelatives(id, ignoreRelatives)
      setConfig(ConfigModel.fromPeak(config.peak()))
    }
  }

  function getIgnoreDiscovery(): boolean {
    return template.hasDefinition('ignoreDiscovery')
      ? template.getIgnoreDiscovery()
      : config.getIgnoreDiscovery(id)
  }

  function getIgnoreInWatchMode(): string[] {
    return template.hasDefinition('ignoreInWatchMode')
      ? template.getIgnoreInWatchMode()
      : config.getIgnoreInWatchMode(id)
  }

  function getIgnoreMethods(): string[] {
    return template.hasDefinition('ignoreMethods')
      ? template.getIgnoreMethods()
      : config.getIgnoreMethods(id)
  }

  function getIgnoreRelatives(): string[] {
    return template.hasDefinition('ignoreRelatives')
      ? template.getIgnoreRelatives()
      : config.getIgnoreRelatives(id)
  }

  return {
    setIgnoreDiscovery,
    setIgnoreInWatchMode,
    setIgnoreMethods,
    setIgnoreRelatives,
    getIgnoreDiscovery,
    getIgnoreInWatchMode,
    getIgnoreMethods,
    getIgnoreRelatives,
    config,
    template,
  }
}
