import * as Dialog from '@radix-ui/react-dialog'
import { useCallback, useState } from 'react'
import type { Field, Node } from '../store/State'
import { useStore } from '../store/store'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
} from '../store/utils/constants'
import type { NodeLocations } from '../store/utils/storage'
import { ControlButton } from './ControlButton'

export function ValuesButton() {
  const [selected, ...rest] = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)

  const selectedNode = nodes.find((node) => node.id === selected)

  const isSingleSelected = rest.length === 0

  return (
    <>
      {selectedNode && (
        <ValuesDialog node={selectedNode} disabled={!isSingleSelected} />
      )}
    </>
  )
}

function ValuesDialog({ node, disabled }: { node: Node; disabled: boolean }) {
  const setNodes = useStore((state) => state.setNodes)
  const nodes = useStore((state) => state.nodes)
  const [hiddenFields, setHiddenFields] = useState(node.hiddenFields)
  const groupedFields = groupJsonFields(node.fields)
  const layout = useStore((state) => state.layout)

  const modifyNode = useCallback(() => {
    const newNode = {
      ...node,
      hiddenFields,
      box: {
        ...node.box,
        height:
          HEADER_HEIGHT +
          (node.fields.length - node.hiddenFields.length) * FIELD_HEIGHT +
          BOTTOM_PADDING,
      },
    }
    setNodes(nodes.map((n) => (n.id === node.id ? newNode : n)))
    const nodeLocations: NodeLocations = {}
    for (const node of nodes) {
      nodeLocations[node.id] = { x: node.box.x, y: node.box.y }
    }
    layout(nodeLocations)
  }, [node, hiddenFields, setNodes])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <ControlButton disabled={disabled}>Values</ControlButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 font-medium text-[17px] text-mauve12">
            Values visibility
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-[15px] text-mauve11 leading-normal">
            Make changes to what values are visible in the node.
          </Dialog.Description>

          <div className="flex flex-col gap-1">
            {Object.entries(groupedFields).map(([key, value]) => {
              const isHidden = value.every((field) =>
                hiddenFields.includes(field.name),
              )

              const onChange = () => {
                if (isHidden) {
                  setHiddenFields((prev) =>
                    prev.filter((f) => !value.map((fd) => fd.name).includes(f)),
                  )
                } else {
                  setHiddenFields((prev) => [
                    ...prev,
                    ...value.map((f) => f.name),
                  ])
                }
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

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild onClick={modifyNode}>
              <button className="inline-flex h-[35px] select-none items-center justify-center rounded bg-green4 px-[15px] font-medium text-green11 leading-none outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6">
                Save changes
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-2.5 right-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full bg-gray3 text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type GroupedFields = Record<string, Field[]>

function groupJsonFields(fields: Field[]): GroupedFields {
  const grouped: GroupedFields = {}

  fields.forEach((field) => {
    const arrayMatch = field.name.match(/^([^.\[]+)(?:\[(\d+)\])?(.*)$/)

    if (arrayMatch) {
      // biome-ignore lint/style/noNonNullAssertion: must be there
      const key = arrayMatch[1]!
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(field)
    }
  })

  return grouped
}

function FieldsList({
  fields,
  name,
  onChange,
  isHidden,
}: { fields: Field[]; name: string; onChange: () => void; isHidden: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const hasManyFields = fields.length > 1

  return (
    <div>
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id={`${name}-checkbox`}
          onChange={onChange}
          checked={!isHidden}
        />
        <label htmlFor={`${name}-checkbox`}>{name}</label>
        {hasManyFields && (
          <>
            <label>({fields.length})</label>

            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? '⬇️' : '⬆️'}
            </button>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1 pl-4">
        {!isCollapsed &&
          fields.map((field) => <div key={field.name}>{field.name}</div>)}
      </div>
    </div>
  )
}
