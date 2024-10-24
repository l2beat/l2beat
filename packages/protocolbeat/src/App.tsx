import clsx from 'clsx'
import { merge } from './api/merge'
import { encodeProjectId, parseDiscovery } from './api/paseDiscovery'
import { transformContracts } from './api/transform'
import { Controls } from './controls/Controls'
import { nodeToSimpleNode } from './store/actions/updateNodes'
import { useStore } from './store/store'
import { Sidebar } from './view/Sidebar'
import { Viewport } from './view/Viewport'

export function App() {
  const nodes = useStore((state) => state.nodes)
  const simpleNodes = nodes.map(nodeToSimpleNode)

  const showSidebar = useStore((state) => state.selectedNodeIds.length === 1)

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
      <div
        className={clsx(
          'grid h-full w-full grid-rows-[_1fr]',
          showSidebar ? 'grid-cols-[1fr,_400px]' : 'grid-cols-[1fr]',
        )}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <Viewport />
          <Controls />
        </div>
        {showSidebar && <Sidebar />}
      </div>
    </div>
  )
}
