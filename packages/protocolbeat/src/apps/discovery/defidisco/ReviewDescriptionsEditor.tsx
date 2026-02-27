import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { updateReviewConfigEntity } from '../../../api/api'
import type {
  EntityDescription,
  ReviewConfig,
  ReviewProjectType,
} from '../../../api/types'

const PROTOCOL_TYPES: ReviewProjectType[] = [
  'stablecoin',
  'lending',
  'dex',
  'bridge',
  'derivatives',
  'yield',
  'liquid-staking',
  'cdp',
  'other',
]

interface ReviewDescriptionsEditorProps {
  project: string
  config: ReviewConfig
  onUpdateConfig: (updater: (prev: ReviewConfig) => ReviewConfig) => void
}

export function ReviewDescriptionsEditor({
  project,
  config,
  onUpdateConfig,
}: ReviewDescriptionsEditorProps) {
  const queryClient = useQueryClient()

  const entityMutation = useMutation({
    mutationFn: (req: {
      section: 'admins' | 'dependencies' | 'funds'
      address: string
      name?: string
      description: string
    }) => updateReviewConfigEntity(project, req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['review-config', project],
      })
    },
  })

  const handleEntitySave = useCallback(
    (
      section: 'admins' | 'dependencies' | 'funds',
      address: string,
      name: string | undefined,
      description: string,
    ) => {
      // Optimistically update localConfig
      onUpdateConfig((prev) => {
        const sectionData = { ...prev[section] }
        const normalizedAddress = address.startsWith('eth:')
          ? address
          : `eth:${address}`
        if (!description && !name) {
          delete sectionData[normalizedAddress]
        } else {
          sectionData[normalizedAddress] = { name, description }
        }
        return { ...prev, [section]: sectionData }
      })
      // Persist to backend
      entityMutation.mutate({ section, address, name, description })
    },
    [onUpdateConfig, entityMutation],
  )

  return (
    <div className="space-y-4">
      <ProtocolSection
        type={config.projectType}
        description={config.description}
        onTypeChange={(type) =>
          onUpdateConfig((prev) => ({ ...prev, projectType: type }))
        }
        onDescriptionChange={(description) =>
          onUpdateConfig((prev) => ({ ...prev, description }))
        }
      />

      <EntitySection
        title="Admins"
        sectionKey="admins"
        entities={config.admins}
        isSaving={entityMutation.isPending}
        onSave={(address, name, description) =>
          handleEntitySave('admins', address, name, description)
        }
      />

      <EntitySection
        title="Dependencies"
        sectionKey="dependencies"
        entities={config.dependencies}
        isSaving={entityMutation.isPending}
        onSave={(address, name, description) =>
          handleEntitySave('dependencies', address, name, description)
        }
      />

      <EntitySection
        title="Funds"
        sectionKey="funds"
        entities={config.funds}
        isSaving={entityMutation.isPending}
        onSave={(address, name, description) =>
          handleEntitySave('funds', address, name, description)
        }
      />
    </div>
  )
}

function ProtocolSection({
  type,
  description,
  onTypeChange,
  onDescriptionChange,
}: {
  type: ReviewProjectType
  description: string
  onTypeChange: (type: ReviewProjectType) => void
  onDescriptionChange: (description: string) => void
}) {
  return (
    <div className="rounded border border-coffee-600 p-2">
      <h3 className="mb-2 font-bold text-xs text-autumn-300">Protocol</h3>

      <div className="mb-2 flex items-center gap-2">
        <label className="text-xs text-coffee-200">Type:</label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as ReviewProjectType)}
          className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        >
          {PROTOCOL_TYPES.map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Protocol description..."
        rows={4}
        className="w-full rounded border border-coffee-600 bg-coffee-800 px-2 py-1 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
      />
    </div>
  )
}

