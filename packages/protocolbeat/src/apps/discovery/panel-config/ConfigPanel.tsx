import { useMemo } from 'react'

import { ErrorState } from '../../../components/ErrorState'
import { EditorView } from '../../../components/editor/EditorView'
import type { EditorFile } from '../../../components/editor/store'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { formatJson } from '../../../utils/formatJson'
import { removeJSONTrailingCommas } from '../../../utils/removeJSONTrailingCommas'
import {
  type ProjectConfigModels,
  useProjectConfigModels,
} from '../hooks/useProjectConfig'
import { useProjectData } from '../hooks/useProjectData'

export function ConfigPanel() {
  const { project, projectResponse } = useProjectData()
  const configModels = useProjectConfigModels()

  // TODO: move this to backend/editor or replace with gui
  const onSaveCallback = (content: string): string => {
    console.log('onSaveCallback - config', content)
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

  if (projectResponse.isError) {
    return <ErrorState />
  }

  if (projectResponse.isPending) {
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
  configModels: ProjectConfigModels,
): EditorFile[] {
  if (configModels.isLoading) {
    return [
      {
        id: 'config',
        name: 'config.jsonc',
        content: '// Loading',
        language: 'json',
        readOnly: true,
      },
    ]
  }

  const sources: EditorFile[] = []

  sources.push({
    id: `config-${project}`,
    name: 'config.jsonc',
    content: configModels.configModel.configString,
    language: 'json',
    readOnly: IS_READONLY,
  })

  return sources
}
