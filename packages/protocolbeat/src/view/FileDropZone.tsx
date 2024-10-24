import { ReactNode } from 'react'
import { merge } from '../api/merge'
import { encodeProjectId, parseDiscovery } from '../api/paseDiscovery'
import { transformContracts } from '../api/transform'
import { nodeToSimpleNode } from '../store/actions/updateNodes'
import { useStore } from '../store/store'

export function FileDropZone(props: { children: ReactNode }) {
  const nodes = useStore((state) => state.nodes)
  const simpleNodes = nodes.map(nodeToSimpleNode)

  const setProjectId = useStore((state) => state.setProjectId)
  const updateNodes = useStore((state) => state.updateNodes)

  async function loadFromFile(file: File) {
    const contents = await file.text()
    const discovery = parseDiscovery(JSON.parse(contents))
    const projectId = encodeProjectId(discovery)
    const result = transformContracts(projectId, discovery)

    updateNodes(merge(simpleNodes, result))
    setProjectId(projectId)
  }

  return (
    <div
      id="drop_zone"
      className="h-full w-full"
      onDrop={(event) => {
        event.preventDefault()
        ;[...event.dataTransfer.items].forEach((item) => {
          if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
              loadFromFile(file).catch((e) => {
                throw e
              })
            }
          }
        })
      }}
      onDragOver={(event) => {
        event.preventDefault()
      }}
    >
      {props.children}
    </div>
  )
}
