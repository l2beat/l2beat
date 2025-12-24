import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { writeTemplateFile } from '../../../api/api'
import { useDebouncedCallback } from '../../../utils/debounce'
import { formatJson } from '../../../utils/formatJson'
import { removeJSONTrailingCommas } from '../../../utils/removeJSONTrailingCommas'
import { toggleInList } from '../../../utils/toggleInList'
import { ContractConfigModel } from '../models/ContractConfigModel'
import type { FieldConfigModel } from '../models/FieldConfigModel'

type Props = {
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

  const debouncedInvalidateSyncStatus = useDebouncedCallback(() =>
    queryClient.invalidateQueries({
      queryKey: ['config-sync-status'],
    }),
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

  const setFieldSeverity = (
    fieldName: string,
    severity: 'HIGH' | 'LOW' | undefined,
  ) => {
    const newModel = templateModel.setFieldSeverity(fieldName, severity)
    setTemplateModel(newModel)
    saveModelContents(newModel)
  }

  const getFieldSeverity = (fieldName: string) => {
    return templateModel.getFieldSeverity(fieldName)
  }

  const setCategory = (category: string | undefined) => {
    const newModel = templateModel.setCategory(category)
    setTemplateModel(newModel)
    saveModelContents(newModel)
  }

  const setDescription = (description: string | undefined) => {
    const newModel = templateModel.setDescription(description)
    setTemplateModel(newModel)
    saveModelContents(newModel)
  }

  const getFieldDescription = (fieldName: string) => {
    return templateModel.getFieldDescription(fieldName)
  }

  const setFieldDescription = (
    fieldName: string,
    description: string | undefined,
  ) => {
    const newModel = templateModel.setFieldDescription(fieldName, description)
    setTemplateModel(newModel)
    saveModelContents(newModel)
  }

  const setFieldHandler = (
    fieldName: string,
    handler: FieldConfigModel['handler'],
  ) => {
    const newModel = templateModel.setFieldHandler(fieldName, handler)
    setTemplateModel(newModel)
    saveModelContents(newModel)
  }

  const getFieldHandler = (fieldName: string) => {
    return templateModel.getFieldHandler(fieldName)
  }

  const getFieldHandlerString = (fieldName: string) => {
    return templateModel.getFieldHandlerString(fieldName)
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
        queryKey: ['templates', templateId],
      })
      debouncedInvalidateSyncStatus()
    },
    onError: (error) => {
      toast.error(`Failed to save template file - ${templateId}`, {
        description: <pre>{error.message}</pre>,
      })
    },
  })

  const saveModelContents = (model: ContractConfigModel) => {
    const stringifiedModel = model.toString()
    const toSave = model.hasComments()
      ? stringifiedModel
      : formatJson(JSON.parse(removeJSONTrailingCommas(stringifiedModel)))
    saveMutation.mutate(toSave)
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

  const isInSync = useMemo(() => {
    return !templateModel.diff(
      ContractConfigModel.fromRawJsonc(files.template ?? '{}'),
    )
  }, [templateModel, files.template])

  return {
    templateModel,
    toggleIgnoreMethods,
    toggleIgnoreRelatives,
    toggleIgnoreInWatchMode,
    setFieldSeverity,
    getFieldSeverity,
    getFieldDescription,
    setFieldDescription,
    setFieldHandler,
    getFieldHandler,
    getFieldHandlerString,
    setCategory,
    setDescription,

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
    category: templateModel.category,
    description: templateModel.description,

    isInSync,
    isSyncPending: saveMutation.isPending,
    isSyncError: saveMutation.isError,
  }
}
