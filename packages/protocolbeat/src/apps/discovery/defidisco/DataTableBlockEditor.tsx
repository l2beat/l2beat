import { useCallback, useMemo, useState } from 'react'
import type {
  DataTableColumn,
  ReviewDataTableBlock,
  ReviewContentBlock,
} from '../../../api/types'
import type { ImportDataBundle } from './reviewDataSources'
import {
  DATA_SOURCES,
  formatColumnValue,
  getDataSource,
  getDataSourcesForSection,
  getDefaultColumns,
  getDefaultFilters,
  isDataSourceAvailable,
  resolveFieldValue,
} from './reviewDataSources'

type SectionKey = 'collaterals' | 'dependencies' | 'actors' | 'codeAndAudits'

interface DataTableBlockEditorProps {
  block: ReviewDataTableBlock
  onChange: (block: ReviewContentBlock) => void
  importData: ImportDataBundle
  isDataLoading: boolean
  sectionKey: SectionKey
}

export function DataTableBlockEditor({
  block,
  onChange,
  importData,
  isDataLoading,
  sectionKey,
}: DataTableBlockEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const source = getDataSource(block.dataSource)
  const available = source ? isDataSourceAvailable(source, importData) : false

  const items = useMemo(() => {
    if (!source || !available) return []
    return source.getItems(importData, block.filters ?? {})
  }, [source, available, importData, block.filters])

  if (!source) {
    return (
      <DataSourcePicker
        sectionKey={sectionKey}
        importData={importData}
        isDataLoading={isDataLoading}
        onSelect={(sourceId) => {
          const selectedSource = getDataSource(sourceId)
          if (!selectedSource) return
          onChange({
            ...block,
            dataSource: sourceId,
            columns: getDefaultColumns(selectedSource),
            filters: getDefaultFilters(selectedSource, sectionKey),
          })
        }}
      />
    )
  }

  return (
    <div className="space-y-1">
      {/* Source info bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-coffee-200">
          Source:{' '}
          <span className="font-medium text-coffee-100">{source.label}</span>
        </span>
        {isDataLoading ? (
          <span className="text-xs text-coffee-400">Loading...</span>
        ) : !available ? (
          <span className="text-xs text-red-400">Data unavailable</span>
        ) : (
          <span className="text-xs text-coffee-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
        <div className="flex-1" />
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-xs text-coffee-400 hover:text-autumn-300"
        >
          {showConfig ? 'Hide config' : 'Configure'}
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs text-coffee-400 hover:text-autumn-300"
          disabled={!available}
        >
          {showPreview ? 'Hide preview' : 'Preview'}
        </button>
      </div>

      {/* Configuration panel */}
      {showConfig && (
        <ConfigPanel
          block={block}
          source={source}
          sectionKey={sectionKey}
          onChange={onChange}
        />
      )}

      {/* Live preview */}
      {showPreview && available && (
        <PreviewTable items={items} columns={block.columns} />
      )}
    </div>
  )
}

// ============================================================================
// Data Source Picker (shown when no source is selected yet)
// ============================================================================

