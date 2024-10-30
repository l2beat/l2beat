import clsx from 'clsx'
import { IconClose } from '../icons/IconClose'
import { IconFullscreen } from '../icons/IconFullscreen'
import { IconFullscreenExit } from '../icons/IconFullscreenExit'
import { PANEL_IDS, PanelId, useMultiViewStore } from './store'

export function PanelHeader(props: { id: PanelId }) {
  const isFullScreen = useMultiViewStore(
    (state) => state.fullScreen === props.id,
  )
  const isActive = useMultiViewStore((state) => state.active === props.id)
  const changePanel = useMultiViewStore((state) => state.changePanel)
  const pickUp = useMultiViewStore((state) => state.pickUp)
  const toggleFullScren = useMultiViewStore((state) => state.toggleFullScren)
  const removePanel = useMultiViewStore((state) => state.removePanel)

  return (
    <div
      className={clsx(
        'group flex h-[36px] select-none border-black border-y px-[7px] py-1',
        isActive ? 'bg-blue-200' : 'bg-slate-100',
      )}
    >
      <select
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
        <button className="w-4" onClick={() => toggleFullScren(props.id)}>
          {isFullScreen ? <IconFullscreenExit /> : <IconFullscreen />}
        </button>
        <button className="w-4" onClick={() => removePanel(props.id)}>
          <IconClose />
        </button>
      </div>
    </div>
  )
}