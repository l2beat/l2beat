import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  checkConfigOverspecification,
  checkTemplateOverspecification,
} from '../../../api/api'
import type { Field, OverspecifiedResult } from '../../../api/types'
import { IS_READONLY } from '../../../config/readonly'
import { useConfigModels } from './useConfigModels'
import { useProjectData } from './useProjectData'

type IgnoreConfig = {
  ignoreInWatchMode?: string[]
  ignoreMethods?: string[]
  ignoreRelatives?: string[]
}

export type OverspecControl = ReturnType<typeof useOverspecControl>

const EMPTY: OverspecifiedResult = {
  ignoreInWatchMode: [],
  ignoreMethods: [],
  ignoreRelatives: [],
}

function stableKeyForIgnoreConfig(config: IgnoreConfig): string {
  // Keep queryKey small + stable. Arrays are already strings.
  const a = (config.ignoreInWatchMode ?? []).join(',')
  const b = (config.ignoreMethods ?? []).join(',')
  const c = (config.ignoreRelatives ?? []).join(',')
  return `${a}|${b}|${c}`
}

export function useOverspecControl(_options?: { debounceMs?: number }) {
  const { project, selected } = useProjectData()
  const {
    configModel,
    templateModel,
    isPending: areModelsPending,
  } = useConfigModels()

  const address = selected?.address
  const templateId = templateModel.hasTemplate || undefined

  const configIgnore: IgnoreConfig = useMemo(
    () => ({
      ignoreInWatchMode: configModel.ignoreInWatchMode ?? [],
      ignoreMethods: configModel.ignoreMethods ?? [],
      ignoreRelatives: configModel.ignoreRelatives ?? [],
    }),
    [
      configModel.ignoreInWatchMode,
      configModel.ignoreMethods,
      configModel.ignoreRelatives,
    ],
  )

  const templateIgnore: IgnoreConfig = useMemo(
    () => ({
      ignoreInWatchMode: templateModel.ignoreInWatchMode ?? [],
      ignoreMethods: templateModel.ignoreMethods ?? [],
      ignoreRelatives: templateModel.ignoreRelatives ?? [],
    }),
    [
      templateModel.ignoreInWatchMode,
      templateModel.ignoreMethods,
      templateModel.ignoreRelatives,
    ],
  )

  const debouncedConfigIgnore = configIgnore
  const debouncedTemplateIgnore = templateIgnore

  const configOverspecQuery = useQuery({
    queryKey: [
      'overspec',
      'config',
      project,
      address,
      stableKeyForIgnoreConfig(debouncedConfigIgnore),
    ],
    queryFn: async () => {
      if (!address) {
        return EMPTY
      }
      const res = await checkConfigOverspecification({
        project,
        address,
        ...debouncedConfigIgnore,
      })
      return res.overspecified
    },
    enabled: Boolean(address) && !areModelsPending && !IS_READONLY,
  })

  const templateOverspecQuery = useQuery({
    queryKey: [
      'overspec',
      'template',
      templateId,
      stableKeyForIgnoreConfig(debouncedTemplateIgnore),
    ],
    queryFn: async () => {
      if (!templateId) return EMPTY
      const res = await checkTemplateOverspecification({
        templateId,
        ...debouncedTemplateIgnore,
      })
      return res.overspecified
    },
    enabled: Boolean(templateId) && !areModelsPending && !IS_READONLY,
  })

  function checkFieldAgainstOverspec(overspec: OverspecifiedResult) {
    return (field: Field) => {
      const overspecifiedIgnores: string[] = []
      if (overspec.ignoreMethods.includes(field.name)) {
        overspecifiedIgnores.push('ignoreMethods')
      }
      if (overspec.ignoreRelatives.includes(field.name)) {
        overspecifiedIgnores.push('ignoreRelatives')
      }
      if (overspec.ignoreInWatchMode.includes(field.name)) {
        overspecifiedIgnores.push('ignoreInWatchMode')
      }
      return overspecifiedIgnores
    }
  }

  const configOverspec = configOverspecQuery.data ?? EMPTY
  const templateOverspec = templateOverspecQuery.data ?? EMPTY

  return {
    checkConfig: checkFieldAgainstOverspec(configOverspec),
    checkTemplate: checkFieldAgainstOverspec(templateOverspec),
  }
}
