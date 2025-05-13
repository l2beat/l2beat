import { useCallback, useMemo, useState } from 'react'
import type { Node } from '../../store/State'
import { useStore } from '../../store/store'
import { ControlButton } from '../ControlButton'
import { FieldsList } from './FieldsList'
import { groupJsonFields } from './groupJsonFields'
import { Dialog } from '../../../components/Dialog'

export const ValuesDialog = {
  Root: ValuesDialogRoot,
  Trigger: ValuesDialogTrigger,
  Body: ValuesDialogBody,
}

function ValuesDialogRoot({ children }: { children: React.ReactNode }) {
  return <Dialog.Root>{children}</Dialog.Root>
}

function ValuesDialogTrigger({ disabled }: { disabled: boolean }) {
  return (
    <Dialog.Trigger asChild disabled={disabled}>
      <ControlButton disabled={disabled}>Values</ControlButton>
    </Dialog.Trigger>
  )
}

function ValuesDialogBody({ node }: { node: Node }) {
  const setNodes = useStore((state) => state.setNodes)
  const nodes = useStore((state) => state.nodes)

  const [hiddenFields, setHiddenFields] = useState(node.hiddenFields)
  const groupedFields = useMemo(
    () => groupJsonFields(node.fields),
    [node.fields],
  )

  const modifyNode = useCallback(() => {
    const newNode = {
      ...node,
      hiddenFields,
    }

    setNodes(nodes.map((n) => (n.id === node.id ? newNode : n)))
  }, [node, hiddenFields, setNodes])

  return (
    <Dialog.Body>
      <Dialog.Title className="m-0 font-medium text-lg">
        Values visibility
      </Dialog.Title>
      <Dialog.Description className="mb-5 text-sm leading-normal">
        Make changes to what values are visible in the node.
      </Dialog.Description>

      <div className="mb-4 flex gap-2">
        <Dialog.Button onClick={() => setHiddenFields([])}>All</Dialog.Button>
        <Dialog.Button
          onClick={() => {
            const allFieldNames = Object.values(groupedFields)
              .flat()
              .map((f) => f.name)
            setHiddenFields(allFieldNames)
          }}
        >
          None
        </Dialog.Button>
        <Dialog.Button
          onClick={() => {
            const allFieldNames = Object.values(groupedFields)
              .flat()
              .map((f) => f.name)
            setHiddenFields(
              allFieldNames.filter((f) => !hiddenFields.includes(f)),
            )
          }}
        >
          Invert
        </Dialog.Button>
      </div>

      <div className="flex flex-col">
        {Object.entries(groupedFields).map(([key, value]) => {
          const isHidden = value.every((field) =>
            hiddenFields.includes(field.name),
          )

          const onChange = () => {
            const fieldNames = value.map((f) => f.name)

            setHiddenFields((prev) =>
              isHidden
                ? prev.filter((f) => !fieldNames.includes(f))
                : [...prev, ...fieldNames],
            )
          }

          return (
            <div key={key}>
              <FieldsList
                fields={value}
                name={key}
                onChange={onChange}
                isHidden={isHidden}
              />
            </div>
          )
        })}
      </div>

      <Dialog.Close asChild>
        <div className="flex justify-end">
          <Dialog.Button onClick={modifyNode}>Save</Dialog.Button>
        </div>
      </Dialog.Close>
    </Dialog.Body>
  )
}
