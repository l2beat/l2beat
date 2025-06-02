import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import type { ApiProjectContract } from '../api/types'
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
          onClick={() => toClipboard(props.id, project, selectedAddress)}
          className="w-4"
          hidden={!['code', 'values'].includes(props.id)}
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

// Ideas:
// - make it configurable per-project per-panel and store in browser cache
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
        message.push(`Flattened source code of ${s.name}:`)
        message.push(`\`\`\``)
        message.push(s.code)
        message.push(`\`\`\``)
      }

      navigator.clipboard.writeText(message.join('\n'))
      break
    }
    case 'values': {
      const projectData = await getProject(project)

      const contract = findSelected(projectData.entries, selectedAddress)
      if (!contract) break

      const fields: string[] = []
      if ('fields' in contract) {
        fields.push(
          `Contract state from public functions and event handlers for block number ${contract.blockNumber} on chain ${contract.chain}:`,
        )

        for (const f of (contract as ApiProjectContract).fields) {
          fields.push(`${f.name}: ${JSON.stringify(f.value)}`)
        }
      }

      const abis: string[] = []
      if ('abis' in contract) {
        abis.push(
          `\nContract ABI:`,
        )

        for (const a of (contract as ApiProjectContract).abis) {
          for (const e of a.entries) {
            let abi = e.value
            if (e.signature) {
              abi += ` //${e.signature}`
            } else if (e.value.startsWith('event') && e.topic) {
              abi += ` //${e.topic}`
            }
            abis.push(abi)
          }
        }
      }

      navigator.clipboard.writeText([...fields, ...abis].join('\n'))
    }
  }
}
