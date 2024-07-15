import '@total-typescript/ts-reset'

import cx from 'classnames'
import { useState } from 'react'

import type { SimpleNode } from './api/SimpleNode'
import { deleteNode } from './api/delete'
import { merge } from './api/merge'
import { parseDiscovery } from './api/paseDiscovery'
import { transformContracts } from './api/transform'
import { nodeToSimpleNode } from './store/actions/updateNodes'
import { useStore } from './store/store'
import {
  decodeNodeLocations,
  getLayoutStorageKey,
} from './store/utils/storageParsing'
import { AutoLayoutButton } from './view/AutoLayoutButton'
import { Sidebar } from './view/Sidebar'
import { Viewport } from './view/Viewport'

export function App() {
  // load the initial nodes from the store that gets rehydrated from local storage at startup
  const initialNodes = useStore((state) => state.nodes)
  const hiddenNodesIds = useStore((state) => state.hiddenNodesIds)
  const projectId = useStore((state) => state.projectId)
  const updateNodeLocations = useStore((state) => state.updateNodeLocations)
  const setHiddenNodes = useStore((state) => state.setHiddenNodes)
  const setProjectId = useStore((state) => state.setProjectId)
  const [nodes, setNodes] = useState<SimpleNode[]>(
    initialNodes.map(nodeToSimpleNode),
  )
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const selectedIds = useStore((state) => state.selectedNodeIds)
  const selectedNodes = nodes.filter((x) => selectedIds.includes(x.id))
  const showSidebar = selectedNodes.length > 0

  function markLoading(id: string, value: boolean) {
    setLoading((loading) => ({ ...loading, [id]: value }))
  }

  function clear() {
    setNodes([])
    setHiddenNodes(() => [])
  }

  function save() {
    const data = localStorage.getItem(getLayoutStorageKey(projectId))
    if (data === null) {
      return
    }

    const blob = new Blob([data], { type: 'application/json' })
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `${projectId}-layout.json`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  function revealAllNodes() {
    setHiddenNodes(() => [])
  }

  async function loadFromFile(file: File) {
    console.log('LOADING')

    markLoading(`${file.name} parse`, true)

    const contents = await file.text()
    try {
      const locations = decodeNodeLocations(contents)
      if (locations.projectId !== projectId) {
        console.error(
          `Location data is for ${locations.projectId} but ${projectId} is loaded`,
        )
        return
      }

      updateNodeLocations(locations.locations)
    } catch (_) {
      const discovery = parseDiscovery(JSON.parse(contents))
      const result = transformContracts(discovery)

      setNodes((nodes) => merge(nodes, result))
      setProjectId(`${discovery.name}@${discovery.chain}`)
    }
    markLoading(`${file.name} parse`, false)
  }

  function deleteNodeAction(id: string[]) {
    try {
      const newNodes = deleteNode(nodes, id)
      setNodes(newNodes)
    } catch (e: unknown) {
      alert(e instanceof Error && e.message ? e.message : 'Unknown error')
    }
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
        className={cx(
          'grid h-full w-full grid-rows-[_1fr]',
          showSidebar ? 'grid-cols-[1fr,_400px]' : 'grid-cols-[1fr]',
        )}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <Viewport nodes={nodes} loading={loading} />

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
                  disabled={loading.global}
                  onClick={clear}
                  title="Clear"
                >
                  🚮
                </button>
                <button
                  className="px-1 text-2xl hover:bg-gray-300"
                  type="button"
                  disabled={loading.global}
                  onClick={save}
                  title="save"
                >
                  💾
                </button>
              </div>
            </div>
          </div>
        </div>

        {showSidebar && (
          <div className="row-span-2 bg-white p-2 drop-shadow-xl">
            <Sidebar
              selectedNodes={selectedNodes}
              onDeleteNodes={deleteNodeAction}
            />
          </div>
        )}
      </div>
    </div>
  )
}
