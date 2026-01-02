import type { DataRequest, InteropPlugin } from '../../plugins/types'

export function isPluginResyncable(
  plugin: InteropPlugin,
): plugin is InteropPlugin & {
  getDataRequests: () => DataRequest[]
} {
  return plugin.getDataRequests !== undefined
}
