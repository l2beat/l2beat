import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getProject, readTemplateFile } from '../api/api'
import { usePanelStore } from '../store/store'
import type { ApiProjectChain, ApiTemplateFileResponse } from '../api/types'
import clsx from 'clsx'
import { IconCodeFile } from '../icons/IconCodeFile'
import { CodeView } from '../components/editor/code-view'
import { useState, useEffect } from 'react'
import type { EditorSupportedLanguage } from '../components/editor/editor'

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
  const [fileIndex, setFileIndex] = useState(0)
  const template = findTemplateId(
    projectResponse.data?.entries ?? [],
    selectedAddress,
  )

  const templateResponse = useQuery({
    queryKey: ['projects', project, 'template', template],
    queryFn: () => readTemplateFile(template),
    enabled: template !== undefined,
  })

  const sources = getSources(templateResponse.data)

  useEffect(() => {
    setFileIndex(0)
  }, [template])

  return (
    <div className="flex h-full w-full select-none flex-col">
      <div className="flex flex-shrink-0 flex-grow gap-1 overflow-x-auto border-b border-b-coffee-600 px-1 pt-1">
        {sources.map((x, i) => (
          <button
            key={i}
            onClick={() => setFileIndex(i)}
            className={clsx(
              'flex h-6 items-center gap-1 px-2 text-sm',
              fileIndex === i && 'bg-autumn-300 text-black',
            )}
          >
            <IconCodeFile />
            {x.name}
          </button>
        ))}
      </div>
      <CodeView
        code={sources[fileIndex]?.code ?? 'No contents'}
        range={undefined}
        language={sources[fileIndex]?.language}
        editorKey="template-panel"
      />
    </div>
  )
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
    name: string
    code: string
    language?: EditorSupportedLanguage
  }[] = []

  if (response?.template) {
    sources.push({
      name: 'template.jsonc',
      code: response.template,
      language: 'json',
    })
  }

  if (response?.shapes) {
    sources.push({
      name: 'shapes.json',
      code: response.shapes,
      language: 'json',
    })
  }

  if (response?.criteria) {
    sources.push({
      name: 'criteria.json',
      code: response.criteria,
      language: 'json',
    })
  }

  return sources
}
