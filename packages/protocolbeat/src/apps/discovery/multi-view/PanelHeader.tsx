import * as RadixSelect from '@radix-ui/react-select'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { getCode } from '../../../api/api'
import type { ApiAbi, Field } from '../../../api/types'
import { IconChatbot } from '../../../icons/IconChatbot'
import { IconChecked } from '../../../icons/IconChcked'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconClose } from '../../../icons/IconClose'
import { IconFullscreen } from '../../../icons/IconFullscreen'
import { IconFullscreenExit } from '../../../icons/IconFullscreenExit'
import { findSelected } from '../../../utils/findSelected'
import { getProjectQueryOptions } from '../hooks/projectQuery'
import { usePanelStore } from '../store/panel-store'
import { AVAILABLE_PANEL_IDS, PANEL_DEFINITIONS } from './panels'
import { type PanelId, useMultiViewStore } from './store'

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

  const Icon = PANEL_DEFINITIONS[props.id].icon

  return (
    <div className="group flex h-[36px] select-none border-coffee-600 border-y bg-coffee-800 px-[7px] py-1">
      <RadixSelect.Root
        value={props.id}
        onValueChange={(v) => changePanel(props.id, v as PanelId)}
      >
        <RadixSelect.Trigger
          aria-label="Panel"
          className={clsx(
            'group/sel inline-flex h-[26px] items-center gap-1.5 border-b px-2 font-bold text-xs uppercase outline-none transition-colors focus-visible:outline-none max-md:w-full',
            isActive
              ? 'border-coffee-200 text-coffee-100'
              : 'border-transparent text-coffee-200 hover:text-coffee-100',
          )}
        >
          <Icon className="size-3.5 shrink-0" />
          <RadixSelect.Value placeholder={props.id} />
          <IconChevronDown className="ml-auto size-3 opacity-60 transition-transform group-data-[state=open]/sel:rotate-180" />
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-[1000] cursor-default select-none border border-coffee-500 bg-coffee-800 font-bold text-coffee-200 text-xs uppercase shadow-lg"
          >
            <RadixSelect.Viewport>
              {AVAILABLE_PANEL_IDS.map((id) => {
                const ItemIcon = PANEL_DEFINITIONS[id].icon
                return (
                  <RadixSelect.Item
                    key={id}
                    value={id}
                    className="relative flex cursor-pointer items-center gap-2.5 py-2 pr-9 pl-2.5 outline-none focus-visible:outline-none data-[highlighted]:bg-coffee-600 data-[highlighted]:text-coffee-100"
                  >
                    <ItemIcon className="size-3.5 shrink-0" />
                    <RadixSelect.ItemText>{id}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator className="absolute right-2.5">
                      <IconChecked className="size-3" />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                )
              })}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
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
    result.push(s.code)
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
