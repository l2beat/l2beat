import { IS_READONLY } from '../../../../config/readonly'
import { useGlobalSettingsStore } from '../../store/global-settings-store'
import { StatusRibbon } from './StatusRibbon'

export function BottomBar() {
  const maxReachableDepth = useGlobalSettingsStore((s) => s.maxReachableDepth)
  const depthSpecified = maxReachableDepth !== null

  return (
    <div className="hidden h-7 select-none items-center justify-between border-coffee-700 border-t bg-coffee-800 px-2 text-xs md:flex">
      <div className="flex gap-2 text-coffee-400">
        <div>Copyright {new Date().getUTCFullYear()} ETHBEAT</div>
        {IS_READONLY && (
          <>
            <span>-</span>
            <div className="italic">
              That's the latest state reviewed by ETHBEAT.
            </div>
          </>
        )}
      </div>
      <div className="flex h-full items-center gap-3">
        {depthSpecified && (
          <div className="flex items-center justify-center rounded-sm border border-aux-green/60 px-1.5 text-aux-green">
            Depth: {maxReachableDepth}
          </div>
        )}
        <StatusRibbon />
      </div>
    </div>
  )
}
