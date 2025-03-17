import * as Dialog from '@radix-ui/react-dialog'
import { type SVGProps, useCallback, useState } from 'react'
import type { Node } from '../../store/State'
import { useStore } from '../../store/store'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
} from '../../store/utils/constants'
import type { NodeLocations } from '../../store/utils/storage'
import { ControlButton } from '../ControlButton'
import { FieldsList } from './FieldsList'
import { groupJsonFields } from './groupJsonFields'

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
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 data-[state=open]:bg-coffee-900/60" />
      <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
        <Dialog.Title className="m-0 font-medium text-lg">
          Values visibility
        </Dialog.Title>
        <Dialog.Description className="mb-5 text-sm leading-normal">
          Make changes to what values are visible in the node.
        </Dialog.Description>

        <div className="flex flex-col">
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

        <div className="flex justify-end">
          <Dialog.Close asChild onClick={modifyNode}>
            <button className="inline-flex h-[35px] select-none items-center justify-center rounded px-[15px] font-medium leading-none outline-none">
              Save
            </button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <div
            className="absolute top-2.5 right-2.5 inline-flex cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-none"
            aria-label="Close"
          >
            <XIcon className="stroke-coffee-200" />
          </div>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

function XIcon(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path
        d="M18 6L6 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
