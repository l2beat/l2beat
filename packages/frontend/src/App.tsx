import '@total-typescript/ts-reset'

import cx from 'classnames'
import { useState } from 'react'

import { deleteNode } from './api/delete'
import { discover } from './api/discover'
import { merge } from './api/merge'
import { SimpleNode } from './api/SimpleNode'
import { nodeToSimpleNode } from './store/actions/updateNodes'
import { useStore } from './store/store'
import { Sidebar } from './view/Sidebar'
import { Viewport } from './view/Viewport'

export function App() {
  // load the initial nodes from the store that gets rehydrated from local storage at startup
  const initialNodes = useStore((state) => state.nodes)
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

  async function discoverContract(address: string) {
    console.log('DISCOVERING', address)

    markLoading(address, true)
    const result = await discover(address)
    markLoading(address, false)
    setNodes((nodes) => merge(nodes, result))
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
          <div className="flex flex-row content-center items-center	 justify-between">
            <div className="ml-2">Contracts loaded: {nodes.length}</div>

            <div>
              <button
                className={cx(
                  'rounded bg-blue-500 py-2 px-4 font-bold text-white',
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

            <div>
              <button
                className="ml-2	text-2xl"
                type="button"
                disabled={loading.global}
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
        <div className="row-span-2 bg-white p-2 drop-shadow-xl">
          <Sidebar
            selectedNodes={selectedNodes}
            onDeleteNodes={deleteNodeAction}
          />
        </div>
      )}
    </div>
  )
}
