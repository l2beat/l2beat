import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { writeTemplateFile } from '../../../api/api'
import { ContractConfigModel } from './ConfigModel'

type Props = {
  project: string
  templateId?: string
  files: {
    template: string
    shapes?: string
    criteria?: string
  }
}

export function useTemplateModel({ templateId, files }: Props) {
  const queryClient = useQueryClient()
  const [templateModel, setTemplateModel] = useState(
    ContractConfigModel.fromRawJsonc(files.template),
  )

  useEffect(() => {
    setTemplateModel(ContractConfigModel.fromRawJsonc(files.template))
  }, [files.template])

  const setIgnoreMethods = (methods: string[]) => {
    const newModel = templateModel.setIgnoreMethods(methods)
    setTemplateModel(newModel)
    saveMutation.mutate(newModel.toString())
  }
  const setIgnoreRelatives = (relatives: string[]) => {
    const newModel = templateModel.setIgnoreRelatives(relatives)
    setTemplateModel(newModel)
    saveMutation.mutate(newModel.toString())
  }
  const setIgnoreInWatchMode = (methods: string[]) => {
    const newModel = templateModel.setIgnoreInWatchMode(methods)
    setTemplateModel(newModel)
    saveMutation.mutate(newModel.toString())
  }

  const saveMutation = useMutation({
    mutationFn: async (content?: string) => {
      if (!templateId) {
        return
      }
      await writeTemplateFile(templateId, content ? content : templateString)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['template', templateId],
      })
    },
  })

  const saveRaw = useCallback(
    (content: string) => {
      const newModel = ContractConfigModel.fromRawJsonc(content)
      setTemplateModel(newModel)
      saveMutation.mutate(newModel.toString())
    },
    [templateId],
  )

  const templateString = useMemo(() => {
    return templateModel.toString()
  }, [templateModel])

  return {
    templateModel,
    setIgnoreMethods,
    setIgnoreRelatives,
    setIgnoreInWatchMode,

    save: saveRaw,

    hasTemplate: templateId,

    files: {
      template: templateString,
      shapes: files.shapes,
      criteria: files.criteria,
    },

    ignoreMethods: templateModel.ignoreMethods,
    ignoreRelatives: templateModel.ignoreRelatives,
    ignoreInWatchMode: templateModel.ignoreInWatchMode,
  }
}
