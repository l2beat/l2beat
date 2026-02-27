import { useRef, useState } from 'react'

interface EntitySelectorProps {
  value: string | undefined
  onChange: (entity: string | undefined) => void
  existingEntities: string[]
  compact?: boolean
  disabled?: boolean
}

export function EntitySelector({
  value,
  onChange,
  existingEntities,
  compact = false,
  disabled = false,
}: EntitySelectorProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newEntityName, setNewEntityName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    onChange(selected === '' ? undefined : selected)
  }

  const handleStartAdding = () => {
    setIsAddingNew(true)
    setNewEntityName('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleConfirmNew = () => {
    const trimmed = newEntityName.trim()
    if (trimmed) {
      onChange(trimmed)
    }
    setIsAddingNew(false)
    setNewEntityName('')
  }

  const handleCancelNew = () => {
    setIsAddingNew(false)
    setNewEntityName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmNew()
    } else if (e.key === 'Escape') {
      handleCancelNew()
    }
  }

  const textSize = compact ? 'text-xs' : 'text-xs'
  const padding = compact ? 'px-1.5 py-0.5' : 'px-2 py-1'

  if (isAddingNew) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          value={newEntityName}
          onChange={(e) => setNewEntityName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Entity name..."
          className={`rounded border border-coffee-600 bg-coffee-700 text-coffee-200 ${textSize} ${padding} focus:border-autumn-500 focus:outline-none`}
          disabled={disabled}
        />
        <button
          onClick={handleConfirmNew}
          disabled={disabled || !newEntityName.trim()}
          className={`rounded border border-coffee-600 bg-coffee-700 text-coffee-200 hover:bg-coffee-600 disabled:opacity-50 ${textSize} ${padding}`}
        >
          Add
        </button>
        <button
          onClick={handleCancelNew}
          disabled={disabled}
          className={`rounded border border-coffee-600 bg-coffee-700 text-coffee-400 hover:bg-coffee-600 ${textSize} ${padding}`}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <select
        value={value ?? ''}
        onChange={handleSelectChange}
        disabled={disabled}
        className={`rounded border border-coffee-600 bg-coffee-700 text-coffee-200 ${textSize} ${padding} focus:border-autumn-500 focus:outline-none`}
      >
        <option value="">(No entity)</option>
        {existingEntities.map((entity) => (
          <option key={entity} value={entity}>
            {entity}
          </option>
        ))}
      </select>
      <button
        onClick={handleStartAdding}
        disabled={disabled}
        title="Add new entity"
        className={`rounded border border-coffee-600 bg-coffee-700 text-coffee-200 hover:bg-coffee-600 disabled:opacity-50 ${textSize} ${padding}`}
      >
        +
      </button>
    </div>
  )
}
