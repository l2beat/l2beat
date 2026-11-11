import { useId } from 'react'
import { Switch } from '../../../../components/Switch'
import { DEFAULT_USER_PREFERENCES } from '../../panel-nodes/store/persistence'
import { useStore } from '../../panel-nodes/store/store'
import { SettingRow, SettingsSection } from './SettingRow'

export function NodesSettingsTab() {
  const preferences = useStore((state) => state.userPreferences)
  const setPreferences = useStore((state) => state.setPreferences)
  const enableDimmingId = useId()
  const hideLargeArraysId = useId()
  const highlightOverlappingId = useId()

  return (
    <SettingsSection title="Graph">
      <SettingRow
        title="Enable dimming on selection"
        description="When a node is selected, unrelated nodes fade out so its direct connections stand out."
        controlId={enableDimmingId}
        isDefault={
          preferences.enableDimming === DEFAULT_USER_PREFERENCES.enableDimming
        }
        onReset={() =>
          setPreferences({
            enableDimming: DEFAULT_USER_PREFERENCES.enableDimming,
          })
        }
      >
        <Switch
          id={enableDimmingId}
          checked={preferences.enableDimming}
          onCheckedChange={(enableDimming) => setPreferences({ enableDimming })}
        />
      </SettingRow>
      <SettingRow
        title="Hide large arrays on load"
        description="Fields containing long arrays are collapsed by default to keep nodes compact and the graph readable."
        controlId={hideLargeArraysId}
        isDefault={
          preferences.hideLargeArrays ===
          DEFAULT_USER_PREFERENCES.hideLargeArrays
        }
        onReset={() =>
          setPreferences({
            hideLargeArrays: DEFAULT_USER_PREFERENCES.hideLargeArrays,
          })
        }
      >
        <Switch
          id={hideLargeArraysId}
          checked={preferences.hideLargeArrays}
          onCheckedChange={(hideLargeArrays) =>
            setPreferences({ hideLargeArrays })
          }
        />
      </SettingRow>
      <SettingRow
        title="Highlight overlapping nodes"
        description="Draw an accent outline around nodes whose bounding boxes intersect, so a smaller node hidden behind a larger one is still visible."
        controlId={highlightOverlappingId}
        isDefault={
          preferences.highlightOverlapping ===
          DEFAULT_USER_PREFERENCES.highlightOverlapping
        }
        onReset={() =>
          setPreferences({
            highlightOverlapping: DEFAULT_USER_PREFERENCES.highlightOverlapping,
          })
        }
      >
        <Switch
          id={highlightOverlappingId}
          checked={preferences.highlightOverlapping}
          onCheckedChange={(highlightOverlapping) =>
            setPreferences({ highlightOverlapping })
          }
        />
      </SettingRow>
    </SettingsSection>
  )
}
