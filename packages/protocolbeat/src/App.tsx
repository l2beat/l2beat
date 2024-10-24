import clsx from 'clsx'
import { merge } from './api/merge'
import { encodeProjectId, parseDiscovery } from './api/paseDiscovery'
import { transformContracts } from './api/transform'
import { nodeToSimpleNode } from './store/actions/updateNodes'
import { useStore } from './store/store'
import { OklchColor } from './utils/color'
import { AutoLayoutButton } from './view/AutoLayoutButton'
import { Sidebar } from './view/Sidebar'
import { Viewport } from './view/Viewport'

export function App() {
  const nodes = useStore((state) => state.nodes)
  const simpleNodes = nodes.map(nodeToSimpleNode)

  const hiddenNodesIds = useStore((state) => state.hiddenNodesIds)
  const setHiddenNodes = useStore((state) => state.setHiddenNodes)
  const setProjectId = useStore((state) => state.setProjectId)
  const selectedIds = useStore((state) => state.selectedNodeIds)
  const selectedNodes = simpleNodes.filter((x) => selectedIds.includes(x.id))
  const showSidebar = selectedNodes.length > 0

  const updateNodes = useStore((state) => state.updateNodes)

  function clear() {
    updateNodes([])
    setHiddenNodes(() => [])
  }

  function revealAllNodes() {
    setHiddenNodes(() => [])
  }

  async function loadFromFile(file: File) {
    const contents = await file.text()
    const discovery = parseDiscovery(JSON.parse(contents))
    const projectId = encodeProjectId(discovery)
    const result = transformContracts(projectId, discovery)

    updateNodes(merge(simpleNodes, result))
    setProjectId(projectId)
  }

  function colorChangeAction(id: string[], color: OklchColor) {
    const matching = simpleNodes
      .filter((n) => id.includes(n.id))
      .map((n) => ({ ...n, color }))
    const old = simpleNodes.filter((n) => !id.includes(n.id))
    updateNodes(old.concat(matching))
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

          <div className="absolute top-0 w-full p-2">
            <div className="flex flex-row content-center items-center justify-between">
              <div className="ml-2">Contracts loaded: {simpleNodes.length}</div>

              <div className="flex items-center gap-1">
                <AutoLayoutButton />
                <button
                  onClick={revealAllNodes}
                  className="rounded bg-blue-400 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Reveal all ({hiddenNodesIds.length})
                </button>
                <button
                  className="px-1 text-2xl hover:bg-gray-300"
                  type="button"
                  onClick={clear}
                  title="Clear"
                >
                  🚮
                </button>
              </div>
            </div>
          </div>
        </div>

        {showSidebar && (
          <div className="row-span-2 overflow-y-auto bg-white p-2 drop-shadow-xl">
            <Sidebar
              selectedNodes={selectedNodes}
              onHideNodes={(ids) => setHiddenNodes((c) => c.concat(ids))}
              onColorChange={colorChangeAction}
            />
          </div>
        )}
      </div>
    </div>
  )
}
