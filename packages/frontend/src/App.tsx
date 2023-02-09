import classNames from 'classnames'
import { useState } from 'react'

import { discover } from './api/discover'
import { merge } from './api/merge'
import { SimpleNode } from './api/SimpleNode'
import { Viewport } from './view/Viewport'

export function App() {
  const [nodes, setNodes] = useState<SimpleNode[]>([])
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<Record<string, boolean | undefined>>(
    {},
  )

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

  async function discoverContract(address: string) {
    console.log('DISCOVERING', address)

    markLoading(address, true)
    const result = await discover(address)
    markLoading(address, false)
    setNodes((nodes) => merge(nodes, result))
  }

  const selectedData = nodes.find((x) => x.id === selected)?.data

  return (
    <div className="grid h-full w-full grid-cols-[1fr,_400px] grid-rows-[64px,_1fr]">
      <div className="flex h-full w-full items-center justify-center">
        <button
          className={classNames(
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
        <p className="ml-2">Contracts loaded: {nodes.length}</p>
      </div>

      <div className="row-span-2 bg-white p-2 drop-shadow-xl">
        {!selected && 'Click a contract to select it.'}
        {selectedData !== undefined ? (
          <pre className="h-full overflow-auto text-sm">
            <code>{JSON.stringify(selectedData, null, 2)}</code>
          </pre>
        ) : null}
      </div>

      <div className="flex h-full w-full items-center justify-center gap-4 p-2">
        <Viewport
          nodes={nodes}
          loading={loading}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onDiscover={discoverContract}
          onSelectionChange={(ids) => setSelected(ids[0])}
        />
      </div>
    </div>
  )
}
