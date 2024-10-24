import { Controls } from './controls/Controls'
import { FileDropZone } from './view/FileDropZone'
import { Sidebar } from './view/Sidebar'
import { Viewport } from './view/Viewport'

export function App() {
  return (
    <FileDropZone>
      <div className="relative h-full w-full flex-1">
        <Viewport />
        <Controls />
      </div>
      <Sidebar />
    </FileDropZone>
  )
}
