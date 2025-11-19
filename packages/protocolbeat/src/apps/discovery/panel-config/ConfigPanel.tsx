import { useMemo } from 'react'

import { ErrorState } from '../../../components/ErrorState'
import type { EditorFile } from '../../../components/editor/store'
import { EditorView } from '../../../components/editor/views/EditorView'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { formatJson } from '../../../utils/formatJson'
import { removeJSONTrailingCommas } from '../../../utils/removeJSONTrailingCommas'
import { type ConfigModels, useConfigModels } from '../hooks/useConfigModels'
import { useProjectData } from '../hooks/useProjectData'

export function ConfigPanel() {
  const { project } = useProjectData()
  const configModels = useConfigModels()

  // TODO: move this to backend/editor or replace with gui
  const onSaveCallback = (content: string): string => {
    try {
      content = formatJson(JSON.parse(removeJSONTrailingCommas(content)))
    } catch {}

    configModels.configModel.save(content)

    return content
  }

  const files = useMemo(
    () => getConfigFiles(project, configModels),
    [project, configModels],
  )

  if (configModels.isError) {
    return <ErrorState />
  }

  if (configModels.isPending) {
    return <LoadingState />
  }

  return (
    <EditorView
      editorId="config-panel"
      files={files}
      callbacks={{ onSave: onSaveCallback }}
    />
  )
}

function getConfigFiles(
  project: string,
  { configModel }: ConfigModels,
): EditorFile[] {
  const sources: EditorFile[] = []

  sources.push({
    id: `config-${project}`,
    name: 'config.jsonc',
    content: configModel.files.config,
    language: 'json',
    readOnly: IS_READONLY,
  })

  return sources
}