function DataSourcePicker({
  sectionKey,
  importData,
  isDataLoading,
  onSelect,
}: {
  sectionKey: SectionKey
  importData: ImportDataBundle
  isDataLoading: boolean
  onSelect: (sourceId: string) => void
}) {
  const sources = getDataSourcesForSection(sectionKey)
  // Also show all sources that aren't section-specific
  const allSources = DATA_SOURCES.filter((ds) => !sources.includes(ds))

  return (
    <div className="space-y-1">
      <span className="text-xs text-coffee-300">Select a data source:</span>
      <div className="space-y-1">
        {sources.length > 0 && (
          <div className="space-y-0.5">
            <span className="text-xs text-coffee-400">
              Recommended for this section:
            </span>
            {sources.map((ds) => (
              <SourceOption
                key={ds.id}
                source={ds}
                importData={importData}
                isDataLoading={isDataLoading}
                onSelect={() => onSelect(ds.id)}
              />
            ))}
          </div>
        )}
        {allSources.length > 0 && (
          <div className="space-y-0.5">
            <span className="text-xs text-coffee-400">Other sources:</span>
            {allSources.map((ds) => (
              <SourceOption
                key={ds.id}
                source={ds}
                importData={importData}
                isDataLoading={isDataLoading}
                onSelect={() => onSelect(ds.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SourceOption({
  source,
  importData,
  isDataLoading,
  onSelect,
}: {
  source: (typeof DATA_SOURCES)[number]
  importData: ImportDataBundle
  isDataLoading: boolean
  onSelect: () => void
}) {
  const available = isDataSourceAvailable(source, importData)
  const itemCount = useMemo(() => {
    if (!available) return 0
    return source.getItems(importData, {}).length
  }, [source, available, importData])

  return (
    <button
      onClick={onSelect}
      disabled={isDataLoading || !available}
      className="flex w-full items-center gap-2 rounded border border-coffee-700 bg-coffee-800 px-2 py-1.5 text-left hover:border-autumn-300 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <div className="flex-1">
        <span className="text-xs font-medium text-coffee-100">
          {source.label}
        </span>
        <span className="ml-2 text-xs text-coffee-400">
          {source.description}
        </span>
      </div>
      {available ? (
        <span className="text-xs text-coffee-400">{itemCount} items</span>
      ) : (
        <span className="text-xs text-red-400">No data</span>
      )}
    </button>
  )
}

// ============================================================================
// Configuration Panel (columns + filters)
// ============================================================================

function ConfigPanel({
  block,
  source,
  sectionKey,
  onChange,
}: {
  block: ReviewDataTableBlock
  source: ReturnType<typeof getDataSource> & object
  sectionKey: SectionKey
  onChange: (block: ReviewContentBlock) => void
}) {
  const selectedFields = new Set(block.columns.map((c) => c.field))

  const toggleColumn = useCallback(
    (col: { field: string; header: string; format?: string }) => {
      const isSelected = selectedFields.has(col.field)
      let newColumns: DataTableColumn[]
      if (isSelected) {
        newColumns = block.columns.filter((c) => c.field !== col.field)
      } else {
        newColumns = [
          ...block.columns,
          {
            field: col.field,
            header: col.header,
            format: col.format as DataTableColumn['format'],
          },
        ]
      }
      onChange({ ...block, columns: newColumns })
    },
    [block, onChange, selectedFields],
  )

  const toggleFilter = useCallback(
    (filterId: string) => {
      const currentFilters =
        block.filters ?? getDefaultFilters(source, sectionKey)
      onChange({
        ...block,
        filters: {
          ...currentFilters,
          [filterId]: !currentFilters[filterId],
        },
      })
    },
    [block, source, sectionKey, onChange],
  )

  const currentFilters = block.filters ?? getDefaultFilters(source, sectionKey)

  return (
    <div className="rounded border border-coffee-700 bg-coffee-800/50 p-2 space-y-2">
      {/* Column selection */}
      <div>
        <span className="text-xs font-medium text-coffee-300">Columns:</span>
        <div className="mt-1 flex flex-wrap gap-1">
          {source.availableColumns.map((col) => (
            <label
              key={col.field}
              className="flex cursor-pointer items-center gap-1 rounded border border-coffee-600 px-1.5 py-0.5 text-xs hover:border-coffee-400"
            >
              <input
                type="checkbox"
                checked={selectedFields.has(col.field)}
                onChange={() => toggleColumn(col)}
                className="rounded"
              />
              <span className="text-coffee-200">{col.header}</span>
              {col.format && (
                <span className="text-coffee-500">({col.format})</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Filters */}
      {source.availableFilters.length > 0 && (
        <div>
          <span className="text-xs font-medium text-coffee-300">Filters:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {source.availableFilters.map((filter) => (
              <label
                key={filter.id}
                className="flex cursor-pointer items-center gap-1 text-xs text-coffee-200"
              >
                <input
                  type="checkbox"
                  checked={currentFilters[filter.id] ?? filter.default}
                  onChange={() => toggleFilter(filter.id)}
                  className="rounded"
                />
                {filter.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Change data source */}
      <div className="border-t border-coffee-700 pt-1">
        <button
          onClick={() =>
            onChange({
              ...block,
              dataSource: '',
              columns: [],
              filters: undefined,
            })
          }
          className="text-xs text-coffee-400 hover:text-autumn-300"
        >
          Change data source...
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Preview Table (shows live current data)
// ============================================================================

function PreviewTable({
  items,
  columns,
}: {
  items: Record<string, unknown>[]
  columns: DataTableColumn[]
}) {
  if (items.length === 0) {
    return (
      <div className="rounded border border-coffee-700 bg-coffee-800/30 p-2 text-xs text-coffee-400">
        No items match the current filters.
      </div>
    )
  }

  const maxPreviewRows = 10

  return (
    <div className="overflow-x-auto rounded border border-coffee-700 bg-coffee-800/30">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-coffee-700">
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-2 py-1 text-left font-medium text-coffee-300"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.slice(0, maxPreviewRows).map((item, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-coffee-800 last:border-b-0"
            >
              {columns.map((col) => {
                const value = resolveFieldValue(item, col.field)
                return (
                  <td key={col.field} className="px-2 py-1 text-coffee-200">
                    {formatColumnValue(value, col.format)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {items.length > maxPreviewRows && (
        <div className="border-t border-coffee-700 px-2 py-1 text-xs text-coffee-400">
          ... and {items.length - maxPreviewRows} more items
        </div>
      )}
    </div>
  )
}
