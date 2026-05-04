import { ClusterLayoutButton } from './ClusterLayoutButton'
import { ColorButton } from './ColorButton'
import { HideButton } from './HideButton'
import { HideNodesButton } from './HideNodesButton'
import { LayoutFileButtons } from './LayoutFileButtons'
import { RedoButton } from './RedoButton'
import { Settings } from './Settings'
import { ShowButton } from './ShowButton'
import { StackLayoutButton } from './StackLayoutButton'
import { UndoButton } from './UndoButton'
import { ValuesButton } from './ValuesButton'

export function Controls() {
  return (
    <div className="absolute inset-x-4 bottom-6 z-10 flex justify-center">
      <div className="max-w-full overflow-x-auto pb-1">
        <div className="flex min-w-max select-none items-stretch gap-2 rounded-2xl bg-coffee-900/95 px-3 py-2 shadow-[0_24px_56px_-28px_#000000ee] backdrop-blur-sm">
          <UndoButton />
          <RedoButton />
          <Divider />
          <ClusterLayoutButton />
          <StackLayoutButton />
          <Divider />
          <ShowButton />
          <HideNodesButton />
          <Divider />
          <HideButton />
          <ColorButton />
          <ValuesButton />
          <Divider />
          <Settings className="px-2.5" />
          <LayoutFileButtons orientation="row" buttonClassName="px-2.5" />
        </div>
      </div>
    </div>
  )
}

function Divider() {
  return <div className="w-px self-stretch bg-coffee-600/80" />
}
