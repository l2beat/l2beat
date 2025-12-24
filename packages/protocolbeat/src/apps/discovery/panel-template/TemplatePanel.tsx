import { useMemo } from 'react'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { ErrorState } from '../../../components/ErrorState'
import type { EditorSaveCallback } from '../../../components/editor/code/editor'
import type { EditorFile } from '../../../components/editor/store'
import { EditorView } from '../../../components/editor/views/EditorView'
import { LoadingState } from '../../../components/LoadingState'
import { type ConfigModels, useConfigModels } from '../hooks/useConfigModels'
import { useProjectData } from '../hooks/useProjectData'

export function TemplatePanel() {
  const { selectedAddress } = useProjectData()
  const configModels = useConfigModels()

  const onSaveCallback: EditorSaveCallback = (content: string) => {
    configModels.templateModel.save(content)
    // No validation for now, we save either way
    return true
  }

  const files = useMemo(
    () => getTemplateFiles(configModels, selectedAddress),
    [configModels, selectedAddress],
  )

  if (configModels.isError) {
    return <ErrorState />
  }

  if (configModels.isPending) {
    return <LoadingState />
  }

  if (selectedAddress === undefined) {
    return <ActionNeededState message="Select a contract" />
  }

  if (!configModels.templateModel.hasTemplate) {
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

function getTemplateFiles(
  { templateModel }: ConfigModels,
  selectedAddress: string | undefined,
): EditorFile[] {
  if (!selectedAddress) {
    return []
  }

  const sources: EditorFile[] = []

  sources.push({
    id: 'template',
    name: 'template.jsonc',
    content: templateModel.files.template,
    language: 'json',
    readOnly: false,
  })

  if (templateModel.files.shapes) {
    sources.push({
      id: 'shapes',
      name: 'shapes.json',
      content: templateModel.files.shapes,
      language: 'json',
      readOnly: true,
    })
  }

  if (templateModel.files.criteria) {
    sources.push({
      id: 'criteria',
      name: 'criteria.json',
      content: templateModel.files.criteria,
      language: 'json',
      readOnly: true,
    })
  }

  return sources
}
