import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { updateConfigFile } from '../../../api/api'
import { formatJson } from '../../../utils/formatJson'
import { toggleInList } from '../../../utils/toggleInList'
import { ConfigModel } from '../models/ConfigModel'

type Props = {
  project: string
  config: string
  selectedAddress: string
}

export function useConfigModel({ project, config, selectedAddress }: Props) {
  const queryClient = useQueryClient()
  const [configModel, setConfigModel] = useState(
    ConfigModel.fromRawJsonc(config ?? '{}'),
  )

  useEffect(() => {
    setConfigModel(ConfigModel.fromRawJsonc(config ?? '{}'))
  }, [config])

  const toggleIgnoreMethods = (fieldName: string) => {
    const current = configModel.getIgnoredMethods(selectedAddress) ?? []
    const updated = toggleInList(fieldName, current)
    const newModel = configModel.setIgnoreMethods(selectedAddress, updated)
    setConfigModel(newModel)
    saveModelContents(newModel)
  }

  const toggleIgnoreRelatives = (fieldName: string) => {
    const current = configModel.getIgnoreRelatives(selectedAddress) ?? []
    const updated = toggleInList(fieldName, current)
    const newModel = configModel.setIgnoreRelatives(selectedAddress, updated)
    setConfigModel(newModel)
    saveModelContents(newModel)
  }

  const toggleIgnoreInWatchMode = (fieldName: string) => {
    const current = configModel.getIgnoreInWatchMode(selectedAddress) ?? []
    const updated = toggleInList(fieldName, current)
    const newModel = configModel.setIgnoreInWatchMode(selectedAddress, updated)
    setConfigModel(newModel)
    saveModelContents(newModel)
  }

  const setFieldSeverity = (
    fieldName: string,
    severity: 'HIGH' | 'LOW' | undefined,
  ) => {
    const newModel = configModel.setFieldSeverity(
      selectedAddress,
      fieldName,
      severity,
    )
    setConfigModel(newModel)
    saveModelContents(newModel)
  }

  const getFieldSeverity = (fieldName: string) => {
    return configModel.getFieldSeverity(selectedAddress, fieldName)
  }

  const setCategory = (category: string | undefined) => {
    const newModel = configModel.setCategory(selectedAddress, category)
    setConfigModel(newModel)
    saveModelContents(newModel)
  }

  const setDescription = (description: string | undefined) => {
    const newModel = configModel.setDescription(selectedAddress, description)
    setConfigModel(newModel)
    saveModelContents(newModel)
  }

  const configString = useMemo(() => {
    return configModel.toString()
  }, [configModel])

  const saveMutation = useMutation({
    mutationFn: async (configString: string) => {
      await updateConfigFile(project, configString)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', project, 'config'],
      })
    },
  })

  const saveModelContents = (model: ConfigModel) => {
    if (model.hasComments()) {
      saveMutation.mutate(model.toString())
    } else {
      saveMutation.mutate(formatJson(model.peek()))
    }
  }

  const saveRaw = useCallback(
    (configString: string) => {
      const newModel = ConfigModel.fromRawJsonc(configString)
      setConfigModel(newModel)
      saveModelContents(newModel)
    },
    [project],
  )

  return {
    configModel,
    toggleIgnoreMethods,
    toggleIgnoreRelatives,
    toggleIgnoreInWatchMode,
    setFieldSeverity,
    getFieldSeverity,
    setCategory,
    setDescription,

    save: saveRaw,

    files: {
      config: configString,
    },

    ignoreMethods: configModel.getIgnoredMethods(selectedAddress),
    ignoreRelatives: configModel.getIgnoreRelatives(selectedAddress),
    ignoreInWatchMode: configModel.getIgnoreInWatchMode(selectedAddress),
    category: configModel.getCategory(selectedAddress),
    description: configModel.getDescription(selectedAddress),
  }
}
