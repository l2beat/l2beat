import { useMemo } from 'react'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { ErrorState } from '../../../components/ErrorState'
import type { EditorSaveCallback } from '../../../components/editor/code/editor'
import type { EditorFile } from '../../../components/editor/store'
import { EditorView } from '../../../components/editor/views/EditorView'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { IconShape } from '../../../icons/IconShape'
import { useConfigModels } from '../hooks/useConfigModels'
import { useProjectData } from '../hooks/useProjectData'
import { TemplateDialog } from '../panel-values/template-dialog/TemplateDialog'
import { canAddShape, getAddressesToCopy } from '../panel-values/ValuesPanel'

export function TemplatePanel() {
  const { selectedAddress, selected, project } = useProjectData()
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
    return <NoTemplate project={project} selected={selected} />
  }

  return (
    <EditorView
      editorId="template-panel"
      files={files}
      callbacks={{ onSave: onSaveCallback }}
    />
  )
}

function NoTemplate({
  project,
  selected,
}: {
  project: string
  selected: ReturnType<typeof useProjectData>['selected']
}) {
  const canCreate =
    !IS_READONLY &&
    selected !== undefined &&
    'address' in selected &&
    'chain' in selected &&
    'blockNumber' in selected &&
    canAddShape(selected)

  if (!canCreate) {
    return <ActionNeededState message="No template files" />
  }

  const addresses = getAddressesToCopy(selected)
  if (!addresses) {
    return <ActionNeededState message="No template files" />
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-3 p-4 text-center">
      <div className="font-mono text-coffee-400 text-sm italic">
        This contract has no template yet.
      </div>
      <TemplateDialog.Root
        key={`${project}-${selected.address}`}
        project={project}
        selectedName={selected.name}
      >
        <TemplateDialog.Trigger className="gap-2 px-3 py-2">
          <span className="flex items-center gap-2">
            <IconShape />
            Create template
          </span>
        </TemplateDialog.Trigger>
        <TemplateDialog.Body
          addresses={addresses}
          project={project}
          chain={selected.chain}
          blockNumber={selected.blockNumber}
        />
      </TemplateDialog.Root>
      <div className="max-w-sm text-coffee-500 text-xs">
        Creates a new template from this contract's source. Re-run discovery
        afterwards for it to be applied.
      </div>
    </div>
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