function EntitySection({
  title,
  sectionKey,
  entities,
  isSaving,
  onSave,
}: {
  title: string
  sectionKey: 'admins' | 'dependencies' | 'funds'
  entities: Record<string, EntityDescription>
  isSaving: boolean
  onSave: (
    address: string,
    name: string | undefined,
    description: string,
  ) => void
}) {
  const [showAdd, setShowAdd] = useState(false)

  const entries = Object.entries(entities)

  return (
    <div className="rounded border border-coffee-600 p-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold text-xs text-autumn-300">
          {title}{' '}
          <span className="font-normal text-coffee-400">
            ({entries.length})
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
        <AddEntityForm
          sectionKey={sectionKey}
          isSaving={isSaving}
          onSave={(address, name, description) => {
            onSave(address, name, description)
            setShowAdd(false)
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {entries.map(([address, entity]) => (
        <EntityEntry
          key={address}
          address={address}
          entity={entity}
          isSaving={isSaving}
          onSave={onSave}
        />
      ))}

      {entries.length === 0 && !showAdd && (
        <p className="py-2 text-center text-xs text-coffee-400">
          No {title.toLowerCase()} descriptions yet
        </p>
      )}
    </div>
  )
}

function EntityEntry({
  address,
  entity,
  isSaving,
  onSave,
}: {
  address: string
  entity: EntityDescription
  isSaving: boolean
  onSave: (
    address: string,
    name: string | undefined,
    description: string,
  ) => void
}) {
  const [localName, setLocalName] = useState(entity.name ?? '')
  const [localDesc, setLocalDesc] = useState(entity.description)
  const [expanded, setExpanded] = useState(false)

  const isDirty =
    (localName || undefined) !== entity.name || localDesc !== entity.description

  return (
    <div className="mb-1 rounded border border-coffee-700 bg-coffee-800/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-2 py-1 text-left"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs text-coffee-400">
            {expanded ? '▼' : '▶'}
          </span>
          <span className="truncate text-xs font-medium text-coffee-100">
            {entity.name || address}
          </span>
          {entity.name && (
            <span className="truncate text-xs text-coffee-400">{address}</span>
          )}
        </div>
        {isDirty && <span className="text-xs text-yellow-400">*</span>}
      </button>

      {expanded && (
        <div className="border-t border-coffee-700 p-2">
          <div className="mb-1 flex items-center gap-2">
            <label className="text-xs text-coffee-200">Name:</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Human-friendly label"
              className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
            />
          </div>
          <textarea
            value={localDesc}
            onChange={(e) => setLocalDesc(e.target.value)}
            placeholder="Description..."
            rows={3}
            className="mb-1 w-full rounded border border-coffee-600 bg-coffee-800 px-2 py-1 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onSave(address, undefined, '')}
              className="rounded px-2 py-0.5 text-xs text-red-400 hover:bg-coffee-700"
            >
              Delete
            </button>
            <button
              onClick={() => onSave(address, localName || undefined, localDesc)}
              disabled={!isDirty || isSaving}
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                isDirty && !isSaving
                  ? 'bg-autumn-300 text-coffee-900 hover:bg-autumn-200'
                  : 'cursor-not-allowed bg-coffee-700 text-coffee-400'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AddEntityForm({
  sectionKey,
  isSaving,
  onSave,
  onCancel,
}: {
  sectionKey: 'admins' | 'dependencies' | 'funds'
  isSaving: boolean
  onSave: (
    address: string,
    name: string | undefined,
    description: string,
  ) => void
  onCancel: () => void
}) {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const isValid = address.trim().length > 0

  const handleSave = useCallback(() => {
    if (!isValid) return
    onSave(address.trim(), name.trim() || undefined, description)
  }, [address, name, description, isValid, onSave])

  return (
    <div className="mb-2 rounded border border-dashed border-coffee-500 bg-coffee-800/50 p-2">
      <div className="mb-1 flex items-center gap-2">
        <label className="w-16 text-xs text-coffee-200">Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="eth:0x..."
          className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
        />
      </div>
      <div className="mb-1 flex items-center gap-2">
        <label className="w-16 text-xs text-coffee-200">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Human-friendly label"
          className="flex-1 rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description..."
        rows={2}
        className="mb-1 w-full rounded border border-coffee-600 bg-coffee-800 px-2 py-1 text-xs text-coffee-100 placeholder-coffee-400 focus:border-autumn-300 focus:outline-none"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded px-2 py-0.5 text-xs text-coffee-200 hover:bg-coffee-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid || isSaving}
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            isValid && !isSaving
              ? 'bg-autumn-300 text-coffee-900 hover:bg-autumn-200'
              : 'cursor-not-allowed bg-coffee-700 text-coffee-400'
          }`}
        >
          {isSaving ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  )
}
