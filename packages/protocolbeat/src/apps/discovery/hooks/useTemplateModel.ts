import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { writeTemplateFile } from '../../../api/api'
import { formatJson } from '../../../utils/formatJson'
import { toggleInList } from '../../../utils/toggleInList'
import { ContractConfigModel } from '../components/ConfigModel'

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

  const toggleIgnoreMethods = (fieldName: string) => {
    const current = templateModel.ignoreMethods ?? []
    const updated = toggleInList(fieldName, current)
    const newModel = templateModel.setIgnoreMethods(updated)
    setTemplateModel(newModel)
    saveModelContents(newModel)
  }

  const toggleIgnoreRelatives = (fieldName: string) => {
    const current = templateModel.ignoreRelatives ?? []
    const updated = toggleInList(fieldName, current)
    const newModel = templateModel.setIgnoreRelatives(updated)
    setTemplateModel(newModel)
    saveModelContents(newModel)
  }

  const toggleIgnoreInWatchMode = (fieldName: string) => {
    const current = templateModel.ignoreInWatchMode ?? []
    const updated = toggleInList(fieldName, current)
    const newModel = templateModel.setIgnoreInWatchMode(updated)
    setTemplateModel(newModel)
    saveModelContents(newModel)
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

  const saveModelContents = (model: ContractConfigModel) => {
    if (model.hasComments()) {
      saveMutation.mutate(model.toString())
    } else {
      saveMutation.mutate(formatJson(model.peek()))
    }
  }

  const saveRaw = useCallback(
    (content: string) => {
      const newModel = ContractConfigModel.fromRawJsonc(content)
      setTemplateModel(newModel)
      saveModelContents(newModel)
    },
    [templateId],
  )

  const templateString = useMemo(() => {
    return templateModel.toString()
  }, [templateModel])

  return {
    templateModel,
    toggleIgnoreMethods,
    toggleIgnoreRelatives,
    toggleIgnoreInWatchMode,

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
