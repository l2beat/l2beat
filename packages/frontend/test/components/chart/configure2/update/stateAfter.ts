import { Effect } from '../../../../../src/components/chart/configure2/effects/effects'
import { Message } from '../../../../../src/components/chart/configure2/messages'
import { EMPTY_STATE } from '../../../../../src/components/chart/configure2/state/empty'
import { State } from '../../../../../src/components/chart/configure2/state/State'
import { update } from '../../../../../src/components/chart/configure2/update/update'

export function stateAfter(messages: Message[]) {
  const initialValue: [State, Effect[]] = [EMPTY_STATE, []]
  return messages.reduce(
    ([state], message) => update(state, message),
    initialValue,
  )
}
