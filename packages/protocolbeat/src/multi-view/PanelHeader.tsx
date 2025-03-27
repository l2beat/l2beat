import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import type { ApiProjectChain, ApiProjectContract } from '../api/types'
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

  return (
    <div className="group flex h-[36px] select-none border-coffee-600 border-y bg-coffee-800 px-[7px] py-1">
      <select
        className={clsx(
          'border-b bg-coffee-800 font-bold text-xs uppercase',
          isActive ? 'border-coffee-200' : 'border-coffee-800',
        )}
        value={props.id}
        onChange={(e) => changePanel(props.id, e.target.value as PanelId)}
      >
        {PANEL_IDS.map((id) => (
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
      <div className="hidden gap-1 group-hover:flex">
        <button
          onClick={() => toClipboard(props.id, project, selectedAddress)}
          className="w-4"
        >
          cc
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

const toClipboard = async (
  panel: PanelId,
  project: string | undefined,
  selectedAddress: string | undefined,
) => {
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  switch (panel) {
    case 'code': {
      const sources = (await getCode(project, selectedAddress))?.sources ?? []

      const message: string[] = []

      for (const s of sources) {
        message.push(`This is a source code for contract ${s.name}`)
        message.push(`\`\`\``)
        message.push(s.code)
        message.push(`\`\`\``)
      }

      navigator.clipboard.writeText(message.join('\n'))
      break
    }
    case 'values': {
      const projectData = await getProject(project)

      const data = findSelected(projectData.entries, selectedAddress)
      if (!data) break

      if ('abis' in data) {
        const abis: string[] = [`This is an ABI`]

        for (const a of (data as ApiProjectContract).abis) {
          for (const e of a.entries) {
            abis.push(e.value)
          }
        }

        navigator.clipboard.writeText(abis.join('\n'))
      }
    }
  }
}

function findSelected(chains: ApiProjectChain[], address: string | undefined) {
  if (!address) {
    return
  }
  for (const chain of chains) {
    for (const contract of chain.initialContracts) {
      if (contract.address === address) {
        return contract
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return contract
      }
    }
    for (const eoa of chain.eoas) {
      if (eoa.address === address) {
        return eoa
      }
    }
  }
}
