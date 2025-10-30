import type { DiscoveryConfigSchema } from '@l2beat/discovery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parse } from 'comment-json'
import { current, isDraft, original, produce } from 'immer'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const configModelRef = useRef(configModel)

  // Keep ref in sync with state
  useEffect(() => {
    configModelRef.current = configModel
  }, [configModel])

  const originalConfig = useMemo(() => {
    return isDraft(configModel) ? original(configModel) : undefined
  }, [configModel])

  const isDirty = useMemo(() => {
    return originalConfig?.diff(configModel) ?? false
  }, [configModel, originalConfig])

  useEffect(() => {
    setConfigModel(ConfigModel.fromRawJsonc(config ?? '{}'))
  }, [config])

  const setIgnoreMethods = (methods: string[]) => {
    setConfigModel(
      produce((draft) => {
        draft.setIgnoreMethods(selectedAddress, methods)
      }),
    )
  }
  const setIgnoreRelatives = (relatives: string[]) => {
    setConfigModel(
      produce((draft) => {
        draft.setIgnoreRelatives(selectedAddress, relatives)
      }),
    )
  }
  const setIgnoreInWatchMode = (methods: string[]) => {
    setConfigModel(
      produce((draft) => {
        draft.setIgnoreInWatchMode(selectedAddress, methods)
      }),
    )
  }

  const getConfigString = useCallback(() => {
    const model = isDraft(configModelRef.current)
      ? current(configModelRef.current)
      : configModelRef.current
    return model.toString()
  }, [])

  const saveMutation = useMutation({
    mutationFn: async (configString: string) => {
      console.log('saveMutation', project, configString)
      await updateConfigFile(project, configString)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', project, 'config'],
      })
    },
  })

  const save = useCallback(() => {
    const model = isDraft(configModelRef.current)
      ? current(configModelRef.current)
      : configModelRef.current
    const configString = model.toString()
    saveMutation.mutate(configString)
  }, [saveMutation])

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

    getConfigString,

    ignoreMethods: configModel.getIgnoredMethods(selectedAddress),
    ignoreRelatives: configModel.getIgnoreRelatives(selectedAddress),
    ignoreInWatchMode: configModel.getIgnoreInWatchMode(selectedAddress),
  }
}
