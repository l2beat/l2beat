import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../../../../components/Button'
import { Dialog } from '../../../../../components/Dialog'
import { Input } from '../../../../../components/Input'
import type { Node } from '../../store/State'
import { useStore } from '../../store/store'
import { ControlButton } from '../ControlButton'
import type { ExpandedField } from './buildFieldTree'
import { buildFieldTree } from './buildFieldTree'
import { FieldNode } from './FieldNode'

export const ValuesDialog = {
  Root: ValuesDialogRoot,
  Trigger: ValuesDialogTrigger,
  Body: ValuesDialogBody,
}

function ValuesDialogRoot({ children }: { children: React.ReactNode }) {
  return <Dialog.Root>{children}</Dialog.Root>
}

function ValuesDialogTrigger({
  disabled,
  className,
  title,
  ariaLabel,
  children,
}: {
  disabled: boolean
  className?: string
  title?: string
  ariaLabel?: string
  children: React.ReactNode
}) {
  return (
    <Dialog.Trigger asChild disabled={disabled}>
      <ControlButton
        disabled={disabled}
        className={clsx('relative', className)}
        title={title}
        aria-label={ariaLabel}
      >
        {children}
      </ControlButton>
    </Dialog.Trigger>
  )
}

function ValuesDialogBody({ node }: { node: Node }) {
  const setNodes = useStore((state) => state.setNodes)
  const nodes = useStore((state) => state.nodes)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFields = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return node.fields.filter((field) => {
      return (
        field.name.toLowerCase().includes(query) ||
        field.label?.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, node.fields])

  const fieldTree = useMemo(
    () => buildFieldTree(filteredFields),
    [filteredFields],
  )

  const [hiddenFields, setHiddenFields] = useState(node.hiddenFields)
  useEffect(() => {
    setHiddenFields(node.hiddenFields)
  }, [node.hiddenFields])

  const modifyNode = useCallback(() => {
    const newNode = {
      ...node,
      hiddenFields,
    }

    setNodes(nodes.map((n) => (n.id === node.id ? newNode : n)))
  }, [node, hiddenFields, setNodes, nodes])

  // Helper function to get all simple field keys recursively
  const getAllSimpleFieldKeys = useCallback(
    (field: ExpandedField): string[] => {
      if (field.type === 'simple') {
        return [field.fullKey]
      }

      return field.value.flatMap((child) => getAllSimpleFieldKeys(child))
    },
    [],
  )

  // Toggle function for fields
  const toggleField = useCallback(
    (field: ExpandedField) => {
      const allKeys = getAllSimpleFieldKeys(field)
      const allKeysHidden = allKeys.every((key) => hiddenFields.includes(key))

      if (allKeysHidden) {
        // Show all keys
        setHiddenFields((prev) => prev.filter((key) => !allKeys.includes(key)))
      } else {
        // Hide all keys
        setHiddenFields((prev) => [
          ...prev,
          ...allKeys.filter((key) => !prev.includes(key)),
        ])
      }
    },
    [hiddenFields, getAllSimpleFieldKeys],
  )

  return (
    <Dialog.Body>
      <Dialog.Title className="m-0 font-medium text-lg">
        Values visibility
      </Dialog.Title>
      <Dialog.Description className="mb-5 text-sm leading-normal">
        Make changes to what values are visible in the node.
      </Dialog.Description>
      <h3 className="font-medium text-sm">Actions</h3>
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setHiddenFields([])}>All</Button>
        <Button
          onClick={() => {
            const allFieldNames = node.fields.map((f) => f.name)
            setHiddenFields(allFieldNames)
          }}
        >
          None
        </Button>
        <Button
          onClick={() => {
            const allFieldNames = node.fields.map((f) => f.name)
            setHiddenFields(
              allFieldNames.filter((f) => !hiddenFields.includes(f)),
            )
          }}
        >
          Invert
        </Button>
      </div>

      <h3 className="font-medium text-sm">Fields</h3>
      <div className="flex flex-col gap-1">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex max-h-[40vh] flex-col overflow-y-auto border border-coffee-400 bg-coffee-400/10 p-2 text-sm">
          {fieldTree.map((field) => (
            <FieldNode
              key={field.type === 'simple' ? field.fullKey : field.property}
              field={field}
              hiddenFields={hiddenFields}
              onToggle={toggleField}
            />
          ))}
        </div>
      </div>

      <Dialog.Close asChild>
        <div className="mt-4 flex justify-end">
          <Button onClick={modifyNode}>Save</Button>
        </div>
      </Dialog.Close>
    </Dialog.Body>
  )
}
