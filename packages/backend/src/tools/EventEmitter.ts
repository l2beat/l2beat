// Taken from: https://github.com/trusktr/events-typed (MIT License)

import { EventEmitter } from 'events'

type EventArgs<
  EventTypes,
  K extends keyof EventTypes
> = EventTypes[K] extends undefined
  ? []
  : EventTypes[K] extends any[]
  ? EventTypes[K]
  : [EventTypes[K]]

export interface IEventEmitter<EventTypes> {
  new (): IEventEmitter<EventTypes>

  addListener<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes, EventName>) => void
  ): IEventEmitter<EventTypes>

  on<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes, EventName>) => void
  ): IEventEmitter<EventTypes>

  once<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes, EventName>) => void
  ): IEventEmitter<EventTypes>

  off<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes, EventName>) => void
  ): IEventEmitter<EventTypes>

  removeAllListeners<EventName extends keyof EventTypes>(
    event?: EventName
  ): IEventEmitter<EventTypes>

  emit<EventName extends keyof EventTypes>(
    event: EventName,
    ...args: EventArgs<EventTypes, EventName>
  ): boolean

  eventNames<EventName extends keyof EventTypes>(): Array<EventName>
  setMaxListeners(n: number): IEventEmitter<EventTypes>
  getMaxListeners(): number

  listeners<EventName extends keyof EventTypes>(
    event: EventName
  ): (...args: EventArgs<EventTypes, EventName>) => void[]

  listenerCount<EventName extends keyof EventTypes>(type: EventName): number

  prependListener<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes, EventName>) => void
  ): IEventEmitter<EventTypes>

  prependOnceListener<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes, EventName>) => void
  ): IEventEmitter<EventTypes>
}

export function createEventEmitter<EventTypes>() {
  return new EventEmitter() as unknown as IEventEmitter<EventTypes>
}
