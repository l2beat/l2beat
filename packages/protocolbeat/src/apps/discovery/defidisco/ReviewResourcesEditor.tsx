import { useCallback, useState } from 'react'
import type {
  FrontendSubtype,
  ResourceEntry,
  ResourceType,
} from '../../../api/types'

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'docs', label: 'Docs' },
  { value: 'source-code', label: 'Source Code' },
  { value: 'github', label: 'GitHub' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'license', label: 'License' },
  { value: 'defiscan-v1', label: 'DeFiScan V1' },
  { value: 'other', label: 'Other' },
]

const FRONTEND_SUBTYPES: { value: FrontendSubtype; label: string }[] = [
  { value: 'official', label: 'Official' },
  { value: 'third-party', label: 'Third-party' },
  { value: 'self-hosted', label: 'Self-hosted' },
]

const LICENSE_PRESETS = [
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'GPL-2.0',
  'LGPL-3.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'MPL-2.0',
  'ISC',
  'BUSL-1.1',
  'Proprietary',
  'Unlicensed',
]

interface ReviewResourcesEditorProps {
  resources: ResourceEntry[]
  onUpdateResources: (resources: ResourceEntry[]) => void
}

export function ReviewResourcesEditor({
  resources,
  onUpdateResources,
}: ReviewResourcesEditorProps) {
  const [showAdd, setShowAdd] = useState(false)

  const handleAdd = useCallback(
    (entry: ResourceEntry) => {
      onUpdateResources([...resources, entry])
      setShowAdd(false)
    },
    [resources, onUpdateResources],
  )

  const handleUpdate = useCallback(
    (index: number, entry: ResourceEntry) => {
      const updated = [...resources]
      updated[index] = entry
      onUpdateResources(updated)
    },
    [resources, onUpdateResources],
  )

  const handleDelete = useCallback(
    (index: number) => {
      onUpdateResources(resources.filter((_, i) => i !== index))
    },
    [resources, onUpdateResources],
  )

  return (
    <div className="rounded border border-coffee-600 p-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold text-xs text-autumn-300">
          Resources{' '}
          <span className="font-normal text-coffee-400">
            ({resources.length})
          </span>
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="rounded bg-coffee-700 px-2 py-0.5 text-xs text-coffee-200 hover:bg-coffee-600"
        >
          {showAdd ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showAdd && (
        <AddResourceForm
          onSave={handleAdd}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {resources.map((entry, index) => (
        <ResourceEntryRow
          key={`${entry.type}-${entry.url}-${index}`}
          entry={entry}
          onUpdate={(updated) => handleUpdate(index, updated)}
          onDelete={() => handleDelete(index)}
        />
      ))}

      {resources.length === 0 && !showAdd && (
        <p className="py-2 text-center text-xs text-coffee-400">
          No resources yet
        </p>
      )}
    </div>
  )
}

function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const colors: Record<ResourceType, string> = {
    website: 'bg-teal-900/50 text-teal-300',
    frontend: 'bg-blue-900/50 text-blue-300',
    docs: 'bg-green-900/50 text-green-300',
    'source-code': 'bg-purple-900/50 text-purple-300',
    github: 'bg-gray-700/50 text-gray-300',
    x: 'bg-sky-900/50 text-sky-300',
    license: 'bg-amber-900/50 text-amber-300',
    'defiscan-v1': 'bg-indigo-900/50 text-indigo-300',
    other: 'bg-coffee-700 text-coffee-300',
  }
  const labels: Record<ResourceType, string> = {
    website: 'Website',
    frontend: 'Frontend',
    docs: 'Docs',
    'source-code': 'Source',
    github: 'GitHub',
    x: 'X',
    license: 'License',
    'defiscan-v1': 'DeFiScan V1',
    other: 'Other',
  }
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${colors[type]}`}
    >
      {labels[type]}
    </span>
  )
}

function FrontendSubtypeBadge({ subtype }: { subtype: FrontendSubtype }) {
  const colors: Record<FrontendSubtype, string> = {
    official: 'bg-green-900/50 text-green-300',
    'third-party': 'bg-yellow-900/50 text-yellow-300',
    'self-hosted': 'bg-orange-900/50 text-orange-300',
  }
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${colors[subtype]}`}
    >
      {subtype}
    </span>
  )
}

