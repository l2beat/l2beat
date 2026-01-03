import type {
  InteropPlugin,
  InteropPluginResyncable,
} from '../../plugins/types'

export function isPluginResyncable(
  plugin: InteropPlugin,
): plugin is InteropPluginResyncable {
  return 'getDataRequests' in plugin
}
