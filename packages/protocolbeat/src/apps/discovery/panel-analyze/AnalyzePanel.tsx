import type { AnalyzerResultApiResponse } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo, useState } from 'react'
import { getAnalyzers, getCode, runAnalyzer } from '../../../api/api'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { Button } from '../../../components/Button'
import { Checkbox } from '../../../components/Checkbox'
import { ErrorState } from '../../../components/ErrorState'
import { Loader } from '../../../components/Loader'
import { LoadingState } from '../../../components/LoadingState'
import { Markdown } from '../../../components/Markdown'
import { Select } from '../../../components/Select'
import { IconPlay } from '../../../icons/IconPlay'
import { IconRefresh } from '../../../icons/IconRefresh'
import { useProjectData } from '../hooks/useProjectData'
import { getDefaultSourceName, hasSourceCode } from '../utils/sourceCode'

export function AnalyzePanel() {
  const { project, selectedAddress, projectResponse, selected } =
    useProjectData()

  const hasCode = hasSourceCode(selected)

  const codeResponse = useQuery({
    queryKey: ['projects', project, 'code', selectedAddress],
    enabled: selectedAddress !== undefined && hasCode,
    queryFn: () => {
      if (!selectedAddress) {
        throw new Error('Selected address is required')
      }
      return getCode(project, selectedAddress)
    },
    retry: 1,
  })

  const analyzersResponse = useQuery({
    queryKey: ['analyzers'],
    queryFn: getAnalyzers,
    retry: 1,
  })

  const [preferredAnalyzer, setPreferredAnalyzer] = useState<string>()
  const [preferredSource, setPreferredSource] = useState<string>()
  const [wrapText, setWrapText] = useState(true)
  const [hasRun, setHasRun] = useState(false)

  const sources = codeResponse.data?.sources ?? []
  const analyzers = analyzersResponse.data ?? []

  const selectedSource = useMemo(
    () =>
      sources.some((source) => source.name === preferredSource)
        ? preferredSource
        : getDefaultSourceName(sources),
    [preferredSource, sources],
  )

  const selectedAnalyzer = useMemo(
    () =>
      analyzers.some((analyzer) => analyzer.id === preferredAnalyzer)
        ? preferredAnalyzer
        : analyzers[0]?.id,
    [preferredAnalyzer, analyzers],
  )

  const selectedAnalyzerDetails = useMemo(
    () => analyzers.find((analyzer) => analyzer.id === selectedAnalyzer),
    [analyzers, selectedAnalyzer],
  )

  const canRun =
    selectedAddress !== undefined &&
    selectedAnalyzer !== undefined &&
    selectedSource !== undefined &&
    !codeResponse.isPending

  const analyzeQuery = useQuery({
    queryKey: [
      'analyze',
      project,
      selectedAddress,
      selectedAnalyzer,
      selectedSource,
    ],
    enabled: hasRun && canRun,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => {
      if (!selectedAddress || !selectedAnalyzer || !selectedSource) {
        throw new Error('Analyzer input is required')
      }
      return runAnalyzer(
        project,
        selectedAddress,
        selectedAnalyzer,
        selectedSource,
      )
    },
  })

  if (projectResponse.isError) {
    return <ErrorState />
  }

  if (projectResponse.isPending) {
    return <LoadingState />
  }

  if (selected === undefined) {
    return <ActionNeededState message="Select a contract" />
  }

  if (!hasCode) {
    return <ActionNeededState message="Selected entry has no code" />
  }

  return (
    <div className="flex h-full select-none flex-col gap-3 p-3 text-coffee-200">
      <Field label="Analyzer">
        <div className="flex items-stretch gap-1">
          <Select.Root
            value={selectedAnalyzer}
            onValueChange={setPreferredAnalyzer}
            disabled={analyzers.length === 0}
          >
            <Select.Trigger
              placeholder={
                analyzersResponse.isFetching
                  ? 'Loading analyzers...'
                  : 'Select analyzer'
              }
            />
            <Select.Content>
              {analyzers.map((analyzer) => (
                <Select.Item key={analyzer.id} value={analyzer.id}>
                  {analyzer.title}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button
            size="small"
            title="Refresh analyzers"
            disabled={analyzersResponse.isFetching}
            onClick={() => analyzersResponse.refetch()}
          >
            <IconRefresh
              className={
                analyzersResponse.isFetching ? 'animate-spin' : undefined
              }
            />
          </Button>
        </div>
        {analyzersResponse.isError && (
          <p className="text-aux-red text-xs">
            {analyzersResponse.error.message}
          </p>
        )}
        {selectedAnalyzerDetails?.description && (
          <p className="text-coffee-400 text-xs leading-relaxed">
            {selectedAnalyzerDetails.description}
          </p>
        )}
      </Field>

      <Field label="Entrypoint">
        <div className="flex items-stretch gap-1">
          <Select.Root
            value={selectedSource}
            onValueChange={setPreferredSource}
            disabled={sources.length === 0 || codeResponse.isPending}
          >
            <Select.Trigger placeholder="Select entrypoint" />
            <Select.Content>
              {sources.map((source) => (
                <Select.Item key={source.name} value={source.name}>
                  {source.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button
            size="small"
            variant="solid"
            title="Run analyzer"
            disabled={!canRun || analyzeQuery.isFetching}
            onClick={() => {
              if (!selectedAddress || !selectedAnalyzer || !selectedSource) {
                return
              }
              setHasRun(true)
              analyzeQuery.refetch()
            }}
          >
            <IconPlay />
          </Button>
        </div>
        {codeResponse.isError && (
          <p className="text-aux-red text-xs">Failed to load code</p>
        )}
      </Field>

      <Field
        label="Result"
        className="min-h-0 flex-1"
        actions={
          <div
            className="flex cursor-pointer items-center gap-1 text-coffee-400 text-xs"
            onClick={() => setWrapText(!wrapText)}
          >
            <Checkbox checked={wrapText} />
            Wrap text
          </div>
        }
      >
        <div className="min-h-0 flex-1 select-text overflow-auto border border-coffee-600 bg-coffee-800 p-2">
          {hasRun ? (
            <ResultView
              isPending={analyzeQuery.isFetching || codeResponse.isPending}
              result={analyzeQuery.data}
              error={analyzeQuery.error}
              wrap={wrapText}
            />
          ) : (
            <p className="text-coffee-400 text-xs italic">
              Run an analyzer to see its result here.
            </p>
          )}
        </div>
      </Field>
    </div>
  )
}

function Field(props: {
  label: string
  className?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-1 ${props.className ?? ''}`}>
      <div className="flex items-center justify-between">
        <div className="font-bold text-coffee-400 text-xs uppercase">
          {props.label}
        </div>
        {props.actions}
      </div>
      {props.children}
    </div>
  )
}

function ResultView(props: {
  isPending: boolean
  result: AnalyzerResultApiResponse | undefined
  error: Error | null
  wrap: boolean
}) {
  const wrapClass = props.wrap
    ? 'whitespace-pre-wrap break-all'
    : 'whitespace-pre'

  if (props.isPending) {
    return (
      <div className="flex items-center gap-2 text-coffee-400 text-xs">
        <Loader />
        Running analyzer...
      </div>
    )
  }

  if (props.error) {
    return (
      <pre className={`${wrapClass} font-mono text-aux-red text-xs`}>
        {props.error.message}
      </pre>
    )
  }

  if (!props.result) {
    return null
  }

  if (props.result.status === 'error') {
    return (
      <pre className={`${wrapClass} font-mono text-aux-red text-xs`}>
        {props.result.error.message}
        {props.result.error.details
          ? `\n\n${JSON.stringify(props.result.error.details, null, 2)}`
          : ''}
      </pre>
    )
  }

  return (
    <Markdown className="text-coffee-200 text-sm leading-relaxed">
      {props.result.output.text}
    </Markdown>
  )
}
