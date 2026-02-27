import { useCallback, useMemo, useState } from 'react'

interface ReviewDataKeysEditorProps {
  dataKeys: Record<string, string>
  onChange: (dataKeys: Record<string, string>) => void
}

export function ReviewDataKeysEditor({
  dataKeys,
  onChange,
}: ReviewDataKeysEditorProps) {
  const [collapsed, setCollapsed] = useState(false)

  const entries = useMemo(() => Object.entries(dataKeys), [dataKeys])

  const updateKey = useCallback(
    (oldKey: string, newKey: string) => {
      if (newKey === oldKey) return
      const newDataKeys: Record<string, string> = {}
      for (const [k, v] of Object.entries(dataKeys)) {
        if (k === oldKey) {
          newDataKeys[newKey] = v
        } else {
          newDataKeys[k] = v
        }
      }
      onChange(newDataKeys)
    },
    [dataKeys, onChange],
  )

  const updateValue = useCallback(
    (key: string, value: string) => {
      onChange({ ...dataKeys, [key]: value })
    },
    [dataKeys, onChange],
  )

  const addKey = useCallback(() => {
    let newKeyName = 'newKey'
    let counter = 1
    while (dataKeys[newKeyName] !== undefined) {
      newKeyName = `newKey${counter}`
      counter++
    }
    onChange({ ...dataKeys, [newKeyName]: '' })
  }, [dataKeys, onChange])

  const removeKey = useCallback(
    (key: string) => {
      const newDataKeys = { ...dataKeys }
      delete newDataKeys[key]
      onChange(newDataKeys)
    },
    [dataKeys, onChange],
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 font-bold text-xs text-autumn-300"
        >
          <span>{collapsed ? '▸' : '▾'}</span>
          Data Keys ({entries.length})
        </button>
      </div>

      {!collapsed && (
        <div className="mt-1 space-y-1">
          <p className="text-xs text-coffee-400">
            Define values for {'{{dataKey}}'} placeholders used in text and
            table cells.
          </p>

          {entries.map(([key, value]) => (
            <DataKeyRow
              key={key}
              keyName={key}
              value={value}
              onKeyChange={(newKey) => updateKey(key, newKey)}
              onValueChange={(newValue) => updateValue(key, newValue)}
              onRemove={() => removeKey(key)}
            />
          ))}

          <button
            onClick={addKey}
            className="rounded border border-dashed border-coffee-600 px-2 py-0.5 text-xs text-coffee-400 hover:border-autumn-300 hover:text-autumn-300"
          >
            + Add Data Key
          </button>
        </div>
      )}
    </div>
  )
}

function DataKeyRow({
  keyName,
  value,
  onKeyChange,
  onValueChange,
  onRemove,
}: {
  keyName: string
  value: string
  onKeyChange: (newKey: string) => void
  onValueChange: (value: string) => void
  onRemove: () => void
}) {
  const [editingKey, setEditingKey] = useState(keyName)

  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        value={editingKey}
        onChange={(e) => setEditingKey(e.target.value)}
        onBlur={() => {
          if (editingKey && editingKey !== keyName) {
            onKeyChange(editingKey)
          }
        }}
        className="w-36 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 font-mono text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        placeholder="keyName"
      />
      <span className="text-xs text-coffee-400">=</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex-1 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        placeholder="$38.1M"
      />
      <button
        onClick={onRemove}
        className="px-1 text-xs text-red-400 hover:text-red-300"
      >
        ✕
      </button>
    </div>
  )
}
