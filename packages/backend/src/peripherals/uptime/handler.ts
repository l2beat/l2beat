type UptimeResult =
  | { active: boolean; time: bigint } // TODO: remove
  | { active: true; time: number }
  | { active: false; error: string }

interface Handler<T extends { action: string }> {
  canHandle(x: { action: string }): x is T
  handle: (x: T) => Promise<UptimeResult>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UptimeHandlers = Handler<any>[]

export function makeHandler<T extends { action: string }>(
  type: T['action'],
  handle: (action: T) => Promise<UptimeResult>,
) {
  return {
    canHandle(uptime: { action: string }): uptime is T {
      return uptime.action === type
    },
    handle,
  }
}
