import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { readConfigFile, updateConfigFile } from '../../../api/api'
import type { ApiConfigFileResponse } from '../../../api/types'

import { ErrorState } from '../../../components/ErrorState'
import { EditorView } from '../../../components/editor/EditorView'
import type { EditorFile } from '../../../components/editor/store'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { formatJson } from '../../../utils/formatJson'
import { removeJSONTrailingCommas } from '../../../utils/removeJSONTrailingCommas'
import { useProjectData } from '../hooks/useProjectData'

export function ConfigPanel() {
  const { project, projectResponse } = useProjectData()
  const queryClient = useQueryClient()
  const templateResponse = useQuery({
    queryKey: ['projects', project, 'config'],
    queryFn: () => {
      return readConfigFile(project)
    },
  })

  const saveConfig = useMutation({
    mutationFn: async (content: string) => {
      await updateConfigFile(project, content)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', project, 'config'],
      })
    },
  })

  // TODO: move this to backend/editor or replace with gui
  const onSaveCallback = (content: string): string => {
    try {
      content = formatJson(JSON.parse(removeJSONTrailingCommas(content)))
    } catch {}

    saveConfig.mutate(content)

    return content
  }

  const files = useMemo(
    () => getConfigFiles(templateResponse, project),
    [templateResponse.data, project],
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
  configResponse: ReturnType<typeof useQuery<ApiConfigFileResponse | null>>,
  project: string,
): EditorFile[] {
  const data = configResponse.data

  if (!data) {
    return [
      {
        id: 'config',
        name: 'config.jsonc',
        content: '// No config files - no config response',
        language: 'json',
        readOnly: true,
      },
    ]
  }

  const sources: EditorFile[] = []

  if (data.config) {
    sources.push({
      id: `config-${project}`,
      name: 'config.jsonc',
      content: data.config,
      language: 'json',
      readOnly: IS_READONLY,
    })
  }

  return sources
}
