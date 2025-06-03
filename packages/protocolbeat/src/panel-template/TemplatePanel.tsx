import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getProject, readTemplateFile } from '../api/api'
import type { ApiProjectChain, ApiTemplateFileResponse } from '../api/types'
import type { EditorSupportedLanguage } from '../components/editor/editor'
import { usePanelStore } from '../store/store'
import { EditorView } from '../components/editor/EditorView'
import { useCodeStore } from '../components/editor/store'

const editorId = 'template-panel'

export function TemplatePanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const projectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const selectedAddress = usePanelStore((state) => state.selected)
  const setFiles = useCodeStore((state) => state.setFiles)
  const template = findTemplateId(
    projectResponse.data?.entries ?? [],
    selectedAddress,
  )

  const templateResponse = useQuery({
    queryKey: ['projects', project, 'template', template],
    queryFn: () => readTemplateFile(template),
    enabled: template !== undefined,
  })

  useEffect(() => {
    const sources = getSources(templateResponse.data)
    setFiles(editorId, sources)
  }, [templateResponse.data, setFiles])

  if (projectResponse.isError) {
    return <div>Error</div>
  }

  if (projectResponse.isPending) {
    return <div>Loading</div>
  }

  if (selectedAddress === undefined) {
    return <div>Select a contract</div>
  }

  return <EditorView editorId="template-panel" />
}

export function findTemplateId(
  chains: ApiProjectChain[],
  address: string | undefined,
): string | undefined {
  if (!address) {
    return
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
}

function getSources(response: ApiTemplateFileResponse | undefined) {
  const sources: {
    id: string
    name: string
    content: string
    readOnly: boolean
    language: EditorSupportedLanguage
  }[] = []

  if (response?.template) {
    sources.push({
      id: 'template',
      name: 'template.jsonc',
      content: response.template,
      language: 'json',
      readOnly: false,
    })
  }

  if (response?.shapes) {
    sources.push({
      id: 'shapes',
      name: 'shapes.json',
      content: response.shapes,
      language: 'json',
      readOnly: true,
    })
  }

  if (response?.criteria) {
    sources.push({
      id: 'criteria',
      name: 'criteria.json',
      content: response.criteria,
      language: 'json',
      readOnly: true,
    })
  }

  return sources
}
