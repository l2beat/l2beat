import '@total-typescript/ts-reset'

import clsx from 'clsx'
import { useState } from 'react'

import type { SimpleNode } from './api/SimpleNode'
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
  // load the initial nodes from the store that gets rehydrated from local storage at startup
  const initialNodes = useStore((state) => state.nodes)
  const hiddenNodesIds = useStore((state) => state.hiddenNodesIds)
  const setHiddenNodes = useStore((state) => state.setHiddenNodes)
  const setProjectId = useStore((state) => state.setProjectId)
  const [nodes, setNodes] = useState<SimpleNode[]>(
    initialNodes.map(nodeToSimpleNode),
  )
  const selectedIds = useStore((state) => state.selectedNodeIds)
  const selectedNodes = nodes.filter((x) => selectedIds.includes(x.id))
  const showSidebar = selectedNodes.length > 0

  function clear() {
    setNodes([])
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

    setNodes((nodes) => merge(nodes, result))
    setProjectId(projectId)
  }

  function colorChangeAction(id: string[], color: OklchColor) {
    const matching = nodes
      .filter((n) => id.includes(n.id))
      .map((n) => ({ ...n, color }))
    const old = nodes.filter((n) => !id.includes(n.id))
    setNodes(old.concat(matching))
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
          <Viewport nodes={nodes} />

          <div className="absolute top-0 w-full p-2">
            <div className="flex flex-row content-center items-center justify-between">
              <div className="ml-2">Contracts loaded: {nodes.length}</div>

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
