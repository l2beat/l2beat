import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import type { ApiAbi, Field } from '../api/types'
import { findSelected } from '../common/findSelected'
import { isReadOnly } from '../config'
import { IconChatbot } from '../icons/IconChatbot'
import { IconClose } from '../icons/IconClose'
import { IconFullscreen } from '../icons/IconFullscreen'
import { IconFullscreenExit } from '../icons/IconFullscreenExit'
import { usePanelStore } from '../store/store'
import { PANEL_IDS, type PanelId, useMultiViewStore } from './store'

export function PanelHeader(props: { id: PanelId }) {
  const isFullScreen = useMultiViewStore(
    (state) => state.fullScreen === props.id,
  )
  const isActive = useMultiViewStore((state) => state.active === props.id)
  const changePanel = useMultiViewStore((state) => state.changePanel)
  const pickUp = useMultiViewStore((state) => state.pickUp)
  const toggleFullScreen = useMultiViewStore((state) => state.toggleFullScreen)
  const removePanel = useMultiViewStore((state) => state.removePanel)
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected)
  const highlighted = usePanelStore((state) => state.highlighted)

  const availablePanels = isReadOnly
    ? PANEL_IDS.filter((id) => id !== 'terminal')
    : PANEL_IDS

  return (
    <div className="group flex h-[36px] select-none border-coffee-600 border-y bg-coffee-800 px-[7px] py-1">
      <select
        className={clsx(
          'rounded-none border-b bg-coffee-800 font-bold text-xs uppercase max-md:w-full',
          isActive ? 'border-coffee-200' : 'border-coffee-800',
        )}
        value={props.id}
        onChange={(e) => changePanel(props.id, e.target.value as PanelId)}
      >
        {availablePanels.map((id) => (
          <option key={id} value={id}>
            {id.slice(0, 1).toUpperCase() + id.slice(1)}
          </option>
        ))}
      </select>
      <div
        className={clsx('flex-1', !isFullScreen && 'cursor-move')}
        onMouseDown={
          !isFullScreen ? (e) => e.button === 0 && pickUp(props.id) : undefined
        }
      />
      <div className="hidden gap-1 md:group-hover:flex">
        <button
          onClick={() =>
            toClipboard(props.id, project, selectedAddress, highlighted)
          }
          className="w-4"
          hidden={!['code', 'values', 'list', 'nodes'].includes(props.id)}
        >
          <IconChatbot />
        </button>
        <button className="w-4" onClick={() => toggleFullScreen(props.id)}>
          {isFullScreen ? <IconFullscreenExit /> : <IconFullscreen />}
        </button>
        <button className="w-4" onClick={() => removePanel(props.id)}>
          <IconClose />
        </button>
      </div>
    </div>
  )
}

async function formatContractCode(
  project: string,
  address: string | undefined,
  _name?: string,
  chain?: string,
) {
  if (!address) return []
  const sources = (await getCode(project, address))?.sources ?? []
  const result: string[] = []
  for (const s of sources) {
    let header = `Flattened source code of ${s.name}`
    if (address) header += ` (${address})`
    if (chain) header += ` on chain ${chain}`
    result.push('\n' + header + ':')
    result.push('```')
    result.push(s.code)
    result.push('```')
  }
  return result
}

interface ContractValues {
  address: string
  fields?: Field[]
}

function formatContractValues(
  contract: ContractValues,
  blockNumber?: number,
  chain?: string,
) {
  if (contract.fields === undefined || contract.fields.length === 0) {
    return []
  }

  const result: string[] = []
  let header = 'Contract state from public functions and event handlers'
  if (blockNumber !== undefined && chain) {
    header += ` for block number ${blockNumber} on chain ${chain}`
  }
  if (contract.address) header += ` (${contract.address})`
  result.push('\n' + header + ':')
  result.push('```')
  for (const f of contract.fields) {
    result.push(`${f.name}: ${JSON.stringify(f.value)}`)
  }
  result.push('```')
  return result
}

interface ContractAbi {
  address: string
  abis?: ApiAbi[]
}

function formatContractAbi(contract: ContractAbi, chain?: string) {
  if (contract.abis === undefined || contract.abis.length === 0) {
    return []
  }

  const result: string[] = []
  let header = 'Contract ABI'
  if (contract.address) header += ` for ${contract.address}`
  if (chain) header += ` on chain ${chain}`
  result.push('\n' + header + ':')
  result.push('```')
  for (const a of contract.abis) {
    for (const e of a.entries) {
      let abi = e.value
      if (e.signature) {
        abi += ` //${e.signature}`
      } else if (e.value.startsWith('event') && e.topic) {
        abi += ` //${e.topic}`
      }
      result.push(abi)
    }
  }
  result.push('```')
  return result
}

const toClipboard = async (
  panel: PanelId,
  project: string | undefined,
  selectedAddress: string | undefined,
  highlighted: readonly string[],
) => {
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const availablePanels = ['code', 'values', 'list', 'nodes']
  if (!availablePanels.includes(panel)) {
    return
  }

  let message: string[] = []
  switch (panel) {
    case 'code': {
      message = await formatContractCode(project, selectedAddress)
      break
    }
    case 'values': {
      const projectData = await getProject(project)
      const contract = findSelected(projectData.entries, selectedAddress)
      if (!contract) break
      const fields = formatContractValues(
        contract,
        contract.blockNumber,
        contract.chain,
      )
      const abis = formatContractAbi(contract, contract.chain)
      message = [...fields, ...abis]
      break
    }
    case 'list': {
      const projectData = await getProject(project)
      for (const chain of projectData.entries) {
        const contracts = [
          ...chain.initialContracts,
          ...chain.discoveredContracts,
        ]
        for (const contract of contracts) {
          const code = await formatContractCode(
            project,
            contract.address,
            contract.name,
            chain.chain,
          )
          const values = formatContractValues(
            contract,
            chain.blockNumber,
            chain.chain,
          )
          const abi = formatContractAbi(contract, chain.chain)
          message.push(...code, ...values, ...abi)
        }
      }
      break
    }
    case 'nodes': {
      const projectData = await getProject(project)
      for (const chain of projectData.entries) {
        const contracts = [
          ...chain.initialContracts,
          ...chain.discoveredContracts,
        ].filter((c) => highlighted.includes(c.address))

        for (const contract of contracts) {
          const code = await formatContractCode(
            project,
            contract.address,
            contract.name,
            chain.chain,
          )
          const values = formatContractValues(
            contract,
            chain.blockNumber,
            chain.chain,
          )
          const abi = formatContractAbi(contract, chain.chain)
          message.push(...code, ...values, ...abi)
        }
      }

      break
    }
  }

  navigator.clipboard.writeText(message.join('\n'))
}
