import { Effect } from '../effects'
import { Message } from '../messages'
import { State } from '../State'
import { updateInit } from './updateInit'

export function update(
  state: State | undefined,
  message: Message,
): [State, Effect[]] {
  if (message.type === 'InitMessage') {
    return updateInit(message)
  }
  throw new Error('Unknown message type!')
}
