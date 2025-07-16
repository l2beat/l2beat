import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getFlatSource } from '../api/api'
import { Title } from '../common/Title'
import { ErrorState } from '../components/ErrorState'
import { EditorView } from '../components/editor/EditorView'
import { LoadingState } from '../components/LoadingState'

export function CodePage() {
  const { address } = useParams()
  if (!address) {
    throw new Error('Cannot use component outside of project page!')
  }

  const response = useQuery({
    queryKey: ['single-source', address],
    queryFn: () => getFlatSource(address),
  })

  if (response.isPending) {
    return <LoadingState />
  }

  if (response.isError) {
    return <ErrorState />
  }

  const files = [
    {
      id: address,
      name: response.data.name,
      content: getSource(response.data.sources),
      readOnly: true,
      language: 'solidity' as const,
    },
  ]

  return (
    <>
      <Title title={`Code - ${response.data.name} (${address})`} />
      <div className="flex h-full w-full select-none flex-col">
        <EditorView
          editorId="code-app"
          files={files}
          range={undefined}
          initialFileIndex={0}
          disableTabs
        />
      </div>
    </>
  )
}

function getSource(code: Record<string, string>): string {
  let source = ''

  for (const declarationName in code) {
    source += code[declarationName] + '\n\n'
  }

  return source.trim()
}
