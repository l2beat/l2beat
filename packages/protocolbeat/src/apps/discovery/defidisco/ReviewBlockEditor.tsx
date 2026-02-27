import { useCallback, useState } from 'react'
import type {
  ReviewContentBlock,
  ReviewDropdownBlock,
  ReviewExpandableTableBlock,
  ReviewExpandableTableRow,
  ReviewLinkBlock,
  ReviewMetricBlock,
  ReviewMetricFormat,
  ReviewTableBlock,
  ReviewTextBlock,
} from '../../../api/types'
import { DataTableBlockEditor } from './DataTableBlockEditor'
import { DataMetricBlockEditor } from './DataMetricBlockEditor'
import type { ImportDataBundle } from './reviewDataSources'

type SectionKey = 'collaterals' | 'dependencies' | 'actors' | 'codeAndAudits'

const BLOCK_TYPE_LABELS: Record<ReviewContentBlock['type'], string> = {
  text: 'TEXT',
  table: 'TABLE',
  expandableTable: 'EXP. TABLE',
  dropdown: 'DROPDOWN',
  link: 'LINK',
  metric: 'METRIC',
  dataTable: 'DATA TABLE',
  dataMetric: 'DATA METRIC',
}

const BLOCK_TYPE_COLORS: Record<ReviewContentBlock['type'], string> = {
  text: 'text-aux-blue',
  table: 'text-aux-green',
  expandableTable: 'text-aux-green',
  dropdown: 'text-aux-yellow',
  link: 'text-aux-violet',
  metric: 'text-aux-orange',
  dataTable: 'text-cyan-400',
  dataMetric: 'text-cyan-400',
}

interface ReviewBlockEditorProps {
  block: ReviewContentBlock
  index: number
  total: number
  onChange: (block: ReviewContentBlock) => void
  onRemove: () => void
  onMove: (direction: -1 | 1) => void
  depth?: number
  importData?: ImportDataBundle
  isDataLoading?: boolean
  sectionKey?: SectionKey
}

