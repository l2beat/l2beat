import { Controls } from './controls/Controls'
import { Viewport } from './view/Viewport'

export function NodesApp() {
  return (
    <div className="relative h-full w-full flex-1">
      <Viewport />
      <Controls />
    </div>
  )
}
