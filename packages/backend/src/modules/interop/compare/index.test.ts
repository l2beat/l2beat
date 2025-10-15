import { assert } from '@l2beat/shared-pure'
import { createBridgeComparePlugins } from '.'

describe('Compare Plugins', () => {
  const plugins = createBridgeComparePlugins()

  describe('every plugin name is unique', () => {
    const known = new Set<string>()

    for (const plugin of plugins) {
      it(plugin.name, () => {
        assert(
          !known.has(plugin.name),
          `Plugin name "${plugin.name}" is not unique.`,
        )
        known.add(plugin.name)
      })
    }
  })
})