export function ReviewBlockEditor({
  block,
  index,
  total,
  onChange,
  onRemove,
  onMove,
  depth = 0,
  importData,
  isDataLoading,
  sectionKey,
}: ReviewBlockEditorProps) {
  return (
    <div
      className={`rounded border border-coffee-700 bg-coffee-800/50 ${depth > 0 ? 'ml-3 border-l-2 border-l-coffee-500' : ''}`}
    >
      {/* Block header */}
      <div className="flex items-center gap-2 px-2 py-1">
        <span className={`text-xs font-bold ${BLOCK_TYPE_COLORS[block.type]}`}>
          {BLOCK_TYPE_LABELS[block.type]}
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="px-1 text-xs text-coffee-400 hover:text-coffee-100 disabled:opacity-30"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="px-1 text-xs text-coffee-400 hover:text-coffee-100 disabled:opacity-30"
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={onRemove}
            className="px-1 text-xs text-red-400 hover:text-red-300"
            title="Remove block"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Block-specific editor */}
      <div className="px-2 pb-2">
        {block.type === 'text' && (
          <TextBlockForm block={block} onChange={onChange} />
        )}
        {block.type === 'table' && (
          <TableBlockForm block={block} onChange={onChange} />
        )}
        {block.type === 'expandableTable' && (
          <ExpandableTableBlockForm block={block} onChange={onChange} />
        )}
        {block.type === 'dropdown' && (
          <DropdownBlockForm block={block} onChange={onChange} depth={depth} />
        )}
        {block.type === 'link' && (
          <LinkBlockForm block={block} onChange={onChange} />
        )}
        {block.type === 'metric' && (
          <MetricBlockForm block={block} onChange={onChange} />
        )}
        {block.type === 'dataTable' && importData && sectionKey && (
          <DataTableBlockEditor
            block={block}
            onChange={onChange}
            importData={importData}
            isDataLoading={isDataLoading ?? false}
            sectionKey={sectionKey}
          />
        )}
        {block.type === 'dataMetric' && importData && sectionKey && (
          <DataMetricBlockEditor
            block={block}
            onChange={onChange}
            importData={importData}
            isDataLoading={isDataLoading ?? false}
            sectionKey={sectionKey}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// TextBlock Form
// ============================================================================

function TextBlockForm({
  block,
  onChange,
}: {
  block: ReviewTextBlock
  onChange: (block: ReviewContentBlock) => void
}) {
  return (
    <div>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        className="w-full rounded border border-coffee-600 bg-coffee-900 px-2 py-1 font-mono text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        rows={3}
        placeholder="Enter text content... Use {{dataKey}} for interpolation"
      />
      <p className="mt-0.5 text-xs text-coffee-400">
        Supports {'{{dataKey}}'} interpolation
      </p>
    </div>
  )
}

// ============================================================================
// TableBlock Form
// ============================================================================

function TableBlockForm({
  block,
  onChange,
}: {
  block: ReviewTableBlock
  onChange: (block: ReviewContentBlock) => void
}) {
  const updateHeader = useCallback(
    (colIdx: number, value: string) => {
      const headers = [...block.headers]
      headers[colIdx] = value
      onChange({ ...block, headers })
    },
    [block, onChange],
  )

  const addColumn = useCallback(() => {
    const headers = [...block.headers, `Column ${block.headers.length + 1}`]
    const rows = block.rows.map((row) => [...row, ''])
    onChange({ ...block, headers, rows })
  }, [block, onChange])

  const removeColumn = useCallback(
    (colIdx: number) => {
      if (block.headers.length <= 1) return
      const headers = block.headers.filter((_, i) => i !== colIdx)
      const rows = block.rows.map((row) => row.filter((_, i) => i !== colIdx))
      onChange({ ...block, headers, rows })
    },
    [block, onChange],
  )

  const updateCell = useCallback(
    (rowIdx: number, colIdx: number, value: string) => {
      const rows = block.rows.map((row, ri) =>
        ri === rowIdx
          ? row.map((cell, ci) => (ci === colIdx ? value : cell))
          : row,
      )
      onChange({ ...block, rows })
    },
    [block, onChange],
  )

  const addRow = useCallback(() => {
    const newRow = block.headers.map(() => '')
    onChange({ ...block, rows: [...block.rows, newRow] })
  }, [block, onChange])

  const removeRow = useCallback(
    (rowIdx: number) => {
      onChange({ ...block, rows: block.rows.filter((_, i) => i !== rowIdx) })
    },
    [block, onChange],
  )

  return (
    <div className="space-y-1">
      {/* Headers */}
      <div className="flex items-center gap-1">
        {block.headers.map((header, colIdx) => (
          <div key={colIdx} className="flex items-center gap-0.5">
            <input
              type="text"
              value={header}
              onChange={(e) => updateHeader(colIdx, e.target.value)}
              className="w-24 rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 text-xs font-medium text-coffee-100 focus:border-autumn-300 focus:outline-none"
            />
            {block.headers.length > 1 && (
              <button
                onClick={() => removeColumn(colIdx)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addColumn}
          className="rounded border border-dashed border-coffee-600 px-1.5 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Col
        </button>
      </div>

      {/* Rows */}
      {block.rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-1">
          {row.map((cell, colIdx) => (
            <input
              key={colIdx}
              type="text"
              value={cell}
              onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
              className="w-24 rounded border border-coffee-700 bg-coffee-900 px-1 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
              placeholder={block.headers[colIdx]}
            />
          ))}
          <button
            onClick={() => removeRow(rowIdx)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={addRow}
        className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
      >
        + Row
      </button>

      {/* Advanced options (colorScale, badgeColumns) as raw JSON */}
      <AdvancedTableOptions block={block} onChange={onChange} />
    </div>
  )
}

function AdvancedTableOptions({
  block,
  onChange,
}: {
  block: ReviewTableBlock | ReviewExpandableTableBlock
  onChange: (block: ReviewContentBlock) => void
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasBadgeColumns =
    block.badgeColumns !== undefined && block.badgeColumns.length > 0
  const hasColorScale = block.type === 'table' && block.colorScale !== undefined
  const hasExternalCallers =
    block.type === 'expandableTable' &&
    block.externalCallers !== undefined &&
    block.externalCallers.length > 0

  if (
    !showAdvanced &&
    !hasBadgeColumns &&
    !hasColorScale &&
    !hasExternalCallers
  ) {
    return (
      <button
        onClick={() => setShowAdvanced(true)}
        className="text-xs text-coffee-400 hover:text-coffee-200"
      >
        Advanced options...
      </button>
    )
  }

  return (
    <div className="mt-1 space-y-1 border-t border-coffee-700 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-coffee-300">Advanced Options</span>
        <button
          onClick={() => setShowAdvanced(false)}
          className="text-xs text-coffee-400 hover:text-coffee-200"
        >
          Hide
        </button>
      </div>

      {/* Badge Columns */}
      <div>
        <label className="text-xs text-coffee-300">Badge Columns (JSON):</label>
        <textarea
          value={
            block.badgeColumns
              ? JSON.stringify(block.badgeColumns, null, 2)
              : ''
          }
          onChange={(e) => {
            try {
              const badgeColumns = e.target.value
                ? JSON.parse(e.target.value)
                : undefined
              onChange({ ...block, badgeColumns })
            } catch {
              // Don't update on invalid JSON
            }
          }}
          className="w-full rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 font-mono text-xs text-coffee-200 focus:border-autumn-300 focus:outline-none"
          rows={2}
          placeholder='[{"column": 2, "colorMap": {"Immutable": "immutable"}}]'
        />
      </div>

      {/* Color Scale (table only) */}
      {block.type === 'table' && (
        <div>
          <label className="text-xs text-coffee-300">Color Scale (JSON):</label>
          <textarea
            value={
              block.colorScale ? JSON.stringify(block.colorScale, null, 2) : ''
            }
            onChange={(e) => {
              try {
                const colorScale = e.target.value
                  ? JSON.parse(e.target.value)
                  : undefined
                onChange({ ...block, colorScale })
              } catch {
                // Don't update on invalid JSON
              }
            }}
            className="w-full rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 font-mono text-xs text-coffee-200 focus:border-autumn-300 focus:outline-none"
            rows={2}
            placeholder='{"columns": [2], "referenceMetric": "totalRaw", "valueMetrics": [["ethRaw"]]}'
          />
        </div>
      )}

      {/* External Callers (expandableTable only) */}
      {block.type === 'expandableTable' && (
        <div>
          <label className="text-xs text-coffee-300">
            External Callers (comma-separated):
          </label>
          <input
            type="text"
            value={(block.externalCallers ?? []).join(', ')}
            onChange={(e) => {
              const externalCallers = e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
              onChange({
                ...block,
                externalCallers:
                  externalCallers.length > 0 ? externalCallers : undefined,
              })
            }}
            className="w-full rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 text-xs text-coffee-200 focus:border-autumn-300 focus:outline-none"
            placeholder="BorrowerOperations, StabilityPool"
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ExpandableTableBlock Form
// ============================================================================

function ExpandableTableBlockForm({
  block,
  onChange,
}: {
  block: ReviewExpandableTableBlock
  onChange: (block: ReviewContentBlock) => void
}) {
  const updateHeader = useCallback(
    (colIdx: number, value: string) => {
      const headers = [...block.headers]
      headers[colIdx] = value
      onChange({ ...block, headers })
    },
    [block, onChange],
  )

  const addColumn = useCallback(() => {
    const headers = [...block.headers, `Column ${block.headers.length + 1}`]
    const rows = block.rows.map((row) => ({
      ...row,
      cells: [...row.cells, ''],
    }))
    onChange({ ...block, headers, rows })
  }, [block, onChange])

  const removeColumn = useCallback(
    (colIdx: number) => {
      if (block.headers.length <= 1) return
      const headers = block.headers.filter((_, i) => i !== colIdx)
      const rows = block.rows.map((row) => ({
        ...row,
        cells: row.cells.filter((_, i) => i !== colIdx),
      }))
      onChange({ ...block, headers, rows })
    },
    [block, onChange],
  )

  const updateCell = useCallback(
    (rowIdx: number, colIdx: number, value: string) => {
      const rows = block.rows.map((row, ri) =>
        ri === rowIdx
          ? {
              ...row,
              cells: row.cells.map((c, ci) => (ci === colIdx ? value : c)),
            }
          : row,
      )
      onChange({ ...block, rows })
    },
    [block, onChange],
  )

  const updateExpandedContent = useCallback(
    (rowIdx: number, jsonStr: string) => {
      try {
        const expandedContent = jsonStr ? JSON.parse(jsonStr) : undefined
        const rows = block.rows.map((row, ri) =>
          ri === rowIdx ? { ...row, expandedContent } : row,
        )
        onChange({ ...block, rows })
      } catch {
        // Don't update on invalid JSON
      }
    },
    [block, onChange],
  )

  const addRow = useCallback(() => {
    const newRow: ReviewExpandableTableRow = {
      cells: block.headers.map(() => ''),
    }
    onChange({ ...block, rows: [...block.rows, newRow] })
  }, [block, onChange])

  const removeRow = useCallback(
    (rowIdx: number) => {
      onChange({ ...block, rows: block.rows.filter((_, i) => i !== rowIdx) })
    },
    [block, onChange],
  )

  return (
    <div className="space-y-1">
      {/* Headers */}
      <div className="flex items-center gap-1">
        {block.headers.map((header, colIdx) => (
          <div key={colIdx} className="flex items-center gap-0.5">
            <input
              type="text"
              value={header}
              onChange={(e) => updateHeader(colIdx, e.target.value)}
              className="w-24 rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 text-xs font-medium text-coffee-100 focus:border-autumn-300 focus:outline-none"
            />
            {block.headers.length > 1 && (
              <button
                onClick={() => removeColumn(colIdx)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addColumn}
          className="rounded border border-dashed border-coffee-600 px-1.5 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Col
        </button>
      </div>

      {/* Rows */}
      {block.rows.map((row, rowIdx) => (
        <ExpandableRowEditor
          key={rowIdx}
          row={row}
          rowIdx={rowIdx}
          headers={block.headers}
          onUpdateCell={(colIdx, value) => updateCell(rowIdx, colIdx, value)}
          onUpdateExpanded={(json) => updateExpandedContent(rowIdx, json)}
          onRemove={() => removeRow(rowIdx)}
        />
      ))}

      <button
        onClick={addRow}
        className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
      >
        + Row
      </button>

      <AdvancedTableOptions block={block} onChange={onChange} />
    </div>
  )
}

function ExpandableRowEditor({
  row,
  rowIdx,
  headers,
  onUpdateCell,
  onUpdateExpanded,
  onRemove,
}: {
  row: ReviewExpandableTableRow
  rowIdx: number
  headers: string[]
  onUpdateCell: (colIdx: number, value: string) => void
  onUpdateExpanded: (json: string) => void
  onRemove: () => void
}) {
  const [showExpanded, setShowExpanded] = useState(false)

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1">
        {row.cells.map((cell, colIdx) => (
          <input
            key={colIdx}
            type="text"
            value={cell}
            onChange={(e) => onUpdateCell(colIdx, e.target.value)}
            className="w-24 rounded border border-coffee-700 bg-coffee-900 px-1 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
            placeholder={headers[colIdx]}
          />
        ))}
        <button
          onClick={() => setShowExpanded(!showExpanded)}
          className="text-xs text-coffee-400 hover:text-coffee-200"
          title="Toggle expanded content"
        >
          {showExpanded ? '▾' : '▸'}
        </button>
        <button
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      {showExpanded && (
        <div className="ml-2">
          <label className="text-xs text-coffee-300">
            Expanded Content (JSON):
          </label>
          <textarea
            value={
              row.expandedContent
                ? JSON.stringify(row.expandedContent, null, 2)
                : ''
            }
            onChange={(e) => onUpdateExpanded(e.target.value)}
            className="w-full rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 font-mono text-xs text-coffee-200 focus:border-autumn-300 focus:outline-none"
            rows={3}
            placeholder='{"functions": [{"name": "mint()", "callers": ["ActivePool"]}]}'
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// DropdownBlock Form (recursive)
// ============================================================================

function DropdownBlockForm({
  block,
  onChange,
  depth,
}: {
  block: ReviewDropdownBlock
  onChange: (block: ReviewContentBlock) => void
  depth: number
}) {
  const updateNestedBlock = useCallback(
    (blockIdx: number, updated: ReviewContentBlock) => {
      const content = block.content.map((b, i) =>
        i === blockIdx ? updated : b,
      )
      onChange({ ...block, content })
    },
    [block, onChange],
  )

  const addNestedBlock = useCallback(
    (type: ReviewContentBlock['type']) => {
      const newBlock = createEmptyBlockOfType(type)
      onChange({ ...block, content: [...block.content, newBlock] })
    },
    [block, onChange],
  )

  const removeNestedBlock = useCallback(
    (blockIdx: number) => {
      onChange({
        ...block,
        content: block.content.filter((_, i) => i !== blockIdx),
      })
    },
    [block, onChange],
  )

  const moveNestedBlock = useCallback(
    (blockIdx: number, direction: -1 | 1) => {
      const newIdx = blockIdx + direction
      if (newIdx < 0 || newIdx >= block.content.length) return
      const content = [...block.content]
      const temp = content[blockIdx]!
      content[blockIdx] = content[newIdx]!
      content[newIdx] = temp
      onChange({ ...block, content })
    },
    [block, onChange],
  )

  const maxDepth = 3
  if (depth >= maxDepth) {
    return (
      <p className="text-xs text-coffee-400">Maximum nesting depth reached</p>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-xs text-coffee-200">Label:</label>
        <input
          type="text"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          className="flex-1 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        {block.content.map((nestedBlock, idx) => (
          <ReviewBlockEditor
            key={idx}
            block={nestedBlock}
            index={idx}
            total={block.content.length}
            onChange={(b) => updateNestedBlock(idx, b)}
            onRemove={() => removeNestedBlock(idx)}
            onMove={(dir) => moveNestedBlock(idx, dir)}
            depth={depth + 1}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {(['text', 'table', 'link', 'metric'] as const).map((type) => (
          <button
            key={type}
            onClick={() => addNestedBlock(type)}
            className="rounded border border-dashed border-coffee-600 px-1.5 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
          >
            + {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        {depth + 1 < maxDepth && (
          <button
            onClick={() => addNestedBlock('dropdown')}
            className="rounded border border-dashed border-coffee-600 px-1.5 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
          >
            + Dropdown
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// LinkBlock Form
// ============================================================================

function LinkBlockForm({
  block,
  onChange,
}: {
  block: ReviewLinkBlock
  onChange: (block: ReviewContentBlock) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <label className="text-xs text-coffee-200">Text:</label>
        <input
          type="text"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          className="w-32 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          placeholder="Link text"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-xs text-coffee-200">URL:</label>
        <input
          type="text"
          value={block.href}
          onChange={(e) => onChange({ ...block, href: e.target.value })}
          className="w-48 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          placeholder="https://..."
        />
      </div>
      <label className="flex cursor-pointer items-center gap-1 text-xs text-coffee-200">
        <input
          type="checkbox"
          checked={block.external}
          onChange={(e) => onChange({ ...block, external: e.target.checked })}
          className="rounded"
        />
        External
      </label>
    </div>
  )
}

// ============================================================================
// MetricBlock Form
// ============================================================================

const METRIC_FORMATS: { value: ReviewMetricFormat; label: string }[] = [
  { value: 'usd', label: 'USD ($38.1M)' },
  { value: 'percent', label: 'Percent (22.8%)' },
  { value: 'number', label: 'Number (3,241)' },
  { value: 'string', label: 'String (as-is)' },
]

function MetricBlockForm({
  block,
  onChange,
}: {
  block: ReviewMetricBlock
  onChange: (block: ReviewContentBlock) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <label className="text-xs text-coffee-200">Label:</label>
        <input
          type="text"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          className="w-32 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          placeholder="Metric label"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-xs text-coffee-200">Data Key:</label>
        <input
          type="text"
          value={block.dataKey}
          onChange={(e) => onChange({ ...block, dataKey: e.target.value })}
          className="w-32 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          placeholder="totalTroves"
        />
      </div>
      <div className="flex items-center gap-1">
        <label className="text-xs text-coffee-200">Format:</label>
        <select
          value={block.format}
          onChange={(e) =>
            onChange({ ...block, format: e.target.value as ReviewMetricFormat })
          }
          className="rounded border border-coffee-600 bg-coffee-900 px-1 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        >
          {METRIC_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ============================================================================
// Helpers
// ============================================================================

function createEmptyBlockOfType(
  type: ReviewContentBlock['type'],
): ReviewContentBlock {
  switch (type) {
    case 'text':
      return { type: 'text', content: '' }
    case 'table':
      return { type: 'table', headers: ['Column 1'], rows: [] }
    case 'expandableTable':
      return { type: 'expandableTable', headers: ['Column 1'], rows: [] }
    case 'dropdown':
      return { type: 'dropdown', label: 'Click to expand', content: [] }
    case 'link':
      return { type: 'link', text: '', href: '', external: true }
    case 'metric':
      return { type: 'metric', label: '', dataKey: '', format: 'string' }
  }
}
