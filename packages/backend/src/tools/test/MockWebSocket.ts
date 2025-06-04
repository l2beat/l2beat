import { type MockObject, mockFn, mockObject } from 'earl'
import type { WebSocket } from 'ws'

type WebSocketEvent = 'open' | 'message' | 'close' | 'error'

export class MockWebSocket {
  listeners: { [K in WebSocketEvent]?: Array<(...args: any[]) => void> } = {}
  mock: MockObject<WebSocket>

  constructor() {
    this.mock = mockObject<WebSocket>({
      on: mockFn((...args: any): WebSocket => {
        const event = args[0] as WebSocketEvent
        const callback = args[1] as (...args: any[]) => void

        if (!this.listeners[event]) {
          this.listeners[event] = []
        }

        this.listeners[event]!.push(callback)
        return this.mock
      }),
      send: mockFn(() => {}),
    })
  }

  private emit(event: WebSocketEvent, ...args: any[]) {
    this.listeners[event]?.forEach((callback) => callback(...args))
  }

  get mockObject() {
    return this.mock
  }

  simulateOpen() {
    this.emit('open')
  }

  simulateMessage(data: Buffer) {
    this.emit('message', data)
  }
}
