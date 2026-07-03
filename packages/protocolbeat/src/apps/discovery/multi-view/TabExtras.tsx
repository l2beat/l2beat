import { useParams } from 'react-router-dom'
import { getCode } from '../../../api/api'
import type { ApiAbi, Field } from '../../../api/types'
import { IconChatbot } from '../../../icons/IconChatbot'
import { findSelected } from '../../../utils/findSelected'
import { getProjectQueryOptions } from '../hooks/projectQuery'
import { joinDeclarations } from '../panel-code/declarations'
import { usePanelStore } from '../store/panel-store'
import type { PanelId } from './config'

const COPYABLE_PANELS: PanelId[] = ['code', 'values', 'list', 'nodes']

export function TabExtras(props: { id: PanelId }) {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected[0])
  const highlighted = usePanelStore((state) => state.highlighted)

  if (!COPYABLE_PANELS.includes(props.id)) {
    return null
  }

  return (
    <button
      type="button"
      className="w-4 text-coffee-200 hover:text-coffee-100"
      onClick={() =>
        toClipboard(props.id, project, selectedAddress, highlighted)
      }
      aria-label="Copy panel context"
    >
      <IconChatbot />
    </button>
  )
}

async function formatContractCode(
  project: string,
  address: string | undefined,
  _name?: string,
) {
  const chain = address?.split(':')[0]
  if (!address) return []
  const sources = (await getCode(project, address))?.sources ?? []
  const result: string[] = []
  for (const s of sources) {
    let header = `Flattened source code of ${s.name}`
    if (address) header += ` (${address})`
    if (chain) header += ` on chain ${chain}`
    result.push('\n' + header + ':')
    result.push('```')
    result.push(joinDeclarations(s.declarations))
    result.push('```')
  }
  return result
}

interface ContractValues {
  address: string
  chain: string
  fields?: Field[]
}

function formatContractValues(contract: ContractValues, blockNumber?: number) {
  const chain = contract.chain
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
  chain: string
  abis?: ApiAbi[]
}

function formatContractAbi(contract: ContractAbi) {
  const chain = contract.chain
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

async function toClipboard(
  panel: PanelId,
  project: string | undefined,
  selectedAddress: string | undefined,
  highlighted: readonly string[],
) {
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  if (!COPYABLE_PANELS.includes(panel)) return

  let message: string[] = []
  switch (panel) {
    case 'code': {
      message = await formatContractCode(project, selectedAddress)
      break
    }
    case 'values': {
      const projectData = await getProjectQueryOptions(project).queryFn()
      const contract = findSelected(projectData.entries, selectedAddress)
      if (!contract) break
      const fields = formatContractValues(contract, contract.blockNumber)
      const abis = formatContractAbi(contract)
      message = [...fields, ...abis]
      break
    }
    case 'list': {
      const projectData = await getProjectQueryOptions(project).queryFn()
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
          )
          const values = formatContractValues(
            contract,
            chain.blockNumbers[contract.chain],
          )
          const abi = formatContractAbi(contract)
          message.push(...code, ...values, ...abi)
        }
      }
      break
    }
    case 'nodes': {
      const projectData = await getProjectQueryOptions(project).queryFn()
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
          )
          const values = formatContractValues(
            contract,
            chain.blockNumbers[contract.chain],
          )
          const abi = formatContractAbi(contract)
          message.push(...code, ...values, ...abi)
        }
      }
      break
    }
  }

  navigator.clipboard.writeText(message.join('\n'))
}
