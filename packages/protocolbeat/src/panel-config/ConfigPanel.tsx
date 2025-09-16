import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { readConfigFile, updateConfigFile } from '../api/api'
import type { ApiConfigFileResponse } from '../api/types'
import { formatJson } from '../common/formatJson'
import { removeJSONTrailingCommas } from '../common/removeJSONTrailingCommas'
import { ActionNeededState } from '../components/ActionNeededState'
import { ErrorState } from '../components/ErrorState'
import { EditorView } from '../components/editor/EditorView'
import type { EditorFile } from '../components/editor/store'
import { LoadingState } from '../components/LoadingState'
import { isReadOnly } from '../config'
import { useProjectData } from '../hooks/useProjectData'

export function ConfigPanel() {
  const { project, selectedAddress, projectResponse } = useProjectData()
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
        queryKey: ['projects', project, 'template', selectedAddress],
      })
    },
  })

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

  if (selectedAddress === undefined) {
    return <ActionNeededState message="Select a contract" />
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
      readOnly: isReadOnly,
    })
  }

  return sources
}
