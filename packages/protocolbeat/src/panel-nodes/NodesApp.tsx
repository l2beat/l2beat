import { Controls } from './controls/Controls'
import { FileDropZone } from './view/FileDropZone'
import { Sidebar } from './view/Sidebar'
import { Viewport } from './view/Viewport'

interface AppProps {
  panelMode?: boolean
}

export function NodesApp(props: AppProps) {
  return (
    <FileDropZone disabled={!!props.panelMode}>
      <div className="relative h-full w-full flex-1">
        <Viewport />
        <Controls panelMode={!!props.panelMode} />
      </div>
      {!props.panelMode && <Sidebar />}
    </FileDropZone>
  )
}
