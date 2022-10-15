import { Effect } from '../effects/effects'
import { Message } from '../messages'
import { State } from '../state/State'
import { updateInit } from './updateInit'

export function update(state: State, message: Message): [State, Effect[]] {
  if (message.type === 'Init') {
    return updateInit(message)
  }
  throw new Error('Unknown message type!')
}
