import classNames from 'classnames'
import ky from 'ky'
import { useState } from 'react'

import { createEmptyNodes, transformContracts } from './transform'
import { ProjectParameters } from './types'
import { SimpleNode } from './view/utils/SimpleNode'
import { Viewport } from './view/Viewport'

export function App() {
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<Record<string, boolean | undefined>>(
    {},
  )

  function markLoading(id: string, value: boolean) {
    setLoading((loading) => ({ ...loading, [id]: value }))
  }

  const [contractNodes, setContractNodes] = useState<SimpleNode[]>([])

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
    const discoveredContracts = await callDiscoverContractApi(address)
    markLoading(address, false)
    setContractNodes((contractNodes) => {
      const newNodes = transformContracts(discoveredContracts)
      const allContractNodesCombined = [...newNodes, ...contractNodes].filter(
        (x, i, a) => a.findIndex((y) => y.id === x.id) === i,
      )
      const emptyNodes = createEmptyNodes(allContractNodesCombined)

      return [...allContractNodesCombined, ...emptyNodes]
    })
  }

  const selectedData = contractNodes.find((x) => x.id === selected)?.data

  return (
    <div className="h-full w-full grid grid-cols-[1fr,_400px] grid-rows-[64px,_1fr]">
      <div className="flex h-full w-full justify-center items-center">
        <button
          className={classNames(
            'bg-blue-500 text-white font-bold py-2 px-4 rounded',
            !loading.global && 'hover:bg-blue-700',
          )}
          type="button"
          disabled={loading.global}
          onClick={() => void showPrompt()}
        >
          Discover!
          {loading.global && '🔄'}
        </button>
        <p className="ml-2">Contracts loaded: {contractNodes.length}</p>
      </div>

      <div className="row-span-2 bg-white drop-shadow-xl p-2">
        {!selected && 'Click a contract to select it.'}
        {selectedData !== undefined ? (
          <pre className="text-sm h-full overflow-auto">
            <code>{JSON.stringify(selectedData, null, 2)}</code>
          </pre>
        ) : null}
      </div>

      <div className="flex justify-center items-center gap-4 p-2 w-full h-full">
        <Viewport
          nodes={contractNodes}
          loading={loading}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onDiscover={discoverContract}
          onSelectionChange={(ids) => setSelected(ids[0])}
        />
      </div>
    </div>
  )
}

async function callDiscoverContractApi(
  address: string,
): Promise<ProjectParameters> {
  console.log('Loading: ', address)

  const discovery: ProjectParameters = await ky
    .get(`/api/discover/${address}?maxDepth=0`, { timeout: 9999999 })
    .json()

  return discovery
}
