import { useCallback } from 'react'
import type {
  ReviewContentBlock,
  ReviewSection,
  ReviewSubSection,
} from '../../../api/types'
import { ReviewBlockEditor } from './ReviewBlockEditor'
import type { ImportDataBundle } from './reviewDataSources'

type SectionKey = 'collaterals' | 'dependencies' | 'actors' | 'codeAndAudits'

interface ReviewSectionEditorProps {
  section: ReviewSection
  onChange: (updater: (section: ReviewSection) => ReviewSection) => void
  sectionKey: SectionKey
  importData: ImportDataBundle
  isDataLoading: boolean
}

export function ReviewSectionEditor({
  section,
  onChange,
  sectionKey,
  importData,
  isDataLoading,
}: ReviewSectionEditorProps) {
  const updateTitle = useCallback(
    (title: string) => {
      onChange((s) => ({ ...s, title }))
    },
    [onChange],
  )

  const updateDescription = useCallback(
    (description: string) => {
      onChange((s) => ({ ...s, description: description || undefined }))
    },
    [onChange],
  )

  const updateSubsection = useCallback(
    (idx: number, updater: (sub: ReviewSubSection) => ReviewSubSection) => {
      onChange((s) => ({
        ...s,
        subsections: s.subsections.map((sub, i) =>
          i === idx ? updater(sub) : sub,
        ),
      }))
    },
    [onChange],
  )

  const addSubsection = useCallback(() => {
    onChange((s) => ({
      ...s,
      subsections: [...s.subsections, { title: 'New Subsection', content: [] }],
    }))
  }, [onChange])

  const removeSubsection = useCallback(
    (idx: number) => {
      onChange((s) => ({
        ...s,
        subsections: s.subsections.filter((_, i) => i !== idx),
      }))
    },
    [onChange],
  )

  const moveSubsection = useCallback(
    (idx: number, direction: -1 | 1) => {
      onChange((s) => {
        const newIdx = idx + direction
        if (newIdx < 0 || newIdx >= s.subsections.length) return s
        const subs = [...s.subsections]
        const temp = subs[idx]!
        subs[idx] = subs[newIdx]!
        subs[newIdx] = temp
        return { ...s, subsections: subs }
      })
    },
    [onChange],
  )

  return (
    <div className="space-y-3">
      {/* Section title & description */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label className="w-20 text-xs text-coffee-200">Title</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-20 text-xs text-coffee-200">Description</label>
          <input
            type="text"
            value={section.description ?? ''}
            onChange={(e) => updateDescription(e.target.value)}
            className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
            placeholder="Optional description"
          />
        </div>
      </div>

      {/* Subsections */}
      {section.subsections.map((subsection, subIdx) => (
        <SubsectionEditor
          key={subIdx}
          subsection={subsection}
          index={subIdx}
          total={section.subsections.length}
          onChange={(updater) => updateSubsection(subIdx, updater)}
          onRemove={() => removeSubsection(subIdx)}
          onMove={(dir) => moveSubsection(subIdx, dir)}
          sectionKey={sectionKey}
          importData={importData}
          isDataLoading={isDataLoading}
        />
      ))}

      <button
        onClick={addSubsection}
        className="w-full rounded border border-dashed border-coffee-500 px-3 py-1.5 text-xs text-coffee-300 hover:border-autumn-300 hover:text-autumn-300"
      >
        + Add Subsection
      </button>
    </div>
  )
}

interface SubsectionEditorProps {
  subsection: ReviewSubSection
  index: number
  total: number
  onChange: (updater: (sub: ReviewSubSection) => ReviewSubSection) => void
  onRemove: () => void
  onMove: (direction: -1 | 1) => void
  sectionKey: SectionKey
  importData: ImportDataBundle
  isDataLoading: boolean
}

function SubsectionEditor({
  subsection,
  index,
  total,
  onChange,
  onRemove,
  onMove,
  sectionKey,
  importData,
  isDataLoading,
}: SubsectionEditorProps) {
  const updateBlock = useCallback(
    (blockIdx: number, block: ReviewContentBlock) => {
      onChange((sub) => ({
        ...sub,
        content: sub.content.map((b, i) => (i === blockIdx ? block : b)),
      }))
    },
    [onChange],
  )

  const addBlock = useCallback(
    (type: ReviewContentBlock['type'] = 'text') => {
      const newBlock = createEmptyBlock(type)
      onChange((sub) => ({
        ...sub,
        content: [...sub.content, newBlock],
      }))
    },
    [onChange],
  )

  const removeBlock = useCallback(
    (blockIdx: number) => {
      onChange((sub) => ({
        ...sub,
        content: sub.content.filter((_, i) => i !== blockIdx),
      }))
    },
    [onChange],
  )

  const moveBlock = useCallback(
    (blockIdx: number, direction: -1 | 1) => {
      onChange((sub) => {
        const newIdx = blockIdx + direction
        if (newIdx < 0 || newIdx >= sub.content.length) return sub
        const blocks = [...sub.content]
        const temp = blocks[blockIdx]!
        blocks[blockIdx] = blocks[newIdx]!
        blocks[newIdx] = temp
        return { ...sub, content: blocks }
      })
    },
    [onChange],
  )

  return (
    <div className="rounded border border-coffee-600 bg-coffee-900/50">
      {/* Subsection header */}
      <div className="flex items-center gap-2 border-b border-coffee-700 px-2 py-1">
        <input
          type="text"
          value={subsection.title}
          onChange={(e) =>
            onChange((sub) => ({ ...sub, title: e.target.value }))
          }
          className="flex-1 rounded border border-coffee-700 bg-coffee-800 px-2 py-0.5 text-xs font-medium text-coffee-100 focus:border-autumn-300 focus:outline-none"
        />
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
            title="Remove subsection"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content blocks */}
      <div className="space-y-2 p-2">
        {subsection.content.map((block, blockIdx) => (
          <ReviewBlockEditor
            key={blockIdx}
            block={block}
            index={blockIdx}
            total={subsection.content.length}
            onChange={(b) => updateBlock(blockIdx, b)}
            onRemove={() => removeBlock(blockIdx)}
            onMove={(dir) => moveBlock(blockIdx, dir)}
            importData={importData}
            isDataLoading={isDataLoading}
            sectionKey={sectionKey}
          />
        ))}

        <AddBlockButton onAdd={addBlock} />
      </div>
    </div>
  )
}

