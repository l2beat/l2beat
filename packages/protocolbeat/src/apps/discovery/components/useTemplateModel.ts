import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { writeTemplateFile } from '../../../api/api'
import { ContractConfigModel } from './ConfigModel'

type Props = {
  templateId: string
  template: string
}

export function useTemplateModel({ templateId, template }: Props) {
  const queryClient = useQueryClient()
  const [templateModel, setTemplateModel] = useState(
    ContractConfigModel.fromRawJsonc(template ?? '{}'),
  )

  useEffect(() => {
    setTemplateModel(ContractConfigModel.fromRawJsonc(template ?? '{}'))
  }, [template])

  // ??
  const isDirty = useMemo(() => {
    return templateModel.diff(templateModel) ?? false
  }, [templateModel])

  const setIgnoreMethods = (methods: string[]) => {
    setTemplateModel(templateModel.setIgnoreMethods(methods))
  }
  const setIgnoreRelatives = (relatives: string[]) => {
    setTemplateModel(templateModel.setIgnoreRelatives(relatives))
  }
  const setIgnoreInWatchMode = (methods: string[]) => {
    setTemplateModel(templateModel.setIgnoreInWatchMode(methods))
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      await writeTemplateFile(templateId, templateString)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['template', templateId],
      })
    },
  })

  const hasDefinition = useCallback(
    (method: string) => {
      return templateModel.hasDefinition(method)
    },
    [templateModel],
  )

  const templateString = useMemo(() => {
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

    templateString,

    ignoreMethods: templateModel.ignoreMethods,
    ignoreRelatives: templateModel.ignoreRelatives,
    ignoreInWatchMode: templateModel.ignoreInWatchMode,
  }
}
