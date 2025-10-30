import { useMutation } from '@tanstack/react-query'
import { isDraft, original, produce } from 'immer'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { writeTemplateFile } from '../../../api/api'
import { ContractConfigModel } from './ConfigModel'

type Props = {
  templateId: string
  template: string
}

export function useTemplateModel({ templateId, template }: Props) {
  const [templateModel, setTemplateModel] = useState(
    ContractConfigModel.fromRawJsonc(template ?? '{}'),
  )

  useEffect(() => {
    setTemplateModel(ContractConfigModel.fromRawJsonc(template ?? '{}'))
  }, [template])

  const originalTemplate = useMemo(() => {
    return isDraft(templateModel) ? original(templateModel) : undefined
  }, [templateModel])

  const isDirty = useMemo(() => {
    return originalTemplate?.diff(templateModel) ?? false
  }, [templateModel, originalTemplate])

  const setIgnoreMethods = (methods: string[]) => {
    setTemplateModel(
      produce((draft) => {
        draft.setIgnoreMethods(methods)
      }),
    )
  }
  const setIgnoreRelatives = (relatives: string[]) => {
    setTemplateModel(
      produce((draft) => {
        draft.setIgnoreRelatives(relatives)
      }),
    )
  }
  const setIgnoreInWatchMode = (methods: string[]) => {
    setTemplateModel(
      produce((draft) => {
        draft.setIgnoreInWatchMode(methods)
      }),
    )
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      await writeTemplateFile(templateId, getTemplateString())
    },
  })

  const hasDefinition = useCallback(
    (method: string) => {
      return templateModel.hasDefinition(method)
    },
    [templateModel],
  )

  const getTemplateString = useCallback(() => {
    return templateModel.toString()
  }, [templateModel])

  return {
    templateModel,
    setIgnoreMethods,
    setIgnoreRelatives,
    setIgnoreInWatchMode,
    hasDefinition,

    save: saveMutation.mutate,

    isDirty,

    getTemplateString,

    ignoreMethods: templateModel.ignoreMethods,
    ignoreRelatives: templateModel.ignoreRelatives,
    ignoreInWatchMode: templateModel.ignoreInWatchMode,
  }
}