function ResourceEntryRow({
  entry,
  onUpdate,
  onDelete,
}: {
  entry: ResourceEntry
  onUpdate: (entry: ResourceEntry) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [localEntry, setLocalEntry] = useState(entry)

  const isDirty = JSON.stringify(localEntry) !== JSON.stringify(entry)

  return (
    <div className="mb-1 rounded border border-coffee-700 bg-coffee-800/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-2 py-1 text-left"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs text-coffee-400">
            {expanded ? '\u25BC' : '\u25B6'}
          </span>
          <ResourceTypeBadge type={entry.type} />
          {entry.type === 'frontend' && entry.frontendSubtype && (
            <FrontendSubtypeBadge subtype={entry.frontendSubtype} />
          )}
          <span className="truncate text-xs text-coffee-100">
            {entry.label || entry.url}
          </span>
          {entry.type === 'license' && entry.licenseScope && (
            <span className="text-[10px] text-coffee-400">
              ({entry.licenseScope})
            </span>
          )}
        </div>
        {isDirty && <span className="text-xs text-yellow-400">*</span>}
      </button>

      {expanded && (
        <div className="border-t border-coffee-700 p-2 space-y-1">
          <div className="flex items-center gap-2">
            <label className="w-14 text-xs text-coffee-200">Type:</label>
            <select
              value={localEntry.type}
              onChange={(e) => {
                const type = e.target.value as ResourceType
                setLocalEntry({
                  ...localEntry,
                  type,
                  frontendSubtype:
                    type === 'frontend'
                      ? (localEntry.frontendSubtype ?? 'official')
                      : undefined,
                  label:
                    type === 'license'
                      ? (localEntry.label ?? 'MIT')
                      : localEntry.label,
                  licenseScope:
                    type === 'license' ? localEntry.licenseScope : undefined,
                })
              }}
              className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
            >
              {RESOURCE_TYPES.map((rt) => (
                <option key={rt.value} value={rt.value}>
                  {rt.label}
                </option>
              ))}
            </select>
            {localEntry.type === 'frontend' && (
              <select
                value={localEntry.frontendSubtype ?? 'official'}
                onChange={(e) =>
                  setLocalEntry({
                    ...localEntry,
                    frontendSubtype: e.target.value as FrontendSubtype,
                  })
                }
                className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
              >
                {FRONTEND_SUBTYPES.map((fs) => (
                  <option key={fs.value} value={fs.value}>
                    {fs.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="w-14 text-xs text-coffee-200">URL:</label>
            <input
              type="text"
              value={localEntry.url}
              onChange={(e) =>
                setLocalEntry({ ...localEntry, url: e.target.value })
              }
              placeholder="https://..."
              className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
            />
          </div>
          {localEntry.type === 'license' ? (
            <>
              <div className="flex items-center gap-2">
                <label className="w-14 text-xs text-coffee-200">License:</label>
                <select
                  value={
                    LICENSE_PRESETS.includes(localEntry.label ?? '')
                      ? localEntry.label
                      : '__other__'
                  }
                  onChange={(e) => {
                    const v = e.target.value
                    setLocalEntry({
                      ...localEntry,
                      label: v === '__other__' ? '' : v,
                    })
                  }}
                  className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
                >
                  {LICENSE_PRESETS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                  <option value="__other__">Other</option>
                </select>
                {!LICENSE_PRESETS.includes(localEntry.label ?? '') && (
                  <input
                    type="text"
                    value={localEntry.label ?? ''}
                    onChange={(e) =>
                      setLocalEntry({
                        ...localEntry,
                        label: e.target.value || undefined,
                      })
                    }
                    placeholder="License name"
                    className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="w-14 text-xs text-coffee-200">Scope:</label>
                <input
                  type="text"
                  value={localEntry.licenseScope ?? ''}
                  onChange={(e) =>
                    setLocalEntry({
                      ...localEntry,
                      licenseScope: e.target.value || undefined,
                    })
                  }
                  placeholder="e.g. Contracts, Frontend, SDK"
                  className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <label className="w-14 text-xs text-coffee-200">Label:</label>
              <input
                type="text"
                value={localEntry.label ?? ''}
                onChange={(e) =>
                  setLocalEntry({
                    ...localEntry,
                    label: e.target.value || undefined,
                  })
                }
                placeholder="Optional label"
                className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={onDelete}
              className="rounded px-2 py-0.5 text-xs text-red-400 hover:bg-coffee-700"
            >
              Delete
            </button>
            <button
              onClick={() => onUpdate(localEntry)}
              disabled={!isDirty}
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                isDirty
                  ? 'bg-autumn-300 text-coffee-900 hover:bg-autumn-200'
                  : 'cursor-not-allowed bg-coffee-700 text-coffee-400'
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AddResourceForm({
  onSave,
  onCancel,
}: {
  onSave: (entry: ResourceEntry) => void
  onCancel: () => void
}) {
  const [type, setType] = useState<ResourceType>('frontend')
  const [frontendSubtype, setFrontendSubtype] =
    useState<FrontendSubtype>('official')
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [licenseScope, setLicenseScope] = useState('')

  const isValid = url.trim().length > 0

  const handleSave = useCallback(() => {
    if (!isValid) return
    onSave({
      url: url.trim(),
      type,
      label: label.trim() || undefined,
      frontendSubtype: type === 'frontend' ? frontendSubtype : undefined,
      licenseScope:
        type === 'license' && licenseScope.trim()
          ? licenseScope.trim()
          : undefined,
    })
  }, [url, type, label, frontendSubtype, licenseScope, isValid, onSave])

  return (
    <div className="mb-2 rounded border border-dashed border-coffee-500 bg-coffee-800/50 p-2 space-y-1">
      <div className="flex items-center gap-2">
        <label className="w-14 text-xs text-coffee-200">Type:</label>
        <select
          value={type}
          onChange={(e) => {
            const newType = e.target.value as ResourceType
            setType(newType)
            if (newType === 'license') {
              setLabel(label || 'MIT')
            }
            if (newType !== 'license') {
              setLicenseScope('')
            }
          }}
          className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        >
          {RESOURCE_TYPES.map((rt) => (
            <option key={rt.value} value={rt.value}>
              {rt.label}
            </option>
          ))}
        </select>
        {type === 'frontend' && (
          <select
            value={frontendSubtype}
            onChange={(e) =>
              setFrontendSubtype(e.target.value as FrontendSubtype)
            }
            className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
          >
            {FRONTEND_SUBTYPES.map((fs) => (
              <option key={fs.value} value={fs.value}>
                {fs.label}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="w-14 text-xs text-coffee-200">URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
        />
      </div>
      {type === 'license' ? (
        <>
          <div className="flex items-center gap-2">
            <label className="w-14 text-xs text-coffee-200">License:</label>
            <select
              value={LICENSE_PRESETS.includes(label) ? label : '__other__'}
              onChange={(e) => {
                const v = e.target.value
                setLabel(v === '__other__' ? '' : v)
              }}
              className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
            >
              {LICENSE_PRESETS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
              <option value="__other__">Other</option>
            </select>
            {!LICENSE_PRESETS.includes(label) && (
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="License name"
                className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="w-14 text-xs text-coffee-200">Scope:</label>
            <input
              type="text"
              value={licenseScope}
              onChange={(e) => setLicenseScope(e.target.value)}
              placeholder="e.g. Contracts, Frontend, SDK"
              className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
            />
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <label className="w-14 text-xs text-coffee-200">Label:</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Optional label"
            className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
          />
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded px-2 py-0.5 text-xs text-coffee-200 hover:bg-coffee-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            isValid
              ? 'bg-autumn-300 text-coffee-900 hover:bg-autumn-200'
              : 'cursor-not-allowed bg-coffee-700 text-coffee-400'
          }`}
        >
          Add
        </button>
      </div>
    </div>
  )
}
