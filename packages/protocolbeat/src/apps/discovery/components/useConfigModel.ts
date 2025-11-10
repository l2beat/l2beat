import type { DiscoveryConfigSchema } from '@l2beat/discovery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parse } from 'comment-json'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { updateConfigFile } from '../../../api/api'
import { ConfigModel } from './ConfigModel'

export function toConfigModel(config: string): DiscoveryConfigSchema {
  return parse(config) as unknown as DiscoveryConfigSchema
}

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

  const setIgnoreMethods = (methods: string[]) => {
    const newModel = configModel.setIgnoreMethods(selectedAddress, methods)
    setConfigModel(newModel)
    saveMutation.mutate(newModel.toString())
  }
  const setIgnoreRelatives = (relatives: string[]) => {
    const newModel = configModel.setIgnoreRelatives(selectedAddress, relatives)
    setConfigModel(newModel)
    saveMutation.mutate(newModel.toString())
  }
  const setIgnoreInWatchMode = (methods: string[]) => {
    const newModel = configModel.setIgnoreInWatchMode(selectedAddress, methods)
    setConfigModel(newModel)
    saveMutation.mutate(newModel.toString())
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

  const saveRaw = useCallback(
    (configString: string) => {
      const newModel = ConfigModel.fromRawJsonc(configString)
      setConfigModel(newModel)
      saveMutation.mutate(newModel.toString())
    },
    [project],
  )

  const hasDefinition = useCallback(
    (method: string) => {
      return configModel.hasOverrideDefinition(selectedAddress, method)
    },
    [configModel, selectedAddress],
  )

  return {
    configModel,
    setIgnoreMethods,
    setIgnoreRelatives,
    setIgnoreInWatchMode,
    hasDefinition,

    save: saveRaw,

    configString,

    ignoreMethods: configModel.getIgnoredMethods(selectedAddress),
    ignoreRelatives: configModel.getIgnoreRelatives(selectedAddress),
    ignoreInWatchMode: configModel.getIgnoreInWatchMode(selectedAddress),
  }
}
