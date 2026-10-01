/**
 * Which event an event-handler action reads, decided as V1's
 * `getEventFragment` decides it: a string containing a space is a full
 * fragment, anything else names the first ABI entry starting
 * `event <name>(`.
 *
 * Two consequences the model cannot see from the ABI alone: a
 * `Name(types)` signature matches nothing, and a bare name of an
 * overloaded event reads only its first declaration, whatever the current
 * code emits. The resolution carries the overloads so the second can be
 * pointed out.
 */
import type { utils } from 'ethers'
import { getEventFragment } from '../../handlers/utils/getEventFragment'
import { toEventFragment } from '../../handlers/utils/toEventFragment'
import { type AbiIndex, fullSignature, sighash } from '../abi/AbiIndex'
import { closest } from '../closest'

export type EventResolution =
  | {
      fragment: utils.EventFragment
      /** False for a full fragment this ABI does not declare. */
      inAbi: boolean
      /** Every declaration sharing the name, when a bare name was used. */
      overloads: utils.EventFragment[]
      error?: undefined
    }
  | { fragment?: undefined; error: string }

export function resolveEvent(
  reference: string,
  abi: readonly string[],
  index: AbiIndex,
): EventResolution {
  if (reference.includes(' ')) {
    return resolveFullEventFragment(reference, index)
  }
  if (reference.includes('(')) {
    return { error: eventSignatureSpelling(reference, index) }
  }
  let fragment: utils.EventFragment
  try {
    fragment = getEventFragment(reference, [...new Set(abi)])
  } catch {
    const hints = closest(index.eventNames(), reference)
    return {
      error: `there is no event "${reference}" in the ABI; closest: ${hints.join(', ')}`,
    }
  }
  const overloads = index.events.filter((event) => event.name === reference)
  return { fragment, inAbi: true, overloads }
}

function resolveFullEventFragment(
  reference: string,
  index: AbiIndex,
): EventResolution {
  let fragment: utils.EventFragment
  try {
    fragment = toEventFragment(reference)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return {
      error: `"${reference}" contains a space, so V1 parses it as a full event fragment, and it does not parse (${reason}); write the bare event name or "event Name(type indexed name, …)"`,
    }
  }
  const known = index.events.find(
    (event) => sighash(event) === sighash(fragment),
  )
  if (known !== undefined && fullSignature(known) !== fullSignature(fragment)) {
    return {
      error: `"${reference}" declares the event differently from the ABI, and V1 decodes logs with the fragment as written; copy "${fullSignature(known)}"`,
    }
  }
  return { fragment, inAbi: known !== undefined, overloads: [] }
}

function eventSignatureSpelling(reference: string, index: AbiIndex): string {
  const lookup = index.lookupEvent(reference)
  if (lookup.fragment === undefined) {
    return `"${reference}" is not an event of this ABI (${lookup.error}); write a bare event name or a full "event …" fragment`
  }
  const { name } = lookup.fragment
  const first = index.events.find((event) => event.name === name)
  const bare =
    first !== undefined && sighash(first) === sighash(lookup.fragment)
      ? `name the event "${name}" or `
      : ''
  return `"${reference}" is a signature, which V1 does not resolve; ${bare}give the full fragment "${fullSignature(lookup.fragment)}"`
}
