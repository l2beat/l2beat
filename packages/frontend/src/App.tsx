import '@total-typescript/ts-reset'

import { DiscoveryOutput } from '@l2beat/discovery-types'
import cx from 'classnames'
import { useState } from 'react'

import { deleteNode } from './api/delete'
import { discover } from './api/discover'
import { merge } from './api/merge'
import { SimpleNode } from './api/SimpleNode'
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
  const projectId = useStore((state) => state.projectId)
  const updateNodeLocations = useStore((state) => state.updateNodeLocations)
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

  async function showPrompt() {
    const address = window.prompt('Contract address')
    if (!address) return []

    markLoading('global', true)
    await discoverContract(address)
    markLoading('global', false)
  }

  function clear() {
    setNodes([])
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

  async function discoverContract(address: string) {
    console.log('DISCOVERING', address)

    markLoading(address, true)
    const result = await discover(address)
    markLoading(address, false)
    setNodes((nodes) => merge(nodes, result))
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
      const parsed: unknown = JSON.parse(contents)
      const discovery = parsed as DiscoveryOutput
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
          <Viewport
            nodes={nodes}
            loading={loading}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onDiscover={discoverContract}
          />

          <div className="absolute top-0 w-full p-2">
            <div className="flex flex-row content-center items-center justify-between">
              <div className="ml-2">Contracts loaded: {nodes.length}</div>

              <div>
                <button
                  className={cx(
                    'rounded bg-blue-500 px-4 py-2 font-bold text-white',
                    !loading.global && 'hover:bg-blue-700',
                  )}
                  type="button"
                  disabled={loading.global}
                  onClick={() => void showPrompt()}
                >
                  Discover!
                  {loading.global && '🔄'}
                </button>
              </div>

              <div className="flex items-center">
                <AutoLayoutButton />
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
