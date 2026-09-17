import { vi } from 'vitest'
import type { WebSocket } from 'ws'

type WebSocketEvent = 'open' | 'message' | 'close' | 'error'

export class MockWebSocket {
  listeners: { [K in WebSocketEvent]?: Array<(...args: any[]) => void> } = {}
  mock: WebSocket

  constructor() {
    this.mock = {
      on: vi.fn((...args: any): WebSocket => {
        const event = args[0] as WebSocketEvent
        const callback = args[1] as (...args: any[]) => void

        if (!this.listeners[event]) {
          this.listeners[event] = []
        }

        this.listeners[event]!.push(callback)
        return this.mock
      }),
      send: vi.fn(() => {}),
    } as unknown as WebSocket
  }

  private emit(event: WebSocketEvent, ...args: any[]) {
    this.listeners[event]?.forEach((callback) => callback(...args))
  }

  simulateOpen() {
    this.emit('open')
  }

  simulateMessage(data: Buffer) {
    this.emit('message', data)
  }
}
