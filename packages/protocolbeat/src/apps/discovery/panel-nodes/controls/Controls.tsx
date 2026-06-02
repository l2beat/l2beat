import type { ReactNode } from 'react'
import { ClusterLayoutButton } from './ClusterLayoutButton'
import { ColorButton } from './ColorButton'
import { EntrypointButton } from './EntrypointButton'
import { GroupSimilarButton } from './GroupSimilarButton'
import { HideButton } from './HideButton'
import { HideNodesButton } from './HideNodesButton'
import { LayoutFileButtons } from './LayoutFileButtons'
import { RedoButton } from './RedoButton'
import { Settings } from './Settings'
import { ShowButton } from './ShowButton'
import { SimilarImplementationButton } from './SimilarImplementationButton'
import { StackLayoutButton } from './StackLayoutButton'
import { UndoButton } from './UndoButton'
import { ValuesButton } from './ValuesButton'

export function Controls() {
  return (
    <div className="absolute inset-x-2 bottom-4 z-10 flex justify-center">
      <div className="flex max-w-full flex-wrap justify-center gap-2 pb-1">
        <ControlGroup>
          <UndoButton />
          <RedoButton />
          <ClusterLayoutButton />
          <StackLayoutButton />
          <GroupSimilarButton />
        </ControlGroup>
        <ControlGroup>
          <ShowButton />
          <HideNodesButton />
          <EntrypointButton />
        </ControlGroup>
        <ControlGroup>
          <HideButton />
          <ColorButton />
          <SimilarImplementationButton />
          <ValuesButton />
          <Settings className="px-2.5" />
          <LayoutFileButtons orientation="row" buttonClassName="px-2.5" />
        </ControlGroup>
      </div>
    </div>
  )
}

function ControlGroup(props: { children: ReactNode }) {
  return (
    <div className="flex select-none items-stretch gap-2 rounded-2xl bg-coffee-900/95 px-3 py-2 shadow-[0_24px_56px_-28px_#000000ee] backdrop-blur-sm max-md:text-xs">
      {props.children}
    </div>
  )
}
