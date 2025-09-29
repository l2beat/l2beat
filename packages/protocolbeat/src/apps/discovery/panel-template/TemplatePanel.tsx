import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { readTemplateFile, writeTemplateFile } from '../../../api/api'
import type {
  ApiProjectChain,
  ApiTemplateFileResponse,
} from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { ErrorState } from '../../../components/ErrorState'
import { EditorView } from '../../../components/editor/EditorView'
import type { EditorFile } from '../../../components/editor/store'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { formatJson } from '../../../utils/formatJson'
import { removeJSONTrailingCommas } from '../../../utils/removeJSONTrailingCommas'
import { useProjectData } from '../hooks/useProjectData'

export function TemplatePanel() {
  const { project, selectedAddress, projectResponse } = useProjectData()
  const queryClient = useQueryClient()

  const template = useMemo(
    () => findTemplateId(projectResponse.data?.entries ?? [], selectedAddress),
    [projectResponse.data?.entries, selectedAddress],
  )

  const templateResponse = useQuery({
    queryKey: ['projects', project, 'template', template, selectedAddress],
    queryFn: () => {
      if (!template) {
        return null
      }
      return readTemplateFile(template)
    },
    enabled: template !== undefined,
  })

  const saveTemplate = useMutation({
    mutationFn: async (content: string) => {
      if (!template) {
        return content
      }

      await writeTemplateFile(template, content)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', project, 'template', template, selectedAddress],
      })
    },
  })

  // TODO: move this to backend/editor or replace with gui
  const onSaveCallback = (content: string): string => {
    try {
      content = formatJson(JSON.parse(removeJSONTrailingCommas(content)))
    } catch {}

    saveTemplate.mutate(content)

    return content
  }

  const files = useMemo(
    () => getTemplateFiles(templateResponse, selectedAddress),
    [templateResponse.data, selectedAddress],
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
      editorId="template-panel"
      files={files}
      callbacks={{ onSave: onSaveCallback }}
    />
  )
}

function findTemplateId(
  chains: ApiProjectChain[],
  address: string | undefined,
): string | undefined {
  if (!address) {
    return undefined
  }

  for (const chain of chains) {
    for (const contract of chain.initialContracts) {
      if (contract.address === address) {
        return contract.template?.id
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return contract.template?.id
      }
    }
  }
  return undefined
}

function getTemplateFiles(
  templateResponse: ReturnType<typeof useQuery<ApiTemplateFileResponse | null>>,
  selectedAddress: string | undefined,
): EditorFile[] {
  if (!selectedAddress) {
    return []
  }

  const data = templateResponse.data

  if (!data) {
    return [
      {
        id: 'template',
        name: 'template.jsonc',
        content: '// No template files - no template response',
        language: 'json',
        readOnly: true,
      },
    ]
  }

  const sources: EditorFile[] = []

  if (data.template) {
    sources.push({
      id: `template-${selectedAddress}`,
      name: 'template.jsonc',
      content: data.template,
      language: 'json',
      readOnly: IS_READONLY,
    })
  }

  if (data.shapes) {
    sources.push({
      id: `shapes-${selectedAddress}`,
      name: 'shapes.json',
      content: data.shapes,
      language: 'json',
      readOnly: true,
    })
  }

  if (data.criteria) {
    sources.push({
      id: `criteria-${selectedAddress}`,
      name: 'criteria.json',
      content: data.criteria,
      language: 'json',
      readOnly: true,
    })
  }

  return sources
}
