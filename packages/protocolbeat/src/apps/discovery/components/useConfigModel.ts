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

  const originalConfig = useMemo(() => {
    return configModel.diff(configModel) ?? false
  }, [configModel])

  const isDirty = useMemo(() => {
    return configModel.diff(configModel) ?? false
  }, [configModel, originalConfig])

  useEffect(() => {
    setConfigModel(ConfigModel.fromRawJsonc(config ?? '{}'))
  }, [config])

  const setIgnoreMethods = (methods: string[]) => {
    setConfigModel(configModel.setIgnoreMethods(selectedAddress, methods))
  }
  const setIgnoreRelatives = (relatives: string[]) => {
    setConfigModel(configModel.setIgnoreRelatives(selectedAddress, relatives))
  }
  const setIgnoreInWatchMode = (methods: string[]) => {
    setConfigModel(configModel.setIgnoreInWatchMode(selectedAddress, methods))
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

  const save = useCallback(() => {
    saveMutation.mutate(configString)
  }, [saveMutation, configString])

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

    save,

    isDirty,

    configString,

    ignoreMethods: configModel.getIgnoredMethods(selectedAddress),
    ignoreRelatives: configModel.getIgnoreRelatives(selectedAddress),
    ignoreInWatchMode: configModel.getIgnoreInWatchMode(selectedAddress),
  }
}
