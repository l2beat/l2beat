import { ClearButton } from './ClearButton'
import { ColorButton } from './ColorButton'
import { FastLayoutButton } from './FastLayoutButton'
import { HideButton } from './HideButton'
import { ShowButton } from './ShowButton'
import { SlowLayoutButton } from './SlowLayoutButton'

export function Controls() {
  return (
    <div className="-translate-x-1/2 absolute bottom-8 left-1/2 flex items-center gap-1 rounded-lg bg-white p-2 shadow-xl">
      <SlowLayoutButton />
      <FastLayoutButton />
      <span className="opacity-20">|</span>
      <ShowButton />
      <HideButton />
      <ColorButton />
      <ClearButton />
    </div>
  )
}
