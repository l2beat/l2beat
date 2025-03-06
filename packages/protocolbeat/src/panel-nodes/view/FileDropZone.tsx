import type { ReactNode } from 'react'
import { useStore } from '../store/store'
import { discoveryToNodes } from '../store/utils/discoveryToNodes'
import { encodeProjectId, parseDiscovery } from '../store/utils/parseDiscovery'

export function FileDropZone(props: {
  children: ReactNode
  disabled: boolean
}) {
  const loadNodes = useStore((state) => state.loadNodes)

  async function loadFromFile(file: File) {
    const contents = await file.text()
    const discovery = parseDiscovery(JSON.parse(contents))
    const projectId = encodeProjectId(discovery)
    const nodes = discoveryToNodes(discovery)
    loadNodes(projectId, nodes)
  }

  return (
    <div
      id="drop_zone"
      className="flex h-full w-full"
      onDrop={(event) => {
        event.preventDefault()
        if (props.disabled) {
          return
        }
        ;[...event.dataTransfer.items].forEach((item) => {
          if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
              void loadFromFile(file)
            }
          }
        })
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      {props.children}
    </div>
  )
}
