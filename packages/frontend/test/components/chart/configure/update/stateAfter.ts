import { Effect } from '../../../../../src/components/chart/configure/effects/effects'
import { Message } from '../../../../../src/components/chart/configure/messages'
import { EMPTY_STATE } from '../../../../../src/components/chart/configure/state/empty'
import { State } from '../../../../../src/components/chart/configure/state/State'
import { update } from '../../../../../src/components/chart/configure/update/update'

export function stateAfter(messages: Message[]) {
  const initialValue: [State, Effect[]] = [EMPTY_STATE, []]
  return messages.reduce(
    ([state], message) => update(state, message),
    initialValue,
  )
}
