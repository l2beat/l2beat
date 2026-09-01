import { useMemo } from 'react'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { ErrorState } from '../../../components/ErrorState'
import type { EditorSaveCallback } from '../../../components/editor/code/editor'
import type { EditorFile } from '../../../components/editor/store'
import { EditorView } from '../../../components/editor/views/EditorView'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { useConfigModels } from '../hooks/useConfigModels'
import { useProjectData } from '../hooks/useProjectData'

export function TemplatePanel() {
  const { selectedAddress } = useProjectData()
  const configModels = useConfigModels()
  const templateId = configModels.templateModel.templateId
  const templateContent = configModels.templateModel.files.template
  const shapesContent = configModels.templateModel.files.shapes
  const criteriaContent = configModels.templateModel.files.criteria

  const onSaveCallback: EditorSaveCallback = (content: string) => {
    configModels.templateModel.save(content)
    // No validation for now, we save either way
    return true
  }

  const files = useMemo<EditorFile[]>(
    () =>
      getTemplateFiles({
        templateId,
        templateContent,
        shapesContent,
        criteriaContent,
      }),
    [templateId, templateContent, shapesContent, criteriaContent],
  )

  if (configModels.isProjectError || configModels.isTemplateError) {
    return <ErrorState />
  }

  if (configModels.isProjectPending || configModels.isTemplatePending) {
    return <LoadingState />
  }

  if (selectedAddress === undefined) {
    return <ActionNeededState message="Select a contract" />
  }

  if (!templateId) {
    return <ActionNeededState message="No template files" />
  }

  return (
    <EditorView
      editorId="template-panel"
      files={files}
      callbacks={{ onSave: onSaveCallback }}
    />
  )
}

function getTemplateFiles({
  templateId,
  templateContent,
  shapesContent,
  criteriaContent,
}: {
  templateId: string | undefined
  templateContent: string
  shapesContent: string | undefined
  criteriaContent: string | undefined
}): EditorFile[] {
  if (!templateId) {
    return []
  }

  const sources: EditorFile[] = []

  sources.push({
    id: `template-${templateId}`,
    name: 'template.jsonc',
    content: templateContent,
    language: 'json',
    readOnly: IS_READONLY,
  })

  if (shapesContent) {
    sources.push({
      id: `shapes-${templateId}`,
      name: 'shapes.json',
      content: shapesContent,
      language: 'json',
      readOnly: true,
    })
  }

  if (criteriaContent) {
    sources.push({
      id: `criteria-${templateId}`,
      name: 'criteria.json',
      content: criteriaContent,
      language: 'json',
      readOnly: true,
    })
  }

  return sources
}
