import { ReactNode } from 'react'
import { encodeProjectId, parseDiscovery } from '../api/paseDiscovery'
import { transformContracts } from '../api/transform'
import { useStore } from '../store/store'

export function FileDropZone(props: { children: ReactNode }) {
  const loadNodes = useStore((state) => state.loadNodes)

  async function loadFromFile(file: File) {
    const contents = await file.text()
    const discovery = parseDiscovery(JSON.parse(contents))
    const projectId = encodeProjectId(discovery)
    const result = transformContracts(projectId, discovery)
    loadNodes(projectId, result)
  }

  return (
    <div
      id="drop_zone"
      className="flex h-full w-full"
      onDrop={(event) => {
        event.preventDefault()
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
