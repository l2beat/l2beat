import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../../../../components/Button'
import { Dialog } from '../../../../../components/Dialog'
import { Input } from '../../../../../components/Input'
import type { Node } from '../../store/State'
import { useStore } from '../../store/store'
import { ControlButton } from '../ControlButton'
import { buildFieldTree, type ExpandedField } from './buildFieldTree'
import { FieldNode } from './FieldNode'
import {
  type FieldState,
  setFieldState as nextVisibility,
  type ValueVisibility,
} from './fieldState'

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

  // Bulk actions work on the whole node, not on whatever the search is
  // narrowed to.
  const topLevelGroupPaths = useMemo(
    () =>
      buildFieldTree(node.fields)
        .filter((field) => field.type === 'complex')
        .map((field) => field.fullKey),
    [node.fields],
  )

  const [visibility, setVisibility] = useState<ValueVisibility>({
    hiddenFields: node.hiddenFields,
    compressedRows: node.compressedRows,
  })
  useEffect(() => {
    setVisibility({
      hiddenFields: node.hiddenFields,
      compressedRows: node.compressedRows,
    })
  }, [node.hiddenFields, node.compressedRows])

  const modifyNode = useCallback(() => {
    const newNode = {
      ...node,
      hiddenFields: [...visibility.hiddenFields],
      compressedRows: [...visibility.compressedRows],
    }

    setNodes(nodes.map((n) => (n.id === node.id ? newNode : n)))
  }, [node, visibility, setNodes, nodes])

  const setFieldState = useCallback(
    (field: ExpandedField, state: FieldState, subsumedBy?: string) => {
      setVisibility((prev) => nextVisibility(field, prev, state, subsumedBy))
    },
    [],
  )

  return (
    <Dialog.Body>
      <Dialog.Title className="m-0 font-medium text-lg">
        Values visibility
      </Dialog.Title>
      <Dialog.Description className="mb-5 text-sm leading-normal">
        Each value can be shown on its own row, compressed with the rest of its
        group into one row that still links to every value, or hidden.
      </Dialog.Description>
      <h3 className="font-medium text-sm">All values</h3>
      <div className="mb-4 flex gap-2">
        <Button
          onClick={() =>
            setVisibility({ hiddenFields: [], compressedRows: [] })
          }
        >
          Show
        </Button>
        <Button
          onClick={() =>
            setVisibility({
              hiddenFields: [],
              compressedRows: topLevelGroupPaths,
            })
          }
        >
          Compress groups
        </Button>
        <Button
          onClick={() =>
            setVisibility({
              hiddenFields: node.fields.map((f) => f.name),
              compressedRows: [],
            })
          }
        >
          Hide
        </Button>
        <Button
          onClick={() =>
            setVisibility((prev) => ({
              ...prev,
              hiddenFields: node.fields
                .map((f) => f.name)
                .filter((name) => !prev.hiddenFields.includes(name)),
            }))
          }
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
              visibility={visibility}
              onSetState={setFieldState}
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