function AddBlockButton({
  onAdd,
}: {
  onAdd: (type: ReviewContentBlock['type']) => void
}) {
  return (
    <div className="space-y-1">
      {/* Static block types */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onAdd('text')}
          className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Text
        </button>
        <button
          onClick={() => onAdd('table')}
          className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Table
        </button>
        <button
          onClick={() => onAdd('expandableTable')}
          className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Expandable Table
        </button>
        <button
          onClick={() => onAdd('dropdown')}
          className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Dropdown
        </button>
        <button
          onClick={() => onAdd('link')}
          className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Link
        </button>
        <button
          onClick={() => onAdd('metric')}
          className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
        >
          + Metric
        </button>
      </div>

      {/* Data-bound block types */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onAdd('dataTable')}
          className="rounded border border-dashed border-cyan-800 px-2 py-0.5 text-xs text-cyan-400 hover:border-cyan-400 hover:text-cyan-300"
        >
          + Data Table
        </button>
        <button
          onClick={() => onAdd('dataMetric')}
          className="rounded border border-dashed border-cyan-800 px-2 py-0.5 text-xs text-cyan-400 hover:border-cyan-400 hover:text-cyan-300"
        >
          + Data Metric
        </button>
      </div>
    </div>
  )
}

function createEmptyBlock(
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
    case 'dataTable':
      return { type: 'dataTable', dataSource: '', columns: [] }
    case 'dataMetric':
      return {
        type: 'dataMetric',
        dataSource: '',
        field: '',
        label: '',
        format: 'text',
      }
  }
}
