import { useCallback, useMemo, useState } from 'react'
import type {
  DataColumnFormat,
  ReviewContentBlock,
  ReviewDataMetricBlock,
} from '../../../api/types'
import type { ImportDataBundle } from './reviewDataSources'
import {
  DATA_SOURCES,
  formatColumnValue,
  getDataSource,
  getDataSourcesForSection,
  isDataSourceAvailable,
} from './reviewDataSources'

type SectionKey = 'collaterals' | 'dependencies' | 'actors' | 'codeAndAudits'

interface DataMetricBlockEditorProps {
  block: ReviewDataMetricBlock
  onChange: (block: ReviewContentBlock) => void
  importData: ImportDataBundle
  isDataLoading: boolean
  sectionKey: SectionKey
}

export function DataMetricBlockEditor({
  block,
  onChange,
  importData,
  isDataLoading,
  sectionKey,
}: DataMetricBlockEditorProps) {
  const source = getDataSource(block.dataSource)
  const available = source ? isDataSourceAvailable(source, importData) : false

  // Resolve the current metric value for preview
  const resolvedValue = useMemo(() => {
    if (!source?.getMetricValue || !available) return undefined
    return source.getMetricValue(importData, block.field, {})
  }, [source, available, importData, block.field])

  // If no source selected yet, show picker
  if (!source) {
    return (
      <MetricSourcePicker
        sectionKey={sectionKey}
        importData={importData}
        isDataLoading={isDataLoading}
        onSelect={(sourceId, field, label, format) => {
          onChange({
            ...block,
            dataSource: sourceId,
            field,
            label,
            format,
          })
        }}
      />
    )
  }

  return (
    <div className="space-y-1">
      {/* Source + field info */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-coffee-200">
          Source:{' '}
          <span className="font-medium text-coffee-100">{source.label}</span>
        </span>
        <span className="text-xs text-coffee-400">/</span>
        <span className="text-xs text-coffee-200">
          {source.availableMetrics.find((m) => m.field === block.field)
            ?.label ?? block.field}
        </span>
      </div>

      {/* Live preview */}
      {available && resolvedValue !== undefined && (
        <div className="rounded border border-coffee-700 bg-coffee-800/30 px-2 py-1">
          <span className="text-xs text-coffee-400">{block.label}: </span>
          <span className="text-xs font-medium text-coffee-100">
            {formatColumnValue(resolvedValue, block.format)}
          </span>
        </div>
      )}
      {!available && (
        <span className="text-xs text-red-400">Data unavailable</span>
      )}

      {/* Editable fields */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <label className="text-xs text-coffee-200">Label:</label>
          <input
            type="text"
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            className="w-32 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-coffee-200">Metric:</label>
          <select
            value={block.field}
            onChange={(e) => {
              const metric = source.availableMetrics.find(
                (m) => m.field === e.target.value,
              )
              onChange({
                ...block,
                field: e.target.value,
                format: metric?.format ?? block.format,
              })
            }}
            className="rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          >
            {source.availableMetrics.map((m) => (
              <option key={m.field} value={m.field}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-coffee-200">Format:</label>
          <select
            value={block.format}
            onChange={(e) =>
              onChange({ ...block, format: e.target.value as DataColumnFormat })
            }
            className="rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          >
            <option value="usd">USD</option>
            <option value="number">Number</option>
            <option value="percent">Percent</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>

      <button
        onClick={() =>
          onChange({ ...block, dataSource: '', field: '', label: '' })
        }
        className="text-xs text-coffee-400 hover:text-autumn-300"
      >
        Change source...
      </button>
    </div>
  )
}

// ============================================================================
// Metric Source Picker
// ============================================================================

function MetricSourcePicker({
  sectionKey,
  importData,
  isDataLoading,
  onSelect,
}: {
  sectionKey: SectionKey
  importData: ImportDataBundle
  isDataLoading: boolean
  onSelect: (
    sourceId: string,
    field: string,
    label: string,
    format: DataColumnFormat,
  ) => void
}) {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)

  const sectionSources = getDataSourcesForSection(sectionKey)
  const otherSources = DATA_SOURCES.filter((ds) => !sectionSources.includes(ds))
  const allSources = [...sectionSources, ...otherSources]

  // Filter to sources that have metrics
  const sourcesWithMetrics = allSources.filter(
    (ds) => ds.availableMetrics.length > 0,
  )

  if (selectedSourceId) {
    const source = getDataSource(selectedSourceId)
    if (source) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-coffee-300">
              Select metric from{' '}
              <span className="font-medium text-coffee-100">
                {source.label}
              </span>
              :
            </span>
            <button
              onClick={() => setSelectedSourceId(null)}
              className="text-xs text-coffee-400 hover:text-autumn-300"
            >
              Back
            </button>
          </div>
          <div className="space-y-0.5">
            {source.availableMetrics.map((metric) => {
              const available = isDataSourceAvailable(source, importData)
              const value =
                available && source.getMetricValue
                  ? source.getMetricValue(importData, metric.field, {})
                  : undefined

              return (
                <button
                  key={metric.field}
                  onClick={() =>
                    onSelect(
                      source.id,
                      metric.field,
                      metric.label,
                      metric.format,
                    )
                  }
                  disabled={isDataLoading || !available}
                  className="flex w-full items-center gap-2 rounded border border-coffee-700 bg-coffee-800 px-2 py-1.5 text-left hover:border-autumn-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-xs font-medium text-coffee-100">
                    {metric.label}
                  </span>
                  {value !== undefined && (
                    <span className="text-xs text-coffee-400">
                      ({formatColumnValue(value, metric.format)})
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-1">
      <span className="text-xs text-coffee-300">
        Select a data source for the metric:
      </span>
      <div className="space-y-0.5">
        {sourcesWithMetrics.map((ds) => {
          const available = isDataSourceAvailable(ds, importData)
          return (
            <button
              key={ds.id}
              onClick={() => setSelectedSourceId(ds.id)}
              disabled={isDataLoading || !available}
              className="flex w-full items-center gap-2 rounded border border-coffee-700 bg-coffee-800 px-2 py-1.5 text-left hover:border-autumn-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="flex-1">
                <span className="text-xs font-medium text-coffee-100">
                  {ds.label}
                </span>
                <span className="ml-2 text-xs text-coffee-400">
                  {ds.availableMetrics.length}{' '}
                  {ds.availableMetrics.length === 1 ? 'metric' : 'metrics'}
                </span>
              </div>
              {!available && (
                <span className="text-xs text-red-400">No data</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
